// src/app/api/debug/user/route.ts
// TEMPORARY DEBUG ENDPOINT - Remove in production
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
  }

  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        emailVerificationToken: true,
        username: true,
        displayName: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        ...user,
        emailVerificationToken: user.emailVerificationToken ? 'EXISTS' : null
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}