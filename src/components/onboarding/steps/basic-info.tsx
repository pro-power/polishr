// src/components/onboarding/steps/basic-info.tsx
'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, User, MapPin, Briefcase, FileText } from 'lucide-react'
import { OnboardingData } from '@/lib/templates/template-types'

interface BasicInfoStepProps {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [formData, setFormData] = useState(data.basicInfo)
  const [lookingForWork, setLookingForWork] = useState(data.lookingForWork)

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    onUpdate({ basicInfo: newFormData })
  }

  const handleWorkStatusChange = (status: boolean) => {
    setLookingForWork(status)
    onUpdate({ lookingForWork: status })
  }

  const handleNext = () => {
    onUpdate({ 
      basicInfo: formData,
      lookingForWork 
    })
    onNext()
  }

  const isValid = formData.displayName.trim() && formData.jobTitle.trim()

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tell us about yourself
          </h2>
          <p className="text-gray-600">
            This information will appear prominently on your portfolio
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Your professional name as you'd like it to appear
            </p>
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="Frontend Developer"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Your current role or the position you're seeking
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              City, state/country where you're based
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Summary
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Passionate full-stack developer with 3+ years of experience building web applications. Specializing in React, Node.js, and cloud technologies."
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              A brief description of your background and expertise (2-3 sentences)
            </p>
          </div>

          {/* Work Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Current Status
            </h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="workStatus"
                  checked={lookingForWork}
                  onChange={() => handleWorkStatusChange(true)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700">
                  🟢 Open to new opportunities
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="workStatus"
                  checked={!lookingForWork}
                  onChange={() => handleWorkStatusChange(false)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700">
                  📝 Just showcasing my work
                </span>
              </label>
            </div>
          </div>
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
            disabled={!isValid}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
              isValid
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}