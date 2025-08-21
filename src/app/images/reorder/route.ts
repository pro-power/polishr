// src/app/api/images/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createResponse, createErrorResponse } from '@/lib/api-utils'
import { z } from 'zod'

const reorderSchema = z.object({
  projectId: z.string(),
  imageIds: z.array(z.string())
})

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const { projectId, imageIds } = reorderSchema.parse(body)

    // Verify project belongs to user
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      },
      include: {
        images: true
      }
    })

    if (!project) {
      return createErrorResponse('Project not found', 404)
    }

    // Verify all image IDs belong to this project
    const projectImageIds = project.images.map(img => img.id)
    const invalidIds = imageIds.filter(id => !projectImageIds.includes(id))
    
    if (invalidIds.length > 0) {
      return createErrorResponse('Some images do not belong to this project', 400)
    }

    // Update positions in transaction
    await db.$transaction(async (tx) => {
      for (let i = 0; i < imageIds.length; i++) {
        await tx.projectImage.update({
          where: { id: imageIds[i] },
          data: { position: i }
        })
      }
    })

    // Update project's primary imageUrl to the first image
    if (imageIds.length > 0) {
      const primaryImage = await db.projectImage.findUnique({
        where: { id: imageIds[0] }
      })

      if (primaryImage) {
        await db.project.update({
          where: { id: projectId },
          data: { imageUrl: primaryImage.url }
        })
      }
    }

    return createResponse({ message: 'Images reordered successfully' })

  } catch (error) {
    console.error('Image reorder error:', error)
    
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid request data', 400)
    }
    
    return createErrorResponse('Failed to reorder images', 500)
  }
}