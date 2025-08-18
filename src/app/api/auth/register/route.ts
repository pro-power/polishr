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

    // Generate email verification token
    const verificationToken = generateEmailToken()

    // Create user
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        username: normalizedUsername,
        displayName,
        emailVerificationToken: verificationToken,
        // User starts unverified
        emailVerified: null,
      },
    })

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.displayName || user.email, // Fallback to email if displayName is null
      verificationToken
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      
      // Still return success but mention email issue
      return createResponse({
        message: 'Account created successfully, but failed to send verification email. Please request a new verification email.',
        userId: user.id,
        emailSent: false,
      })
    }

    return createResponse({
      message: 'Account created successfully! Please check your email to verify your account.',
      userId: user.id,
      emailSent: true,
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