// src/app/api/debug/verify/route.ts
// TEMPORARY DEBUG ENDPOINT - Remove in production
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Find and manually verify the user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Manually set email as verified
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date(),
        emailVerificationToken: null, // Clear the token
      },
    })

    return NextResponse.json({
      message: 'Email manually verified successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
      }
    })

  } catch (error) {
    console.error('Manual verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}