// src/app/api/auth/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    // FIXED: Always fetch fresh user data from database to avoid session cache issues
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        website: true,
        twitterUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        themeColor: true,
        isPublic: true,
        planType: true,
        createdAt: true,
        lastLoginAt: true,
        // FIXED: Include all onboarding-related fields
        onboardingCompleted: true,
        templateId: true,
        themeId: true,
        jobTitle: true,
        location: true,
        lookingForWork: true,
        resumeUrl: true,
        _count: {
          select: {
            projects: true,
            profileViews: true,
          }
        }
      },
    })

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    // FIXED: Return comprehensive user data including onboarding status
    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        emailVerified: !!user.emailVerified,
        // Add computed fields for easier access
        projectCount: user._count.projects,
        totalViews: user._count.profileViews,
        hasCompletedProfile: !!(user.bio && user.jobTitle),
        profileCompleteness: calculateProfileCompleteness(user),
      },
    })

  } catch (error) {
    console.error('Auth status error:', error)
    
    return NextResponse.json(
      { error: 'Failed to get authentication status' },
      { status: 500 }
    )
  }
}

// Helper function to calculate profile completeness percentage
function calculateProfileCompleteness(user: any): number {
  const fields = [
    user.displayName,
    user.jobTitle,
    user.bio,
    user.location,
    user.avatarUrl,
    user.website || user.githubUrl || user.linkedinUrl, // At least one social link
  ]
  
  const completedFields = fields.filter(field => field && field.length > 0).length
  return Math.round((completedFields / fields.length) * 100)
}