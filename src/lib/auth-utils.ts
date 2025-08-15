// src/lib/auth-utils.ts
import { randomBytes, createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

// Generate secure random token
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex')
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate email verification token
export async function generateEmailVerificationToken(userId: string): Promise<string> {
  const token = generateSecureToken()
  
  // Store token in user record (expires in 24 hours)
  await db.user.update({
    where: { id: userId },
    data: { 
      emailVerificationToken: token,
    },
  })
  
  return token
}

// Verify email verification token
export async function verifyEmailVerificationToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const user = await db.user.findFirst({
      where: { 
        emailVerificationToken: token,
        emailVerified: null, // Only unverified users
      },
    })

    if (!user) {
      return { success: false, error: 'Invalid or expired verification token' }
    }

    // Mark email as verified and clear token
    await db.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date(),
        emailVerificationToken: null,
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Email verification error:', error)
    return { success: false, error: 'Verification failed' }
  }
}

// Generate password reset token
export async function generatePasswordResetToken(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if email exists - return success anyway for security
      return { success: true }
    }

    const token = generateSecureToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Clean up old tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Password reset token generation error:', error)
    return { success: false, error: 'Failed to generate reset token' }
  }
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { 
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    })

    if (!resetToken) {
      return { success: false, error: 'Invalid or expired reset token' }
    }

    return { success: true, userId: resetToken.userId }
  } catch (error) {
    console.error('Password reset token verification error:', error)
    return { success: false, error: 'Token verification failed' }
  }
}

// Reset password with token
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { 
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
    })

    if (!resetToken) {
      return { success: false, error: 'Invalid or expired reset token' }
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword)

    // Update password and mark token as used
    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return { success: false, error: 'Failed to reset password' }
  }
}

// Check if username is available
export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  const existingUser = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  })

  if (!existingUser) return true
  if (excludeUserId && existingUser.id === excludeUserId) return true
  
  return false
}

// Generate unique username suggestion
export async function generateUsernameFromEmail(email: string): Promise<string> {
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  
  let username = baseUsername
  let counter = 1
  
  while (!(await isUsernameAvailable(username))) {
    username = `${baseUsername}${counter}`
    counter++
  }
  
  return username
}

// Rate limiting for authentication attempts
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>()

export function isRateLimited(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record) {
    rateLimitMap.set(identifier, { attempts: 1, lastAttempt: now })
    return false
  }

  // Reset if window has passed
  if (now - record.lastAttempt > windowMs) {
    rateLimitMap.set(identifier, { attempts: 1, lastAttempt: now })
    return false
  }

  // Increment attempts
  record.attempts++
  record.lastAttempt = now

  return record.attempts > maxAttempts
}

// Clean up rate limit records periodically
setInterval(() => {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.lastAttempt > windowMs) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes