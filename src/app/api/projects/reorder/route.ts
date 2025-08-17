// src/app/api/projects/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { projectReorderSchema } from '@/lib/validations/project'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

// PUT /api/projects/reorder - Reorder user's projects
export const PUT = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  const { projectIds } = projectReorderSchema.parse(body)

  // Verify all projects belong to the user
  const userProjects = await db.project.findMany({
    where: {
      userId: session.user.id,
      id: { in: projectIds },
    },
    select: { id: true },
  })

  if (userProjects.length !== projectIds.length) {
    return createErrorResponse('Some projects do not belong to you or do not exist', 403)
  }

  // Update positions in a transaction
  await db.$transaction(async (tx) => {
    // Update each project's position based on the new order
    for (let i = 0; i < projectIds.length; i++) {
      await tx.project.update({
        where: { id: projectIds[i] },
        data: { position: i },
      })
    }
  })

  return createResponse({ message: 'Projects reordered successfully' })
})