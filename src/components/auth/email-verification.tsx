// src/components/auth/email-verification.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Mail, Loader2, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function EmailVerification() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resending'>('loading')
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
    }
  }, [token, emailParam])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Your email has been verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?verified=true')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An unexpected error occurred')
    }
  }

  const resendVerification = async () => {
    if (!email) {
      toast.error('Please provide your email address to resend verification.')
      return
    }

    setStatus('resending')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Verification email sent - Please check your email for the new verification link.')
        setStatus('loading')
        setMessage('Please check your email for the verification link.')
      } else {
        toast.error(result.error || 'Could not resend verification email.')
        setStatus('error')
      }
    } catch (error) {
      toast.error('Failed to resend verification email.')
      setStatus('error')
    }
  }

  if (status === 'loading' || status === 'resending') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {status === 'loading' ? 'Verifying your email...' : 'Sending verification email...'}
          </h2>
          <p className="text-muted-foreground">
            {status === 'loading' 
              ? 'Please wait while we verify your email address.'
              : 'Please wait while we send you a new verification email.'
            }
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-600">
            Email verified successfully!
          </h2>
          <p className="text-muted-foreground mb-4">
            {message}
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting you to login page in a few seconds...
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/login">Continue to Login</Link>
        </Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Verification failed
          </h2>
          <p className="text-muted-foreground mb-4">
            {message || 'Your verification link may have expired or is invalid.'}
          </p>
        </div>
        
        {email && (
          <div className="space-y-2">
            <Button onClick={resendVerification} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification email
            </Button>
            <p className="text-xs text-muted-foreground">
              We'll send a new verification link to {email}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/auth/register">Try signing up again</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Default state - waiting for email verification
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Check your email
        </h2>
        <p className="text-muted-foreground mb-4">
          We've sent a verification link to {email || 'your email address'}.
          Click the link in the email to verify your account.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
      
      {email && (
        <Button onClick={resendVerification} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Resend verification email
        </Button>
      )}
      
      <div className="text-sm">
        <Link href="/auth/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  )
}