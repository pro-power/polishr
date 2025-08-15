// src/lib/api-utils.ts
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

// API response helper
export function createResponse(
  data: any, 
  status: number = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(data, { status, headers })
}

// Error response helper
export function createErrorResponse(
  message: string, 
  status: number = 500,
  details?: any
) {
  return NextResponse.json(
    { 
      error: message, 
      ...(details && { details }) 
    }, 
    { status }
  )
}

// API wrapper with error handling
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('API Error:', error)

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return createErrorResponse(
          'Validation failed',
          400,
          error.errors
        )
      }

      // Handle known error types
      if (error instanceof Error) {
        // Database constraint errors
        if (error.message.includes('Unique constraint')) {
          return createErrorResponse(
            'Resource already exists',
            409
          )
        }

        // Rate limiting errors
        if (error.message.includes('rate limit')) {
          return createErrorResponse(
            'Too many requests',
            429
          )
        }
      }

      // Generic server error
      return createErrorResponse(
        'Internal server error',
        500
      )
    }
  }
}

// Request validation helper
export async function validateRequest<T>(
  request: NextRequest,
  schema: any
): Promise<T> {
  const body = await request.json()
  return schema.parse(body)
}

// Get client IP helper
export function getClientIP(request: NextRequest): string {
  // Check various headers for client IP
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIP = request.headers.get('x-real-ip')
  const xClientIP = request.headers.get('x-client-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
  
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, get the first one
    return xForwardedFor.split(',')[0].trim()
  }
  
  if (xRealIP) {
    return xRealIP.trim()
  }
  
  if (xClientIP) {
    return xClientIP.trim()
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  // Fallback for development/local testing
  return 'unknown'
}

// CORS helper for API routes
export function withCORS(response: NextResponse): NextResponse {
  // PROD: Configure CORS properly for production
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}