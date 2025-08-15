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

    // Get full user data from database
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

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        emailVerified: !!user.emailVerified,
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