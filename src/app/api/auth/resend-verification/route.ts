// src/app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  generateEmailVerificationToken, 
  isRateLimited 
} from '@/lib/auth-utils'
import { 
  createVerificationEmail, 
  sendEmail 
} from '@/lib/email'
import { getClientIP } from '@/lib/api-utils'
import { z } from 'zod'

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    if (isRateLimited(`resend:${clientIP}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many resend attempts. Please wait before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = resendSchema.parse(body)

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        message: 'If an account with this email exists and is not verified, we\'ve sent a verification email.',
      })
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'This email address is already verified.',
      })
    }

    // Generate new verification token
    const verificationToken = await generateEmailVerificationToken(user.id)

    // Send verification email
    const emailTemplate = createVerificationEmail(
      user.email, 
      verificationToken, 
      user.displayName || undefined
    )
    
    const emailResult = await sendEmail(emailTemplate)
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Verification email sent successfully.',
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    
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