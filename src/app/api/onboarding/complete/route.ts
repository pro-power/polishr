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
  const validatedData = onboardingSchema.parse(body)

  try {
    // Update user with onboarding data
    const updatedUser = await db.user.update({
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
        
        // Status
        lookingForWork: validatedData.lookingForWork,
        onboardingCompleted: true,
        isPublic: true, // Make profile public after onboarding
      },
    })

    // Create portfolio configuration
    await db.userPortfolioConfig.upsert({
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
    await db.templateAnalytics.create({
      data: {
        templateId: validatedData.selectedTemplate,
        themeId: validatedData.selectedTheme,
        userId: session.user.id,
        action: 'selected',
      },
    })

    return createResponse({
      success: true,
      message: 'Onboarding completed successfully',
      username: updatedUser.username,
      portfolioUrl: `/${updatedUser.username}`,
    })

  } catch (error) {
    console.error('Onboarding completion error:', error)
    return createErrorResponse('Failed to complete onboarding', 500)
  }
})