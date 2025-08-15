// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordWithToken, isRateLimited } from '@/lib/auth-utils'
import { newPasswordSchema } from '@/lib/validations/auth'
import { getClientIP } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    if (isRateLimited(`reset-password:${clientIP}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please wait before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const { password, token } = newPasswordSchema.parse(body)

    // Reset password with token
    const result = await resetPasswordWithToken(token, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Password reset successfully. You can now sign in with your new password.',
    })

  } catch (error) {
    console.error('Password reset error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data. Please check your password requirements.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during password reset' },
      { status: 500 }
    )
  }
}