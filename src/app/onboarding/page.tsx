// src/app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'
import { WelcomeStep } from '@/components/onboarding/steps/welcome'
import { BasicInfoStep } from '@/components/onboarding/steps/basic-info'
import { SocialLinksStep } from '@/components/onboarding/steps/social-links'
import { TemplateSelectionStep } from '@/components/onboarding/steps/template-selection'
import { ColorThemeStep } from '@/components/onboarding/steps/color-theme'
import { PreviewStep } from '@/components/onboarding/steps/preview'
import { OnboardingData } from '@/lib/templates/template-types'
import { toast } from 'sonner'

const TOTAL_STEPS = 6

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step: 1,
    basicInfo: {
      displayName: '',
      jobTitle: '',
      bio: '',
      location: ''
    },
    socialLinks: {
      website: '',
      githubUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      resumeUrl: ''
    },
    selectedTemplate: 'minimal',
    selectedTheme: 'ocean',
    lookingForWork: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user) {
      // Pre-populate with existing user data if available
      setOnboardingData(prev => ({
        ...prev,
        basicInfo: {
          displayName: session.user.name || '',
          jobTitle: '',
          bio: '',
          location: ''
        }
      }))
    }
  }, [status, session, router])

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
      setOnboardingData(prev => ({ ...prev, step: currentStep + 1 }))
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setOnboardingData(prev => ({ ...prev, step: currentStep - 1 }))
    }
  }

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }))
  }

  const handleComplete = async () => {
  setIsLoading(true)
  
  try {
    console.log('🚀 Sending onboarding data:', onboardingData)
    
    const response = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(onboardingData),
    })

    const result = await response.json()
    console.log('📤 API response:', result)

    if (response.ok) {
      // Show success message
      toast.success('Portfolio created!', {
        description: 'Your portfolio is now live and ready to share.',
      })
      
      // CHANGED: Redirect to dashboard instead of portfolio
      console.log('✅ Success! Redirecting to dashboard...')
      router.push('/dashboard')
    } else {
      console.error('❌ API error:', result)
      toast.error('Failed to create portfolio', {
        description: result.message || 'Please try again.',
      })
    }
  } catch (error) {
    console.error('💥 Request error:', error)
    toast.error('Something went wrong', {
      description: 'Please try again or contact support.',
    })
  } finally {
    setIsLoading(false)
  }
}

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeStep
            onNext={handleNext}
            data={onboardingData}
          />
        )
      case 2:
        return (
          <BasicInfoStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <SocialLinksStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <TemplateSelectionStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 5:
        return (
          <ColorThemeStep
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 6:
        return (
          <PreviewStep
            data={onboardingData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      data={onboardingData}
    >
      {renderStep()}
    </OnboardingLayout>
  )
}