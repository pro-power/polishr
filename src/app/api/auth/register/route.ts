// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { registerSchema, RESERVED_USERNAMES } from '@/lib/validations/auth'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

// POST /api/auth/register - Register new user with auto-login flow
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()

  try {
    // Validate input
    const { email, password, username, displayName } = registerSchema.parse(body)

    // Normalize email and username
    const normalizedEmail = email.toLowerCase()
    const normalizedUsername = username.toLowerCase()

    // Check if username is reserved
    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return createErrorResponse(
        'This username is not available. Please choose a different one.',
        400
      )
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingEmail) {
      return createErrorResponse(
        'An account with this email already exists',
        409
      )
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: normalizedUsername },
    })

    if (existingUsername) {
      return createErrorResponse(
        'This username is already taken. Please choose a different one.',
        409
      )
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // FIXED: Create user with auto-verification for smooth onboarding flow
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        username: normalizedUsername,
        displayName,
        // Auto-verify for seamless onboarding experience
        emailVerified: new Date(),
        emailVerificationToken: null,
        // Portfolio system defaults
        onboardingCompleted: false,
        templateId: 'minimal',
        themeId: 'ocean',
        isPublic: false, // Keep private until onboarding is complete
        lookingForWork: true,
        // Set default theme color
        themeColor: 'blue',
        planType: 'FREE',
      },
    })

    // FIXED: Return success with auto-login flag for seamless flow
    return createResponse({
      message: 'Account created successfully! Let\'s set up your portfolio.',
      userId: user.id,
      emailSent: false, // No email verification needed for auto-login flow
      requiresOnboarding: true,
      autoLogin: true, // Flag for frontend to auto-login
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        emailVerified: true, // Auto-verified
        onboardingCompleted: false,
      },
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed: users.email')) {
        return createErrorResponse(
          'An account with this email already exists',
          409
        )
      }
      if (error.message.includes('Unique constraint failed: users.username')) {
        return createErrorResponse(
          'This username is already taken',
          409
        )
      }
    }

    return createErrorResponse(
      'Failed to create account. Please try again.',
      500
    )
  }
})