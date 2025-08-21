// src/app/api/profile/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createResponse, createErrorResponse, getClientIP } from '@/lib/api-utils'

interface RouteParams {
  params: { username: string }
}

// GET /api/profile/[username] - Get public profile by username
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = params
    
    if (!username) {
      return createErrorResponse('Username is required', 400)
    }

    // Find user by username
    const user = await db.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        website: true,
        twitterUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        themeColor: true,
        isPublic: true,
        createdAt: true,
        projects: {
          where: {
            status: 'LIVE',
            isPublic: true
          },
          include: {
            images: {
              orderBy: { position: 'asc' },
              take: 1 // Only get the primary image for performance
            },
            _count: {
              select: {
                clicks: true
              }
            }
          },
          orderBy: [
            { featured: 'desc' },
            { position: 'asc' },
            { createdAt: 'desc' }
          ]
        }
      }
    })

    if (!user) {
      return createErrorResponse('Profile not found', 404)
    }

    // Check if profile is public
    if (!user.isPublic) {
      return createErrorResponse('Profile is private', 403)
    }

    // Format projects for public consumption
    const projects = user.projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      demoUrl: project.demoUrl,
      repoUrl: project.repoUrl,
      techStack: project.techStack,
      category: project.category,
      ctaType: project.ctaType,
      ctaUrl: project.ctaUrl,
      ctaText: project.ctaText,
      featured: project.featured,
      imageUrl: project.images[0]?.url || null,
      clickCount: project._count.clicks,
      createdAt: project.createdAt
    }))

    // Track profile view (async, don't wait for completion)
    trackProfileView(user.id, request).catch(console.error)

    const profileData = {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      website: user.website,
      twitterUrl: user.twitterUrl,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      themeColor: user.themeColor,
      memberSince: user.createdAt,
      projects,
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length
    }

    return createResponse(profileData)

  } catch (error) {
    console.error('Public profile fetch error:', error)
    return createErrorResponse('Failed to fetch profile', 500)
  }
}

// Helper function to track profile views
async function trackProfileView(userId: string, request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent')
    const referer = request.headers.get('referer')

    // Create a simple visitor ID based on IP and user agent
    const visitorId = Buffer.from(`${clientIP}:${userAgent}`).toString('base64')

    // Check if this visitor has viewed this profile recently (within 24 hours)
    const recentView = await db.profileView.findFirst({
      where: {
        userId,
        visitorId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        }
      }
    })

    // Only create a new view record if no recent view exists
    if (!recentView) {
      await db.profileView.create({
        data: {
          userId,
          visitorId,
          ipAddress: clientIP,
          userAgent: userAgent?.substring(0, 500), // Limit length
          referer: referer?.substring(0, 500), // Limit length
          // TODO: Add geolocation data if needed
          // country: getCountryFromIP(clientIP),
          // city: getCityFromIP(clientIP),
          device: getDeviceType(userAgent),
          browser: getBrowserType(userAgent)
        }
      })
    }
  } catch (error) {
    console.error('Failed to track profile view:', error)
    // Don't throw error - tracking failures shouldn't break the profile fetch
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

// Helper function to determine browser type from user agent
function getBrowserType(userAgent: string | null): string {
  if (!userAgent) return 'unknown'
  
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('chrome')) return 'chrome'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('safari')) return 'safari'
  if (ua.includes('edge')) return 'edge'
  if (ua.includes('opera')) return 'opera'
  
  return 'other'
}