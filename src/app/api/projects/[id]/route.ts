// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { projectSchema } from '@/lib/validations/project'
import { createResponse, createErrorResponse } from '@/lib/api-utils'

interface RouteParams {
  params: { id: string }
}

// GET /api/projects/[id] - Get single project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { id } = params

    const project = await db.project.findFirst({
      where: {
        id,
        userId: session.user.id, // Ensure user owns this project
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            clicks: true,
            emailCaptures: true,
          },
        },
      },
    })

    if (!project) {
      return createErrorResponse('Project not found', 404)
    }

    // Format response
    const formattedProject = {
      ...project,
      imageUrl: project.images[0]?.url || null,
      totalClicks: project._count.clicks,
      totalEmailCaptures: project._count.emailCaptures,
      images: project.images,
      _count: undefined,
    }

    return createResponse(formattedProject)
  } catch (error) {
    console.error('Get project error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { id } = params
    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    // Check if project exists and belongs to user
    const existingProject = await db.project.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return createErrorResponse('Project not found', 404)
    }

    // Clean up URLs (convert empty strings to null)
    const cleanData = {
      ...validatedData,
      demoUrl: validatedData.demoUrl || null,
      repoUrl: validatedData.repoUrl || null,
      ctaUrl: validatedData.ctaUrl || null,
      description: validatedData.description || null,
      category: validatedData.category || null,
      ctaText: validatedData.ctaText || null,
    }

    // Update project
    const updatedProject = await db.project.update({
      where: { id },
      data: cleanData,
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            clicks: true,
            emailCaptures: true,
          },
        },
      },
    })

    // Format response
    const formattedProject = {
      ...updatedProject,
      imageUrl: updatedProject.images[0]?.url || null,
      totalClicks: updatedProject._count.clicks,
      totalEmailCaptures: updatedProject._count.emailCaptures,
      images: updatedProject.images,
      _count: undefined,
    }

    return createResponse(formattedProject)
  } catch (error) {
    console.error('Update project error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('Invalid input data', 400)
    }
    
    return createErrorResponse('Internal server error', 500)
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { id } = params

    // Check if project exists and belongs to user
    const existingProject = await db.project.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        images: true,
      },
    })

    if (!existingProject) {
      return createErrorResponse('Project not found', 404)
    }

    // TODO: Delete associated images from storage
    // This will be implemented when we add image upload functionality
    
    // Delete project (cascade will handle related records)
    await db.project.delete({
      where: { id },
    })

    // Reorder remaining projects to fill the gap
    await db.project.updateMany({
      where: {
        userId: session.user.id,
        position: { gt: existingProject.position },
      },
      data: {
        position: { decrement: 1 },
      },
    })

    return createResponse({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}