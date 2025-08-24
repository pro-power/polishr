// src/app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserDashboardStats } from '@/lib/data-access'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const stats = await getUserDashboardStats(session.user.id)
    return createResponse(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return createErrorResponse('Failed to fetch dashboard statistics', 500)
  }
})