// src/app/api/onboarding/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'
import { z } from 'zod'

const onboardingSchema = z.object({
  basicInfo: z.object({
    displayName: z.string().min(1, 'Display name is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    bio: z.string().optional(),
    location: z.string().optional(),
  }),
  socialLinks: z.object({
    website: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    resumeUrl: z.string().url().optional().or(z.literal('')),
  }),
  selectedTemplate: z.string().min(1),
  selectedTheme: z.string().min(1),
  lookingForWork: z.boolean(),
})

export const POST = withErrorHandling(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  console.log('📥 Received onboarding data:', body)

  try {
    const validatedData = onboardingSchema.parse(body)
    console.log('✅ Validated onboarding data:', validatedData)

    // Start database transaction for data consistency
    const result = await db.$transaction(async (prisma) => {
      // Update user with onboarding data
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          // Basic info
          displayName: validatedData.basicInfo.displayName,
          jobTitle: validatedData.basicInfo.jobTitle,
          bio: validatedData.basicInfo.bio || null,
          location: validatedData.basicInfo.location || null,
          
          // Social links (convert empty strings to null)
          website: validatedData.socialLinks.website || null,
          githubUrl: validatedData.socialLinks.githubUrl || null,
          linkedinUrl: validatedData.socialLinks.linkedinUrl || null,
          twitterUrl: validatedData.socialLinks.twitterUrl || null,
          resumeUrl: validatedData.socialLinks.resumeUrl || null,
          
          // Template/theme selection
          templateId: validatedData.selectedTemplate,
          themeId: validatedData.selectedTheme,
          
          // Status updates
          lookingForWork: validatedData.lookingForWork,
          onboardingCompleted: true, // CRITICAL: Mark onboarding as completed
          isPublic: true, // Make profile public after onboarding
          
          // Update timestamp
          updatedAt: new Date(),
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          onboardingCompleted: true,
          templateId: true,
          themeId: true,
        }
      })

      // Create/update portfolio configuration
      await prisma.userPortfolioConfig.upsert({
        where: { userId: session.user.id },
        update: {
          templateId: validatedData.selectedTemplate,
          themeId: validatedData.selectedTheme,
          sectionOrder: ['header', 'about', 'projects', 'skills', 'experience', 'contact'],
          sectionVisibility: {
            header: true,
            about: true,
            projects: true,
            skills: true,
            experience: true,
            contact: true,
          },
          customizations: {},
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          templateId: validatedData.selectedTemplate,
          themeId: validatedData.selectedTheme,
          sectionOrder: ['header', 'about', 'projects', 'skills', 'experience', 'contact'],
          sectionVisibility: {
            header: true,
            about: true,
            projects: true,
            skills: true,
            experience: true,
            contact: true,
          },
          customizations: {},
        },
      })

      // Track template selection for analytics
      await prisma.templateAnalytics.create({
        data: {
          templateId: validatedData.selectedTemplate,
          themeId: validatedData.selectedTheme,
          userId: session.user.id,
          action: 'selected',
        },
      })

      return updatedUser
    })

    console.log('✅ Database transaction completed:', result)

    return createResponse({
      success: true,
      message: 'Onboarding completed successfully',
      user: {
        id: result.id,
        username: result.username,
        displayName: result.displayName,
        onboardingCompleted: result.onboardingCompleted,
        templateId: result.templateId,
        themeId: result.themeId,
      },
      portfolioUrl: `/${result.username}`,
    })

  } catch (error) {
    console.error('💥 Onboarding completion error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        'Invalid onboarding data',
        400,
        { validationErrors: error.errors }
      )
    }

    // Handle database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return createErrorResponse('Username or email already taken', 409)
      }
    }

    return createErrorResponse('Failed to complete onboarding', 500)
  }
})