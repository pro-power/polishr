// src/components/auth/auth-layout.tsx
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Code2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Providers } from '@/components/providers'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
  showBackButton?: boolean
}

export function AuthLayout({ 
  children, 
  title, 
  description, 
  showBackButton = false 
}: AuthLayoutProps) {
  return (
    <Providers>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-sm">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Code2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">DevStack Link</span>
              </Link>
              
              {showBackButton && (
                <div className="w-full flex justify-start mb-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="login" className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to login
                    </Link>
                  </Button>
                </div>
              )}
              
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>

            {/* Form Content */}
            <div className="auth-form">
              {children}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-blue-600">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-blue-600">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Gradient background (hidden on mobile) */}
        <div className="hidden lg:block relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
          <div className="relative h-full flex flex-col justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-6">
                Build your developer portfolio in minutes
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Showcase your projects, track analytics, and grow your audience with a 
                professional developer link-in-bio page.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Project showcases with live demos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Built-in analytics and insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Custom domains and themes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>GitHub integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Providers>
  )
}