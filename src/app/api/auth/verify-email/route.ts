// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailVerificationSchema } from '@/lib/validations/auth'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

// GET /api/auth/verify-email?token=xxx - Verify email with token
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return createErrorResponse('Verification token is required', 400)
  }

  try {
    // Validate token format
    emailVerificationSchema.parse({ token })

    // Find user with this verification token
    const user = await db.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: null, // Only allow verification if not already verified
      },
    })

    if (!user) {
      return createErrorResponse(
        'Invalid or expired verification token. Please request a new verification email.',
        400
      )
    }

    // Update user as verified and remove the token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
      },
    })

    return createResponse({
      message: 'Email verified successfully',
      verified: true,
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return createErrorResponse(
      'Failed to verify email. Please try again or request a new verification email.',
      500
    )
  }
})

// POST /api/auth/verify-email - Resend verification email
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  const { email } = body

  if (!email) {
    return createErrorResponse('Email is required', 400)
  }

  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return createResponse({
        message: 'If an account with that email exists, a verification email has been sent.',
      })
    }

    if (user.emailVerified) {
      return createErrorResponse('Email is already verified', 400)
    }

    // Check rate limiting
    const { checkEmailRateLimit, generateEmailToken, sendVerificationEmail } = await import('@/lib/email')
    
    const rateCheck = checkEmailRateLimit(email)
    if (!rateCheck.allowed) {
      return createErrorResponse(
        'Too many verification emails sent. Please try again later.',
        429
      )
    }

    // Generate new verification token
    const verificationToken = generateEmailToken()

    // Update user with new token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
      },
    })

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.displayName || user.email,
      verificationToken
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return createErrorResponse(
        'Failed to send verification email. Please try again.',
        500
      )
    }

    return createResponse({
      message: 'Verification email sent successfully',
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    return createErrorResponse(
      'Failed to resend verification email. Please try again.',
      500
    )
  }
})