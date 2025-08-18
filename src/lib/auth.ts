// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { loginSchema } from '@/lib/validations/auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)

          // Find user by email
          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('EMAIL_NOT_VERIFIED')
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
          
          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.displayName,
            username: user.username,
            image: user.avatarUrl,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error('Auth error:', error)
          
          // Pass through specific error types
          if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
            throw error
          }
          
          return null
        }
      },
    }),
    
    // FUTURE: OAuth providers will be added in Phase 4/5
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user data in token
      if (user) {
        token.id = user.id
        token.username = user.username
        token.emailVerified = user.emailVerified
      }
      
      // Handle OAuth account linking in future phases
      if (account) {
        token.accessToken = account.access_token
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.emailVerified = token.emailVerified as Date
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Handle different sign-in scenarios
      
      // For credentials provider, we already handle verification in authorize()
      if (account?.provider === 'credentials') {
        return true
      }
      
      // FUTURE: Handle OAuth providers
      // if (account?.provider === 'github' || account?.provider === 'google') {
      //   // OAuth providers have verified emails by default
      //   return true
      // }
      
      return true
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Track login events for analytics
      console.log(`User ${user.email} signed in via ${account?.provider || 'credentials'}`)
      
      // FUTURE: Add analytics tracking
      // await trackUserLogin(user.id, account?.provider)
    },
    async signOut({ session, token }) {
      // Handle sign out events
      console.log(`User signed out`)
      
      // FUTURE: Add analytics tracking
      // await trackUserLogout(token.id)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  // PROD: Configure for production deployment
  // secret: process.env.NEXTAUTH_SECRET,
  // useSecureCookies: process.env.NODE_ENV === 'production',
}

// Helper function to check if user is verified
export async function isUserEmailVerified(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    })
    
    return !!user?.emailVerified
  } catch (error) {
    console.error('Error checking email verification:', error)
    return false
  }
}

// Helper function to get user verification status
export async function getUserVerificationStatus(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        emailVerified: true,
        emailVerificationToken: true,
        email: true,
        displayName: true,
      },
    })
    
    if (!user) {
      return { found: false }
    }
    
    return {
      found: true,
      verified: !!user.emailVerified,
      hasToken: !!user.emailVerificationToken,
      email: user.email,
      displayName: user.displayName,
    }
  } catch (error) {
    console.error('Error getting verification status:', error)
    return { found: false, error: true }
  }
}