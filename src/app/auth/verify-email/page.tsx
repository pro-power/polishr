// src/app/auth/verify-email/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type VerificationState = 'loading' | 'success' | 'error' | 'expired' | 'resend'

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>('loading')
  const [isResending, setIsResending] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [message, setMessage] = useState('')
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setState('resend')
      setMessage('No verification token provided. Please check your email or request a new verification link.')
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      setState('loading')
      
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`)
      const data = await response.json()

      if (response.ok && data.verified) {
        setState('success')
        setMessage('Email verified successfully! You can now sign in to your account.')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?verified=true')
        }, 3000)
      } else {
        setState('error')
        setMessage(data.error || 'Failed to verify email. The token may be invalid or expired.')
      }
    } catch (error) {
      setState('error')
      setMessage('An unexpected error occurred. Please try again.')
    }
  }

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resendEmail.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification email sent!', {
          description: 'Please check your inbox and spam folder.',
        })
        setResendEmail('')
      } else {
        toast.error(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('Failed to send verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold text-green-800">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
              <Button asChild>
                <Link href="/auth/login">Sign In Now</Link>
              </Button>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 mx-auto text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <div className="space-y-2">
              <Button
                onClick={() => setState('resend')}
                variant="outline"
                className="w-full"
              >
                Request New Verification Email
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          </div>
        )

      case 'resend':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Mail className="h-12 w-12 mx-auto text-blue-600" />
              <h2 className="text-xl font-semibold">Verify Your Email</h2>
              <p className="text-gray-600">
                Enter your email address to receive a new verification link.
              </p>
            </div>

            <form onSubmit={handleResendVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  disabled={isResending}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Send Verification Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              DevStack Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Check your spam folder or{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}