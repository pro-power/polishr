// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  generatePasswordResetToken, 
  isRateLimited 
} from '@/lib/auth-utils'
import { 
  createPasswordResetEmail, 
  sendEmail 
} from '@/lib/email'
import { passwordResetSchema } from '@/lib/validations/auth'
import { getClientIP } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    if (isRateLimited(`password-reset:${clientIP}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please wait before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = passwordResetSchema.parse(body)

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        message: 'If an account with this email exists, we\'ve sent a password reset link.',
      })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({
        message: 'Please verify your email address before resetting your password.',
      })
    }

    // Generate password reset token
    const tokenResult = await generatePasswordResetToken(email.toLowerCase())
    
    if (!tokenResult.success) {
      console.error('Failed to generate reset token:', tokenResult.error)
      return NextResponse.json(
        { error: 'Failed to generate reset token. Please try again.' },
        { status: 500 }
      )
    }

    // Get the actual token from database to send in email
    const resetToken = await db.passwordResetToken.findFirst({
      where: { 
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Failed to create reset token. Please try again.' },
        { status: 500 }
      )
    }

    // Send password reset email
    const emailTemplate = createPasswordResetEmail(
      user.email, 
      resetToken.token, 
      user.displayName || undefined
    )
    
    const emailResult = await sendEmail(emailTemplate)
    
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Don't reveal email sending failure for security
    }

    return NextResponse.json({
      message: 'If an account with this email exists, we\'ve sent a password reset link.',
    })

  } catch (error) {
    console.error('Password reset error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}