// src/app/(auth)/verify-email/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }

    if (token) {
      verifyEmail(token)
    } else if (!emailParam) {
      setStatus('error')
      setMessage('Invalid verification link')
    } else {
      setMessage('Please check your email for the verification link')
    }
  }, [token, emailParam])

  const verifyEmail = async (verificationToken: string) => {
    try {
      console.log('Verifying email with token:', verificationToken)
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      })

      const result = await response.json()
      console.log('Verification result:', result)

      if (response.ok) {
        setStatus('success')
        setMessage('Your email has been verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage('An unexpected error occurred')
    }
  }

  const manualVerify = async () => {
    if (!email) {
      alert('Please provide your email address')
      return
    }

    try {
      const response = await fetch('/api/debug/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Email manually verified for testing!')
        alert('✅ Email verified! You can now login.')
      } else {
        alert('Failed to verify: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to verify email')
    }
  }

  const resendVerification = async () => {
    if (!email) {
      alert('Please provide your email address')
      return
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Verification email sent! Check your console for the verification link.')
        setMessage('Please check your email (console) for the verification link.')
      } else {
        alert('Failed to resend: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to resend verification email')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Email Verification
        </h1>

        {status === 'loading' && (
          <div>
            <div style={{ marginBottom: '16px' }}>⏳ Verifying...</div>
            <p>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ color: 'green', fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: 'green', marginBottom: '16px' }}>Success!</h2>
            <p style={{ marginBottom: '24px' }}>{message}</p>
            <p style={{ color: '#6b7280' }}>Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ color: 'red', fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ color: 'red', marginBottom: '16px' }}>Verification Failed</h2>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>{message}</p>
            
            {email && (
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={manualVerify}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    marginRight: '12px'
                  }}
                >
                  ⚡ Manual Verify (Testing)
                </button>
                <button
                  onClick={resendVerification}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  Resend Verification Email
                </button>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Email: {email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show manual verify button even when just waiting */}
        {status === 'loading' && email && !token && (
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={manualVerify}
              style={{
                padding: '12px 24px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '12px',
                marginRight: '12px'
              }}
            >
              ⚡ Manual Verify (Testing)
            </button>
            <button
              onClick={resendVerification}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <div style={{ marginTop: '32px' }}>
          <Link 
            href="/login" 
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            Back to Login
          </Link>
        </div>

        {/* Debug info */}
        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '6px',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <strong>Debug Info:</strong><br />
          Token: {token || 'No token provided'}<br />
          Email: {email || 'No email provided'}<br />
          Status: {status}
        </div>
      </div>
    </div>
  )
}