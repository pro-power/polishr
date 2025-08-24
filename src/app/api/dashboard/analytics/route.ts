// src/app/api/dashboard/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserProjectStats, getUserAnalyticsSummary } from '@/lib/data-access'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')
  const type = searchParams.get('type') || 'summary' // 'summary' | 'detailed'

  try {
    if (type === 'detailed') {
      const projectStats = await getUserProjectStats(session.user.id)
      return createResponse(projectStats)
    } else {
      const analyticsSummary = await getUserAnalyticsSummary(session.user.id, days)
      return createResponse(analyticsSummary)
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return createErrorResponse('Failed to fetch analytics data', 500)
  }
})