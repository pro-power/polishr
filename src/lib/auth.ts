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
            throw new Error('Email not verified')
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
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
    
    // PROD: Add OAuth providers in future phases
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id
        session.user.username = token.username
      }
      return session
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      // Track login event for analytics
      console.log(`User ${user.email} signed in`)
    },
  },
  // PROD: Configure for production deployment
  // secret: process.env.NEXTAUTH_SECRET,
  // useSecureCookies: process.env.NODE_ENV === 'production',
}