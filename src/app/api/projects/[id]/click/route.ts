// src/app/api/projects/[id]/click/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createResponse, createErrorResponse, getClientIP } from '@/lib/api-utils'
import { z } from 'zod'

const clickTrackingSchema = z.object({
  clickType: z.enum(['demo', 'repo', 'cta', 'image', 'title']),
  projectId: z.string()
})

interface RouteParams {
  params: { id: string }
}

// POST /api/projects/[id]/click - Track project click
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = params
    const body = await request.json()
    const { clickType } = clickTrackingSchema.parse({ ...body, projectId })

    // Verify project exists and is public
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        isPublic: true,
        status: true,
        userId: true
      }
    })

    if (!project) {
      return createErrorResponse('Project not found', 404)
    }

    if (!project.isPublic || project.status !== 'LIVE') {
      return createErrorResponse('Project is not publicly accessible', 403)
    }

    // Track the click
    await trackProjectClick(projectId, clickType, request)

    // Update project click count
    await db.project.update({
      where: { id: projectId },
      data: {
        clickCount: { increment: 1 }
      }
    })

    return createResponse({ message: 'Click tracked successfully' })

  } catch (error) {
    console.error('Click tracking error:', error)
    
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid click data', 400)
    }
    
    return createErrorResponse('Failed to track click', 500)
  }
}

// Helper function to track project clicks
async function trackProjectClick(
  projectId: string, 
  clickType: string, 
  request: NextRequest
) {
  try {
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent')
    const referer = request.headers.get('referer')

    // Create a simple visitor ID based on IP and user agent
    const visitorId = Buffer.from(`${clientIP}:${userAgent}`).toString('base64')

    await db.projectClick.create({
      data: {
        projectId,
        clickType,
        visitorId,
        ipAddress: clientIP,
        userAgent: userAgent?.substring(0, 500), // Limit length
        referer: referer?.substring(0, 500), // Limit length
        device: getDeviceType(userAgent),
        // TODO: Add geolocation data if needed
        // country: getCountryFromIP(clientIP),
      }
    })
  } catch (error) {
    console.error('Failed to track project click:', error)
    // Don't throw error - tracking failures shouldn't break the click action
  }
}

// Helper function to determine device type from user agent
function getDeviceType(userAgent: string | null): string {
  if (!userAgent) return 'unknown'
  
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}