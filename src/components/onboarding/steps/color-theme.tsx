// src/components/onboarding/steps/color-theme.tsx
'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Palette, Check } from 'lucide-react'
import { OnboardingData } from '@/lib/templates/template-types'
import { PORTFOLIO_THEMES } from '@/lib/themes'

interface ColorThemeStepProps {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}

export const ColorThemeStep: React.FC<ColorThemeStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [selectedTheme, setSelectedTheme] = useState(data.selectedTheme)

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    onUpdate({ selectedTheme: themeId })
  }

  const handleNext = () => {
    onUpdate({ selectedTheme })
    onNext()
  }

  const themes = Object.values(PORTFOLIO_THEMES)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
            <Palette className="w-6 h-6 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pick your colors
          </h2>
          <p className="text-gray-600">
            Choose a color scheme that reflects your personality and professional style.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={`relative cursor-pointer group transition-all duration-200 ${
                selectedTheme === theme.id
                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              }`}
            >
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Color Preview */}
                <div className="aspect-[3/2] relative overflow-hidden">
                  {/* Background */}
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: theme.palette.background }}
                  >
                    {/* Header simulation */}
                    <div 
                      className="h-8 border-b"
                      style={{ 
                        backgroundColor: theme.palette.surface,
                        borderColor: theme.palette.border
                      }}
                    >
                      <div className="flex items-center h-full px-3 space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.palette.primary }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.palette.secondary }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.palette.accent }}
                        />
                      </div>
                    </div>
                    
                    {/* Content simulation */}
                    <div className="p-3 space-y-2">
                      <div 
                        className="h-3 rounded"
                        style={{ 
                          backgroundColor: theme.palette.primary,
                          width: '60%'
                        }}
                      />
                      <div 
                        className="h-2 rounded"
                        style={{ 
                          backgroundColor: theme.palette.text.muted,
                          width: '80%'
                        }}
                      />
                      <div 
                        className="h-2 rounded"
                        style={{ 
                          backgroundColor: theme.palette.text.muted,
                          width: '40%'
                        }}
                      />
                      
                      {/* Cards simulation */}
                      <div className="flex space-x-2 mt-3">
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: theme.palette.surface }}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: theme.palette.surfaceVariant }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Selection indicator */}
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: theme.palette.primary }}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                    
                    {/* Color palette preview */}
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.palette.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.palette.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.palette.accent }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {theme.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Theme Info */}
        {selectedTheme && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {themes.find(t => t.id === selectedTheme)?.name} Theme
                </h3>
                <p className="text-gray-700 mb-4">
                  {themes.find(t => t.id === selectedTheme)?.description}
                </p>
                
                {/* Font preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Typography</h4>
                    <div className="space-y-1">
                      <p 
                        className="text-lg font-semibold"
                        style={{ 
                          fontFamily: themes.find(t => t.id === selectedTheme)?.fonts.heading,
                          color: themes.find(t => t.id === selectedTheme)?.palette.text.primary
                        }}
                      >
                        Heading Font
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          fontFamily: themes.find(t => t.id === selectedTheme)?.fonts.body,
                          color: themes.find(t => t.id === selectedTheme)?.palette.text.secondary
                        }}
                      >
                        Body text will look like this in your portfolio
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Color Palette</h4>
                    <div className="flex space-x-2">
                      {[
                        { name: 'Primary', color: themes.find(t => t.id === selectedTheme)?.palette.primary },
                        { name: 'Secondary', color: themes.find(t => t.id === selectedTheme)?.palette.secondary },
                        { name: 'Accent', color: themes.find(t => t.id === selectedTheme)?.palette.accent },
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-8 h-8 rounded-full border border-gray-200 mb-1"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-600">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="text-center text-sm text-gray-500 mb-8">
          <p>
            Colors can be customized later, and Pro users get access to unlimited custom color schemes.
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
            disabled={!selectedTheme}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedTheme
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