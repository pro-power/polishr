// src/components/onboarding/steps/template-selection.tsx
'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Layout, Sparkles } from 'lucide-react'
import { OnboardingData } from '@/lib/templates/template-types'

interface TemplateSelectionStepProps {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}

const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional design focused on content',
    preview: '/templates/minimal-preview.png',
    features: ['Clean typography', 'Project grid', 'Skills showcase', 'Timeline layout'],
    category: 'professional'
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Code-focused template with syntax highlighting',
    preview: '/templates/developer-preview.png',
    features: ['Code snippets', 'GitHub integration', 'Terminal style', 'Tech stack'],
    category: 'technical'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Visual-heavy design for designers and creatives',
    preview: '/templates/creative-preview.png',
    features: ['Image gallery', 'Portfolio grid', 'Visual timeline', 'Color blocks'],
    category: 'creative'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional business-style layout',
    preview: '/templates/corporate-preview.png',
    features: ['Executive style', 'Achievement focus', 'Formal layout', 'Contact forms'],
    category: 'business'
  },
  {
    id: 'showcase',
    name: 'Showcase',
    description: 'Project-heavy template for portfolio emphasis',
    preview: '/templates/showcase-preview.png',
    features: ['Large previews', 'Project details', 'Case studies', 'Interactive demos'],
    category: 'portfolio'
  }
]

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(data.selectedTemplate)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    onUpdate({ selectedTemplate: templateId })
  }

  const handleNext = () => {
    onUpdate({ selectedTemplate })
    onNext()
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <Layout className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose your template
          </h2>
          <p className="text-gray-600">
            Pick a design that represents your style. You can always change this later.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`relative cursor-pointer group transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              }`}
            >
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Template Preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {/* Placeholder preview - will be replaced with actual screenshots */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-lg shadow-md mb-3 mx-auto flex items-center justify-center">
                        <Layout className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Preview Coming Soon</p>
                    </div>
                  </div>
                  
                  {/* Selection indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      template.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                      template.category === 'technical' ? 'bg-green-100 text-green-800' :
                      template.category === 'creative' ? 'bg-purple-100 text-purple-800' :
                      template.category === 'business' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  
                  <div className="space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="bg-indigo-50 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name} Template Selected
                </h3>
                <p className="text-indigo-800 mb-3">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-indigo-700">
                      <svg className="w-4 h-4 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="text-center text-sm text-gray-500 mb-8">
          <p>
            Don't worry about getting it perfect - you can change templates anytime from your dashboard.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!selectedTemplate}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedTemplate
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