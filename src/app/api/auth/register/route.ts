// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { registerSchema, RESERVED_USERNAMES } from '@/lib/validations/auth'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'
import { generateEmailToken, sendVerificationEmail, checkEmailRateLimit } from '@/lib/email'

// POST /api/auth/register - Register new user
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()

  try {
    // Validate input
    const { email, password, username, displayName } = registerSchema.parse(body)

    // Check rate limiting for email
    const rateCheck = checkEmailRateLimit(email)
    if (!rateCheck.allowed) {
      return createErrorResponse(
        'Too many registration attempts. Please try again later.',
        429
      )
    }

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

    // NEW: For onboarding flow, we skip email verification
    // Create user with portfolio fields and mark for onboarding
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        username: normalizedUsername,
        displayName,
        // NEW: Skip email verification for onboarding flow
        emailVerified: new Date(), // Auto-verify for onboarding flow
        emailVerificationToken: null, // No verification needed
        // NEW: Portfolio system defaults
        onboardingCompleted: false,
        templateId: 'minimal',
        themeId: 'ocean',
        isPublic: false, // Keep private until onboarding is complete
        lookingForWork: true,
      },
    })

    // NEW: Return success with onboarding flag (no email sending)
    return createResponse({
      message: 'Account created successfully! Let\'s set up your portfolio.',
      userId: user.id,
      emailSent: false, // No email sent in onboarding flow
      // NEW: Always require onboarding for new users
      requiresOnboarding: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        emailVerified: !!user.emailVerified, // true since we auto-verified
        onboardingCompleted: user.onboardingCompleted, // false
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