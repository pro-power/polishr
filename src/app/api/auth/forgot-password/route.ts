// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'
import { checkEmailRateLimit, generateEmailToken, sendPasswordResetEmail } from '@/lib/email'

// POST /api/auth/forgot-password - Send password reset email
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()

  try {
    // Validate input
    const { email } = forgotPasswordSchema.parse(body)

    // Check rate limiting
    const rateCheck = checkEmailRateLimit(email)
    if (!rateCheck.allowed) {
      return createErrorResponse(
        'Too many password reset requests. Please try again later.',
        429
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return createResponse({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Check if user's email is verified
    if (!user.emailVerified) {
      return createErrorResponse(
        'Please verify your email address before requesting a password reset.',
        400
      )
    }

    // Generate reset token
    const resetToken = generateEmailToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Delete any existing reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    })

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.displayName || user.email,
      resetToken
    )

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      return createErrorResponse(
        'Failed to send password reset email. Please try again.',
        500
      )
    }

    return createResponse({
      message: 'If an account with that email exists, a password reset link has been sent.',
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return createErrorResponse(
      'Failed to process password reset request. Please try again.',
      500
    )
  }
})