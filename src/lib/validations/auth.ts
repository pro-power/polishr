// src/lib/validations/auth.ts
import { z } from 'zod'

// Base email validation
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')

// Base password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

// Username validation
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, hyphens, and underscores'
  )
  .refine(
    (val) => !val.startsWith('-') && !val.endsWith('-'),
    'Username cannot start or end with a hyphen'
  )
  .refine(
    (val) => !val.startsWith('_') && !val.endsWith('_'),
    'Username cannot start or end with an underscore'
  )

// Display name validation
const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(50, 'Display name is too long')
  .regex(
    /^[a-zA-Z0-9\s\-_\.]+$/,
    'Display name can only contain letters, numbers, spaces, hyphens, underscores, and periods'
  )

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  username: usernameSchema,
  displayName: displayNameSchema,
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Change password schema (for authenticated users)
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Resend verification email schema
export const resendVerificationSchema = z.object({
  email: emailSchema,
})

// Update profile schema
export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Reserved usernames that cannot be registered
export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'api', 'app', 'auth', 'blog', 'dashboard', 'dev',
  'help', 'mail', 'root', 'support', 'test', 'www', 'ftp', 'email', 'webmail',
  'login', 'register', 'signup', 'signin', 'signout', 'logout', 'profile',
  'settings', 'account', 'billing', 'payment', 'invoice', 'subscribe',
  'unsubscribe', 'terms', 'privacy', 'policy', 'about', 'contact', 'home',
  'index', 'static', 'assets', 'css', 'js', 'img', 'images', 'fonts',
  'downloads', 'uploads', 'files', 'docs', 'documentation', 'guides',
  'tutorials', 'news', 'blog', 'posts', 'articles', 'events', 'security',
  'legal', 'abuse', 'spam', 'phishing', 'fraud', 'scam', 'fake', 'null',
  'undefined', 'true', 'false', 'void', 'empty', 'none', 'all', 'any'
]

// Validation helper functions
export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase())
}

export function validatePasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')

  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security')

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Include uppercase letters')

  if (/\d/.test(password)) score += 1
  else feedback.push('Include numbers')

  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else feedback.push('Include special characters (!@#$%^&*)')

  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Avoid repeating characters')
  }

  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    score -= 1
    feedback.push('Avoid common patterns')
  }

  return { score: Math.max(0, score), feedback }
}