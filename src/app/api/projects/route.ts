// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { projectSchema, projectQuerySchema } from '@/lib/validations/project'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'
import { getUserProjects } from '@/lib/data-access'

// GET /api/projects - Get user's projects (Enhanced with dynamic data access)
export const GET = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const { searchParams } = new URL(request.url)
  const queryParams = Object.fromEntries(searchParams.entries())
  
  try {
    // Validate query parameters
    const { search, category, status, featured, limit, offset } = projectQuerySchema.parse(queryParams)

    // Use the enhanced data access function for better performance and consistency
    const result = await getUserProjects(session.user.id, {
      search,
      category,
      status,
      featured,
      limit,
      offset
    })

    return createResponse(result)
    
  } catch (validationError) {
    // Fallback to original implementation if validation fails
    console.warn('Query validation failed, using fallback implementation:', validationError)
    
    // Original implementation as fallback
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { techStack: { hasSome: [search] } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    // Get projects with pagination
    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 1, // Only get the first image for list view
          },
          _count: {
            select: {
              clicks: true,
              emailCaptures: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { position: 'asc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      db.project.count({ where }),
    ])

    // Format response
    const formattedProjects = projects.map(project => ({
      ...project,
      imageUrl: project.images[0]?.url || null,
      images: undefined, // Remove images from response
      totalClicks: project._count.clicks,
      totalEmailCaptures: project._count.emailCaptures,
      _count: undefined, // Remove _count from response
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }))

    return createResponse({
      projects: formattedProjects,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })
  }
})

// POST /api/projects - Create new project (Enhanced with better error handling)
export const POST = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  const validatedData = projectSchema.parse(body)

  // Get user's current project count for position
  const projectCount = await db.project.count({
    where: { userId: session.user.id },
  })

  // Check if user has reached project limit (free tier)
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { planType: true },
  })

  if (user?.planType === 'FREE' && projectCount >= 3) {
    return createErrorResponse(
      'Project limit reached. Upgrade to Pro for unlimited projects.',
      403
    )
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

  try {
    // Create project with transaction for data consistency
    const project = await db.$transaction(async (prisma) => {
      const newProject = await prisma.project.create({
        data: {
          ...cleanData,
          userId: session.user.id,
          position: projectCount, // Position at end
        },
        include: {
          images: true,
          _count: {
            select: {
              clicks: true,
              emailCaptures: true,
            },
          },
        },
      })

      // Update user's project count in analytics if exists
      await prisma.userAnalytics.upsert({
        where: { userId: session.user.id },
        update: {
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          totalProfileViews: 0,
          totalProjectClicks: 0,
          totalEmailCaptures: 0,
        },
      }).catch(() => {
        // Ignore if UserAnalytics table doesn't exist yet
        console.log('UserAnalytics table not found, skipping update')
      })

      return newProject
    })

    // Format response
    const formattedProject = {
      ...project,
      imageUrl: project.images[0]?.url || null,
      totalClicks: project._count.clicks,
      totalEmailCaptures: project._count.emailCaptures,
      images: project.images,
      _count: undefined,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }

    return createResponse(formattedProject, 201)

  } catch (error) {
    console.error('Error creating project:', error)
    return createErrorResponse('Failed to create project', 500)
  }
})

// PUT /api/projects/[id] - Update project (if you have this method)
// DELETE /api/projects/[id] - Delete project (if you have this method)
// Add any other HTTP methods you currently have in your existing file