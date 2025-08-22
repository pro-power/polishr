// src/components/onboarding/steps/social-links.tsx
'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Github, Linkedin, Twitter, ExternalLink, Download, Link } from 'lucide-react'
import { OnboardingData } from '@/lib/templates/template-types'

interface SocialLinksStepProps {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}

export const SocialLinksStep: React.FC<SocialLinksStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [formData, setFormData] = useState(data.socialLinks)

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    onUpdate({ socialLinks: newFormData })
  }

  const handleNext = () => {
    onUpdate({ socialLinks: formData })
    onNext()
  }

  const validateUrl = (url: string, type: string) => {
    if (!url) return true // Empty is valid
    
    try {
      const urlObj = new URL(url)
      switch (type) {
        case 'github':
          return urlObj.hostname === 'github.com'
        case 'linkedin':
          return urlObj.hostname === 'linkedin.com' || urlObj.hostname === 'www.linkedin.com'
        case 'twitter':
          return urlObj.hostname === 'twitter.com' || urlObj.hostname === 'x.com'
        default:
          return true
      }
    } catch {
      return false
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Link className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect your profiles
          </h2>
          <p className="text-gray-600">
            Add your social profiles and important links. These help recruiters learn more about you.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* GitHub */}
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Github className="w-4 h-4 mr-2" />
                GitHub Profile
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Recommended
                </span>
              </div>
            </label>
            <input
              type="url"
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
              placeholder="https://github.com/yourusername"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${
                formData.githubUrl && !validateUrl(formData.githubUrl, 'github')
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
            {formData.githubUrl && !validateUrl(formData.githubUrl, 'github') && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid GitHub URL</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Showcases your code and contributions
            </p>
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn Profile
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Professional
                </span>
              </div>
            </label>
            <input
              type="url"
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/yourusername"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${
                formData.linkedinUrl && !validateUrl(formData.linkedinUrl, 'linkedin')
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
            {formData.linkedinUrl && !validateUrl(formData.linkedinUrl, 'linkedin') && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid LinkedIn URL</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Professional network and experience
            </p>
          </div>

          {/* Twitter */}
          <div>
            <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter/X Profile
              </div>
            </label>
            <input
              type="url"
              id="twitterUrl"
              value={formData.twitterUrl}
              onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
              placeholder="https://twitter.com/yourusername"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${
                formData.twitterUrl && !validateUrl(formData.twitterUrl, 'twitter')
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
            {formData.twitterUrl && !validateUrl(formData.twitterUrl, 'twitter') && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid Twitter/X URL</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Connect with the developer community
            </p>
          </div>

          {/* Personal Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Personal Website
              </div>
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">
              Your blog, portfolio site, or personal domain
            </p>
          </div>

          {/* Resume */}
          <div>
            <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Resume/CV Link
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Important
                </span>
              </div>
            </label>
            <input
              type="url"
              id="resumeUrl"
              value={formData.resumeUrl}
              onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
              placeholder="https://drive.google.com/file/d/your-resume"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">
              Link to your downloadable resume (Google Drive, Dropbox, etc.)
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <h3 className="font-medium text-indigo-900 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li>• GitHub shows your actual code - make sure your best repos are public</li>
            <li>• LinkedIn helps with professional credibility and networking</li>
            <li>• A downloadable resume makes it easy for recruiters to save your info</li>
            <li>• Don't worry - you can add or change these links anytime later</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}