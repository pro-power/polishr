// src/lib/email.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables')
}

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@devstack.link'
const DOMAIN = process.env.NEXTAUTH_URL || 'http://localhost:3000'

// Email templates
export const emailTemplates = {
  emailVerification: (name: string, verificationUrl: string) => ({
    subject: 'Verify your DevStack Link account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #3b82f6; font-size: 24px; font-weight: bold; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #3b82f6; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">DevStack Link</div>
            </div>
            
            <h2>Welcome to DevStack Link, ${name}!</h2>
            
            <p>Thank you for signing up! To complete your registration and start building your developer portfolio, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${verificationUrl}
            </p>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
            
            <div class="footer">
              <p>If you didn't create an account with DevStack Link, you can safely ignore this email.</p>
              <p>Best regards,<br>The DevStack Link Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to DevStack Link, ${name}!
      
      Thank you for signing up! To complete your registration and start building your developer portfolio, please verify your email address.
      
      Click here to verify: ${verificationUrl}
      
      This verification link will expire in 24 hours for security reasons.
      
      If you didn't create an account with DevStack Link, you can safely ignore this email.
      
      Best regards,
      The DevStack Link Team
    `
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Reset your DevStack Link password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #3b82f6; font-size: 24px; font-weight: bold; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #dc2626; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .warning { background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">DevStack Link</div>
            </div>
            
            <h2>Password Reset Request</h2>
            
            <p>Hi ${name},</p>
            
            <p>We received a request to reset the password for your DevStack Link account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>Security Notice:</strong> This password reset link will expire in 1 hour for security reasons. If you didn't request a password reset, you can safely ignore this email.
            </div>
            
            <div class="footer">
              <p>If you're having trouble with your account, please contact our support team.</p>
              <p>Best regards,<br>The DevStack Link Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hi ${name},
      
      We received a request to reset the password for your DevStack Link account. If you made this request, click the link below to reset your password:
      
      ${resetUrl}
      
      This password reset link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Best regards,
      The DevStack Link Team
    `
  })
}

// Send email verification
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${DOMAIN}/auth/verify-email?token=${token}`
  const template = emailTemplates.emailVerification(name, verificationUrl)

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return { success: false, error }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${DOMAIN}/auth/reset-password/${token}`
  const template = emailTemplates.passwordReset(name, resetUrl)

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error }
  }
}

// Generate secure random token
export function generateEmailToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Rate limiting for email sends
const emailRateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkEmailRateLimit(email: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxEmails = 5 // Max 5 emails per hour per email address

  const record = emailRateLimit.get(email)

  if (!record) {
    emailRateLimit.set(email, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (now > record.resetTime) {
    // Reset the window
    emailRateLimit.set(email, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (record.count >= maxEmails) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true }
}

// Clean up rate limit records periodically
setInterval(() => {
  const now = Date.now()
  for (const [email, record] of emailRateLimit.entries()) {
    if (now > record.resetTime) {
      emailRateLimit.delete(email)
    }
  }
}, 10 * 60 * 1000) // Clean up every 10 minutes