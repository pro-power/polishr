// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio: z.string().max(500).optional(),
  template: z.enum(['professional', 'creative', 'minimal']).optional(),
  socialLinks: z.record(z.string().url()).optional(),
  selectedSocials: z.array(z.string()).optional(),
})

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        username: true,
        bio: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
        themeColor: true,
        // Add new fields for social links and template
        // selectedSocials: true,
        // socialLinks: true,
        // template: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform existing social links to new format
    const socialLinks: Record<string, string> = {}
    const selectedSocials: string[] = []

    if (user.website) {
      socialLinks.website = user.website
      selectedSocials.push('website')
    }
    if (user.githubUrl) {
      socialLinks.github = user.githubUrl
      selectedSocials.push('github')
    }
    if (user.twitterUrl) {
      socialLinks.twitter = user.twitterUrl
      selectedSocials.push('twitter')
    }
    if (user.linkedinUrl) {
      socialLinks.linkedin = user.linkedinUrl
      selectedSocials.push('linkedin')
    }

    return NextResponse.json({
      ...user,
      socialLinks,
      selectedSocials,
      template: 'professional' // Default template
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Check if username is available (if being changed)
    if (validatedData.username) {
      const existingUser = await db.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id: session.user.id }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (validatedData.displayName !== undefined) {
      updateData.displayName = validatedData.displayName
    }
    if (validatedData.username !== undefined) {
      updateData.username = validatedData.username
    }
    if (validatedData.bio !== undefined) {
      updateData.bio = validatedData.bio
    }

    // Handle social links - map to existing fields for now
    if (validatedData.socialLinks) {
      const { socialLinks } = validatedData
      updateData.website = socialLinks.website || null
      updateData.githubUrl = socialLinks.github || null
      updateData.twitterUrl = socialLinks.twitter || null
      updateData.linkedinUrl = socialLinks.linkedin || null
    }

    // TODO: Add template and additional social links to schema
    // For now, we'll store in a JSON field or add to schema later

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        bio: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Profile update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}