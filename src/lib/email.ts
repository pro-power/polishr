// src/lib/email.ts
import { Resend } from 'resend'

// PROD: Configure with actual Resend API key
const resend = new Resend(process.env.RESEND_API_KEY || 'dev-key')

const APP_NAME = process.env.APP_NAME || 'DevStack Link'
const APP_URL = process.env.APP_URL || 'http://localhost:3000'
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@devstack.link'

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text: string
}

// Email verification template
export function createVerificationEmail(
  email: string, 
  token: string, 
  displayName?: string
): EmailTemplate {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`
  const name = displayName || email.split('@')[0]

  return {
    to: email,
    subject: `Welcome to ${APP_NAME} - Verify your email`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .button { display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            
            <h1>Welcome to ${APP_NAME}, ${name}!</h1>
            
            <p>Thanks for signing up! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <div class="footer">
              <p>If you didn't create an account with ${APP_NAME}, you can safely ignore this email.</p>
              <p>Need help? Contact us at support@devstack.link</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to ${APP_NAME}, ${name}!
      
      Thanks for signing up! To get started, please verify your email address by visiting:
      ${verificationUrl}
      
      This verification link will expire in 24 hours.
      
      If you didn't create an account with ${APP_NAME}, you can safely ignore this email.
      
      Need help? Contact us at support@devstack.link
    `,
  }
}

// Password reset template
export function createPasswordResetEmail(
  email: string, 
  token: string,
  displayName?: string
): EmailTemplate {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`
  const name = displayName || email.split('@')[0]

  return {
    to: email,
    subject: `${APP_NAME} - Password Reset Request`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            
            <h1>Password Reset Request</h1>
            
            <p>Hi ${name},</p>
            
            <p>We received a request to reset your password for your ${APP_NAME} account. Click the button below to create a new password:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
            
            <p>This password reset link will expire in 1 hour.</p>
            
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
              <p>Need help? Contact us at support@devstack.link</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hi ${name},
      
      We received a request to reset your password for your ${APP_NAME} account. 
      
      Click this link to create a new password:
      ${resetUrl}
      
      This password reset link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Need help? Contact us at support@devstack.link
    `,
  }
}

// Send email function
export async function sendEmail(template: EmailTemplate): Promise<{ success: boolean; error?: string }> {
  try {
    // PROD: Use actual Resend service in production
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent in production:')
      console.log(`To: ${template.to}`)
      console.log(`Subject: ${template.subject}`)
      console.log(`Preview: ${template.text.slice(0, 100)}...`)
      return { success: true }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}