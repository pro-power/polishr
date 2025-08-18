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
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    username?: string | null
    image?: string | null
    emailVerified?: Date | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string | null
    emailVerified?: Date | null
  }
}