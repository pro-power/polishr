// src/app/auth/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { registerSchema, type RegisterInput, validatePasswordStrength } from '@/lib/validations/auth'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')

  // Update password state for strength indicator
  useEffect(() => {
    setPassword(watchedPassword)
  }, [watchedPassword])

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        // NEW: Check if user needs onboarding
        if (result.requiresOnboarding) {
          // Auto-sign them in first
          const signInResult = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          })

          if (signInResult?.ok) {
            // Redirect to onboarding instead of email verification
            toast.success('Account created!', {
              description: 'Let\'s set up your portfolio.',
            })
            router.push('/onboarding')
          } else {
            // Fallback to email verification if sign-in fails
            setRegistrationComplete(true)
            setRegisteredEmail(data.email)
            toast.success('Account created!', {
              description: 'Please check your email to verify your account.',
            })
          }
        } else {
          // Existing flow for email verification
          setRegistrationComplete(true)
          setRegisteredEmail(data.email)
          
          if (result.emailSent) {
            toast.success('Account created!', {
              description: 'Please check your email to verify your account.',
            })
          } else {
            toast.warning('Account created but email not sent', {
              description: 'You may need to request a verification email.',
            })
          }
        }
      } else {
        toast.error(result.error || 'Failed to create account')
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

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-black-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                <h2 className="text-xl font-semibold text-green-800">
                  Registration Successful!
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    We've sent a verification email to:
                  </p>
                  <p className="font-medium text-gray-900">{registeredEmail}</p>
                  <p className="text-sm text-gray-500">
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Next Steps:
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the verification link in the email</li>
                    <li>Return here to sign in to your account</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/auth/verify-email">
                      <Mail className="mr-2 h-4 w-4" />
                      Didn't get the email?
                    </Link>
                  </Button>
                  
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/auth/login">
                      Already verified? Sign in
                    </Link>
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
    <div className="min-h-screen bg-black-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              DevStack Link
            </CardTitle>
            <p className="mt-2 text-sm text-gray-600">
              Create your developer portfolio
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  autoComplete="username"
                  disabled={isLoading}
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  This will be your profile URL: devstack.link/username
                </p>
              </div>

              {/* Display Name Field */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isLoading}
                  {...register('displayName')}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive">{errors.displayName.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
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

              {/* Terms Agreement */}
              <div className="flex items-center space-x-2">
                <Controller
                  name="agreeToTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  )}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || passwordStrength.score < 2}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you'll be able to showcase your projects and build a professional developer portfolio.
          </p>
        </div>
      </div>
    </div>
  )
}