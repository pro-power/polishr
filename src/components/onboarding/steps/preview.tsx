// src/components/onboarding/steps/preview.tsx
'use client'

import React from 'react'
import { ArrowLeft, ExternalLink, Loader2, Sparkles, Eye } from 'lucide-react'
import { OnboardingData } from '@/lib/templates/template-types'

interface PreviewStepProps {
  data: OnboardingData
  onComplete: () => void
  onPrevious: () => void
  isLoading: boolean
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  data,
  onComplete,
  onPrevious,
  isLoading
}) => {
  const portfolioUrl = `yourusername.devstack.link` // Will be actual username after creation

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to launch!
          </h2>
          <p className="text-gray-600">
            Here's a preview of what your portfolio will look like. You can always customize it more later.
          </p>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-8 shadow-lg">
          {/* Browser mockup header */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 ml-4">
                {portfolioUrl}
              </div>
            </div>
          </div>

          {/* Portfolio content preview */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-96">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {data.basicInfo.displayName || 'Your Name'}
              </h1>
              <p className="text-lg text-blue-600 mb-2">
                {data.basicInfo.jobTitle || 'Your Job Title'}
              </p>
              <p className="text-gray-600 max-w-md mx-auto">
                {data.basicInfo.bio || 'Your professional bio will appear here, showcasing your expertise and experience.'}
              </p>
            </div>

            {/* Social links preview */}
            <div className="flex justify-center space-x-4 mb-8">
              {data.socialLinks.githubUrl && (
                <div className="px-3 py-1 bg-gray-200 rounded text-sm">GitHub</div>
              )}
              {data.socialLinks.linkedinUrl && (
                <div className="px-3 py-1 bg-blue-200 rounded text-sm">LinkedIn</div>
              )}
              {data.socialLinks.resumeUrl && (
                <div className="px-3 py-1 bg-green-200 rounded text-sm">Resume</div>
              )}
            </div>

            {/* Projects section preview */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="w-full h-24 bg-gray-200 rounded mb-3"></div>
                    <h3 className="font-semibold text-gray-900 mb-1">Project {i}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Your project descriptions will appear here
                    </p>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">React</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">Node.js</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 mb-2">
                Your Portfolio Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
                <div>
                  <p><strong>Template:</strong> {data.selectedTemplate}</p>
                  <p><strong>Theme:</strong> {data.selectedTheme}</p>
                  <p><strong>Status:</strong> {data.lookingForWork ? 'Open to work' : 'Showcasing work'}</p>
                </div>
                <div>
                  <p><strong>Social Links:</strong> {Object.values(data.socialLinks).filter(Boolean).length} connected</p>
                  <p><strong>Location:</strong> {data.basicInfo.location || 'Not specified'}</p>
                  <p><strong>URL:</strong> {portfolioUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">
            🚀 What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Your portfolio will be published at {portfolioUrl}
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              You'll be redirected to your dashboard to add projects
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Start sharing your portfolio with potential employers
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              Customize design and add more content anytime
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <button
            onClick={onComplete}
            disabled={isLoading}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Portfolio...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5 mr-2" />
                Create My Portfolio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}