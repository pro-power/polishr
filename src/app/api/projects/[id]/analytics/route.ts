// src/app/api/projects/[id]/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getProjectAnalytics } from '@/lib/data-access'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest, 
  context: RouteContext
) {
  return withErrorHandling(async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { id } = await context.params
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')

    try {
      const analytics = await getProjectAnalytics(id, session.user.id, days)
      return createResponse(analytics)
    } catch (error) {
      console.error('Error fetching project analytics:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        return createErrorResponse('Project not found', 404)
      }
      
      return createErrorResponse('Failed to fetch project analytics', 500)
    }
  })(request)
}