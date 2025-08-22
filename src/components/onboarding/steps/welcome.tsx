// src/components/onboarding/steps/welcome.tsx
'use client'

import React from 'react'
import { ArrowRight, Sparkles, Eye, Zap } from 'lucide-react'
import { OnboardingData } from '@/lib/templates/template-types'

interface WelcomeStepProps {
  onNext: () => void
  data: OnboardingData
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, data }) => {
  return (
    <div className="p-8 text-center">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Let's Build Your Portfolio
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Create a professional developer portfolio in just a few minutes. 
            We'll help you showcase your projects, skills, and experience to land your next opportunity.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Design</h3>
            <p className="text-sm text-gray-600">
              Choose from beautiful, mobile-responsive templates designed for developers
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup</h3>
            <p className="text-sm text-gray-600">
              Get online fast with our guided setup process - no coding required
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Stand Out</h3>
            <p className="text-sm text-gray-600">
              Showcase your projects, skills, and experience in a way that gets noticed
            </p>
          </div>
        </div>

        {/* What We'll Create */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-indigo-900 mb-4">What we'll create together:</h3>
          <ul className="text-left space-y-2 text-indigo-800">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
              Professional header with your photo and contact info
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
              Project showcase highlighting your best work
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
              Skills and technology stack display
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
              Experience and education timeline
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
              Custom domain (yourusername.devstack.link)
            </li>
          </ul>
        </div>

        {/* Time Estimate */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg border border-yellow-200">
            <span className="font-medium">⏱️ Takes about 3-4 minutes</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onNext}
          className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Let's Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          You can always come back and customize everything later
        </p>
      </div>
    </div>
  )
}