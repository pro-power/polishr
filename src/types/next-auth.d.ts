// src/types/next-auth.d.ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username?: string | null
      image?: string | null
      emailVerified?: Date | null
      // FIXED: Add onboarding and portfolio fields
      onboardingCompleted?: boolean
      templateId?: string
      themeId?: string
      jobTitle?: string
      displayName?: string
      bio?: string
      location?: string
      lookingForWork?: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    username?: string | null
    image?: string | null
    emailVerified?: Date | null
    // FIXED: Add onboarding and portfolio fields
    onboardingCompleted?: boolean
    templateId?: string
    themeId?: string
    jobTitle?: string
    displayName?: string
    bio?: string
    location?: string
    lookingForWork?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string | null
    emailVerified?: Date | null
    // FIXED: Add onboarding and portfolio fields
    onboardingCompleted?: boolean
    templateId?: string
    themeId?: string
  }
}