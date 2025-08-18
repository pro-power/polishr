// src/app/auth/reset-password/[token]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { resetPasswordSchema, type ResetPasswordInput, validatePasswordStrength } from '@/lib/validations/auth'

interface TokenValidationResult {
  valid: boolean
  email?: string
  expiresAt?: string
  error?: string
}

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenValidation, setTokenValidation] = useState<TokenValidationResult | null>(null)
  const [passwordReset, setPasswordReset] = useState(false)
  const [password, setPassword] = useState('')

  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
    },
  })

  const watchedPassword = watch('password', '')

  // Validate token on page load
  useEffect(() => {
    if (token) {
      validateToken(token)
    }
  }, [token])

  // Update password state for strength indicator
  useEffect(() => {
    setPassword(watchedPassword)
  }, [watchedPassword])

  const validateToken = async (resetToken: string) => {
    try {
      const response = await fetch(`/api/auth/reset-password?token=${resetToken}`)
      const data = await response.json()

      if (response.ok) {
        setTokenValidation({
          valid: true,
          email: data.email,
          expiresAt: data.expiresAt,
        })
      } else {
        setTokenValidation({
          valid: false,
          error: data.error || 'Invalid or expired reset token',
        })
      }
    } catch (error) {
      setTokenValidation({
        valid: false,
        error: 'Failed to validate reset token',
      })
    }
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setPasswordReset(true)
        toast.success('Password reset successfully!', {
          description: 'You can now sign in with your new password.',
        })

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?reset=success')
        }, 3000)
      } else {
        toast.error(result.error || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const passwordStrength = password ? validatePasswordStrength(password) : { score: 0, feedback: [] }

  const renderPasswordStrength = () => {
    if (!password) return null

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${colors[passwordStrength.score] || 'bg-gray-200'}`}
              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${passwordStrength.score >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
            {labels[passwordStrength.score] || 'Very Weak'}
          </span>
        </div>
        {passwordStrength.feedback.length > 0 && (
          <ul className="text-xs text-gray-600 space-y-1">
            {passwordStrength.feedback.slice(0, 3).map((feedback, index) => (
              <li key={index}>• {feedback}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (tokenValidation === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <h2 className="text-xl font-semibold">Validating reset token...</h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!tokenValidation.valid) {
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
              <div className="text-center space-y-4">
                <XCircle className="h-12 w-12 mx-auto text-red-600" />
                <h2 className="text-xl font-semibold text-red-800">Invalid Reset Link</h2>
                <p className="text-gray-600">{tokenValidation.error}</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/auth/forgot-password">Request New Reset Link</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/auth/login">Back to Login</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (passwordReset) {
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
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Password Reset Complete!</h2>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Redirecting to login page...</p>
                  <Button asChild>
                    <Link href="/auth/login">Sign In Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Shield className="h-12 w-12 mx-auto text-blue-600" />
                <h2 className="text-xl font-semibold">Reset Your Password</h2>
                <p className="text-gray-600">
                  Resetting password for: <span className="font-medium">{tokenValidation.email}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      disabled={isLoading}
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                  {renderPasswordStrength()}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      disabled={isLoading}
                      {...register('confirmPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || passwordStrength.score < 2}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}