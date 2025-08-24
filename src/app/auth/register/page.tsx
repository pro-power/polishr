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
        // FIXED: Handle auto-login flow for seamless onboarding
        if (result.autoLogin && result.requiresOnboarding) {
          // Auto-sign them in for seamless experience
          console.log('🔐 Auto-logging in user for onboarding...')
          const signInResult = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          })

          if (signInResult?.ok) {
            toast.success('Welcome to DevStack Link!', {
              description: 'Let\'s set up your portfolio in just a few steps.',
            })
            
            // Small delay for session to be established
            setTimeout(() => {
              router.push('/onboarding')
            }, 100)
          } else {
            console.error('Auto-login failed:', signInResult?.error)
            toast.error('Account created but login failed', {
              description: 'Please try logging in manually.',
            })
            router.push('/auth/login')
          }
        } else {
          // Fallback: redirect to login if auto-login is not enabled
          toast.success('Account created successfully!', {
            description: 'Please log in to continue.',
          })
          router.push('/auth/login')
        }
      } else {
        toast.error('Registration failed', {
          description: result.message || 'Please try again.',
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Something went wrong', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength calculation
  const passwordStrength = password ? validatePasswordStrength(password) : { score: 0, feedback: [] }
  
  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return '#ef4444' // red
    if (score <= 4) return '#f59e0b' // yellow
    return '#10b981' // green
  }

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'Weak'
    if (score <= 4) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create your account
          </CardTitle>
          <p className="text-gray-400 text-center">
            Join DevStack Link and showcase your projects
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-200">
                Full Name
              </Label>
              <Input
                id="displayName"
                placeholder="John Doe"
                type="text"
                autoComplete="name"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-red-400 text-sm">{errors.displayName.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200">
                Username
              </Label>
              <Input
                id="username"
                placeholder="johndoe"
                type="text"
                autoComplete="username"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-400 text-sm">{errors.username.message}</p>
              )}
              <p className="text-gray-500 text-xs">
                Your portfolio will be available at devstack.link/yourusername
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                autoComplete="email"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(10, (passwordStrength.score / 6) * 100)}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength.score),
                        }}
                      />
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                    >
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="text-xs text-gray-400 space-y-1">
                      {passwordStrength.feedback.slice(0, 3).map((feedback, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span>{feedback}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions - FIXED: Use correct field name */}
            <div className="flex items-center space-x-2">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    id="terms"
                    checked={value || false}
                    onCheckedChange={(checked) => onChange(checked === true)}
                    className="border-gray-600 data-[state=checked]:bg-indigo-600"
                  />
                )}
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {/* FIXED: Use correct field name for error display */}
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm">{errors.agreeToTerms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Already have an account?</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in to existing account
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}