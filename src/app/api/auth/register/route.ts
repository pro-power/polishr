// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  hashPassword, 
  generateEmailVerificationToken, 
  isRateLimited,
  generateUsernameFromEmail 
} from '@/lib/auth-utils'
import { 
  createVerificationEmail, 
  sendEmail 
} from '@/lib/email'
import { registerSchema } from '@/lib/validations/auth'
import { getClientIP } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    if (isRateLimited(`register:${clientIP}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validatedData = registerSchema.parse(body)
    const { email, password, displayName } = validatedData

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      // Don't reveal if user exists for security - but check if verified
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 400 }
        )
      } else {
        // User exists but not verified - resend verification
        const token = await generateEmailVerificationToken(existingUser.id)
        const emailTemplate = createVerificationEmail(
          existingUser.email, 
          token, 
          existingUser.displayName || undefined
        )
        
        await sendEmail(emailTemplate)
        
        return NextResponse.json({
          message: 'Registration successful. Please check your email for verification.',
          userId: existingUser.id,
        })
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Generate unique username from email
    const suggestedUsername = await generateUsernameFromEmail(email)

    // Create new user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        displayName: displayName || null,
        username: suggestedUsername,
        themeColor: 'blue', // Default theme
        planType: 'FREE',
        isPublic: true,
        createdAt: new Date(),
      },
    })

    // Generate email verification token
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
      // Don't fail registration if email fails - user can resend later
    }

    // Return success (don't include sensitive data)
    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification.',
      userId: user.id,
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data. Please check your information.' },
        { status: 400 }
      )
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}