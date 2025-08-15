// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailVerificationToken } from '@/lib/auth-utils'
import { emailVerificationSchema } from '@/lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const { token } = emailVerificationSchema.parse(body)

    // Verify the email verification token
    const result = await verifyEmailVerificationToken(token)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Email verified successfully. You can now sign in.',
      userId: result.userId,
    })

  } catch (error) {
    console.error('Email verification error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid verification token format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during verification' },
      { status: 500 }
    )
  }
}