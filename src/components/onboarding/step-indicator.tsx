// src/components/onboarding/step-indicator.tsx
'use client'

import React from 'react'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps
}) => {
  return (
    <nav aria-label="Progress" className="flex items-center justify-center">
      <ol className="flex items-center space-x-5">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <li key={step} className="relative">
              {/* Connecting line (hidden for first step) */}
              {index > 0 && (
                <div
                  className={`absolute inset-0 flex items-center`}
                  aria-hidden="true"
                >
                  <div
                    className={`h-0.5 w-full ${
                      isCompleted 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-200'
                    }`}
                    style={{ 
                      right: '50%',
                      marginRight: '2.5rem'
                    }}
                  />
                </div>
              )}
              
              {/* Step indicator */}
              <div className="relative flex flex-col items-center group">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'bg-indigo-600 border-indigo-600'
                      : isCurrent
                      ? 'border-indigo-600 bg-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
                
                {/* Step label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent
                      ? 'text-indigo-600'
                      : isCompleted
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}