// src/components/onboarding/onboarding-layout.tsx
'use client'

import React from 'react'
import { OnboardingData } from '@/lib/templates/template-types'
import { StepIndicator } from './step-indicator'

interface OnboardingLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  data: OnboardingData
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  data
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                DevStack Link
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                Portfolio Setup
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={[
              'Welcome',
              'Basic Info',
              'Social Links',
              'Template',
              'Colors',
              'Preview'
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>
              Creating your professional developer portfolio • 
              Your data is secure and only visible to you until you publish
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}