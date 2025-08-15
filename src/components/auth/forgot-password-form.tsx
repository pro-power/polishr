// src/components/auth/forgot-password-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { passwordResetSchema, type PasswordResetInput } from '@/lib/validations/auth'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<PasswordResetInput>({
    resolver: zodResolver(passwordResetSchema),
  })

  const onSubmit = async (data: PasswordResetInput) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (response.ok) {
        setEmailSent(true)
        toast.success('Reset link sent', {
          description: 'If an account with that email exists, we\'ve sent you a password reset link.',
        })
      } else {
        toast.error('Something went wrong', {
          description: result.error || 'Failed to send reset email. Please try again.',
        })
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Check your email
          </h2>
          <p className="text-muted-foreground mb-4">
            If an account with <strong>{getValues('email')}</strong> exists, 
            we've sent you a password reset link.
          </p>
          <p className="text-sm text-muted-foreground">
            The link will expire in 1 hour. Didn't receive the email? Check your spam folder.
          </p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={() => setEmailSent(false)} 
            variant="outline" 
            className="w-full"
          >
            Try a different email
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Forgot your password?
        </h2>
        <p className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="ghost">
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </div>
    </div>
  )
}