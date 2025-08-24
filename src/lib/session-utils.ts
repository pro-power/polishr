// src/lib/session-utils.ts
import { Session } from 'next-auth'

/**
 * Utility function to refresh user session data after onboarding completion
 * This ensures the session reflects the latest database state
 */
export async function refreshUserSession(session: Session | null): Promise<Session | null> {
  if (!session?.user?.id) {
    return null
  }

  try {
    const response = await fetch('/api/auth/status', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user status')
    }

    const result = await response.json()

    if (result.authenticated && result.user) {
      // Update session with fresh data from database
      return {
        ...session,
        user: {
          ...session.user,
          ...result.user,
          // Ensure critical flags are updated
          onboardingCompleted: result.user.onboardingCompleted,
          emailVerified: result.user.emailVerified,
        },
      }
    }

    return session
  } catch (error) {
    console.error('Failed to refresh session:', error)
    return session
  }
}

/**
 * Check if user needs to complete onboarding
 */
export function needsOnboarding(user: any): boolean {
  return !user?.onboardingCompleted
}

/**
 * Check if user needs email verification
 */
export function needsEmailVerification(user: any): boolean {
  return !user?.emailVerified
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(user: any): number {
  if (!user) return 0

  const fields = [
    user.displayName,
    user.jobTitle,
    user.bio,
    user.location,
    user.avatarUrl,
    user.website || user.githubUrl || user.linkedinUrl, // At least one social link
  ]

  const completedFields = fields.filter(field => field && field.length > 0).length
  return Math.round((completedFields / fields.length) * 100)
}

/**
 * Determine what setup steps the user still needs
 */
export function getRequiredSetupSteps(user: any): string[] {
  const steps: string[] = []

  if (needsOnboarding(user)) {
    steps.push('onboarding')
  }

  if (needsEmailVerification(user)) {
    steps.push('email-verification')
  }

  if (!user?.bio || !user?.jobTitle) {
    steps.push('profile-completion')
  }

  if (user?._count?.projects === 0 || user?.projectCount === 0) {
    steps.push('first-project')
  }

  return steps
}

/**
 * Get user-friendly setup step messages
 */
export function getSetupStepMessage(step: string): string {
  const messages = {
    'onboarding': 'Complete your portfolio setup',
    'email-verification': 'Verify your email address',
    'profile-completion': 'Complete your profile information',
    'first-project': 'Add your first project',
  }

  return messages[step as keyof typeof messages] || 'Complete setup'
}

/**
 * Priority order for setup steps
 */
export function getNextSetupStep(user: any): string | null {
  const steps = getRequiredSetupSteps(user)
  
  // Return highest priority step
  const priority = ['onboarding', 'email-verification', 'first-project', 'profile-completion']
  
  for (const priorityStep of priority) {
    if (steps.includes(priorityStep)) {
      return priorityStep
    }
  }

  return null
}