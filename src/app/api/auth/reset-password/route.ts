// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { withErrorHandling, createResponse, createErrorResponse } from '@/lib/api-utils'

// POST /api/auth/reset-password - Reset password with token
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()

  try {
    // Validate input
    const { token, password } = resetPasswordSchema.parse(body)

    // Find valid reset token
    const resetTokenRecord = await db.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(), // Token must not be expired
        },
      },
      include: {
        user: true,
      },
    })

    if (!resetTokenRecord) {
      return createErrorResponse(
        'Invalid or expired reset token. Please request a new password reset.',
        400
      )
    }

    // Hash the new password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Update user's password and mark token as used
    await db.$transaction([
      // Update user password
      db.user.update({
        where: { id: resetTokenRecord.userId },
        data: {
          passwordHash,
          // Update lastLoginAt to current time since password was successfully reset
          updatedAt: new Date(),
        },
      }),
      // Mark token as used
      db.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { used: true },
      }),
      // Delete all other unused tokens for this user
      db.passwordResetToken.deleteMany({
        where: {
          userId: resetTokenRecord.userId,
          used: false,
          id: { not: resetTokenRecord.id },
        },
      }),
    ])

    return createResponse({
      message: 'Password reset successfully. You can now sign in with your new password.',
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return createErrorResponse(
      'Failed to reset password. Please try again or request a new reset link.',
      500
    )
  }
})

// GET /api/auth/reset-password?token=xxx - Validate reset token
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return createErrorResponse('Reset token is required', 400)
  }

  try {
    // Check if token exists and is valid
    const resetTokenRecord = await db.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            email: true,
            displayName: true,
          },
        },
      },
    })

    if (!resetTokenRecord) {
      return createErrorResponse(
        'Invalid or expired reset token',
        400
      )
    }

    return createResponse({
      valid: true,
      email: resetTokenRecord.user.email,
      expiresAt: resetTokenRecord.expiresAt,
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return createErrorResponse(
      'Failed to validate reset token',
      500
    )
  }
})