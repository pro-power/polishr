// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

// PROD: Add connection pooling configuration for production
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? 
  new PrismaClient({
    // Development logging
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    
    // PROD: Add datasource configuration for production
    // datasources: {
    //   db: {
    //     url: process.env.DATABASE_URL,
    //   },
    // },
  })

// Prevent multiple instances during development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Database health check utility
export async function checkDatabaseConnection() {
  try {
    await db.$queryRaw`SELECT 1`
    return { success: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Graceful shutdown for production
process.on('beforeExit', async () => {
  await db.$disconnect()
})