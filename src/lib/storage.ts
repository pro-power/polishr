// src/lib/storage.ts
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export interface StorageResult {
  url: string
  filename: string
  size: number
  mimetype: string
}

// For development/self-hosted: Local file storage
export class LocalStorage {
  private uploadDir: string

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads')
    this.ensureUploadDir()
  }

  private async ensureUploadDir() {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(file: UploadedFile, subdir: string = ''): Promise<StorageResult> {
    const ext = path.extname(file.originalname)
    const filename = `${crypto.randomUUID()}${ext}`
    const subdirPath = path.join(this.uploadDir, subdir)
    
    // Ensure subdirectory exists
    if (!existsSync(subdirPath)) {
      await mkdir(subdirPath, { recursive: true })
    }

    const filepath = path.join(subdirPath, filename)
    await writeFile(filepath, file.buffer)

    const url = `/uploads/${subdir ? subdir + '/' : ''}${filename}`

    return {
      url,
      filename,
      size: file.size,
      mimetype: file.mimetype
    }
  }

  async deleteFile(filename: string, subdir: string = ''): Promise<void> {
    const filepath = path.join(this.uploadDir, subdir, filename)
    try {
      const fs = await import('fs/promises')
      await fs.unlink(filepath)
    } catch (error) {
      console.error('Failed to delete file:', error)
      // Don't throw error if file doesn't exist
    }
  }
}

// For production: AWS S3 storage (future implementation)
export class S3Storage {
  private bucket: string
  private region: string

  constructor(bucket: string, region: string) {
    this.bucket = bucket
    this.region = region
  }

  async uploadFile(file: UploadedFile, subdir: string = ''): Promise<StorageResult> {
    // TODO: Implement S3 upload
    // This will be implemented when deploying to production
    throw new Error('S3 storage not implemented yet')
  }

  async deleteFile(filename: string, subdir: string = ''): Promise<void> {
    // TODO: Implement S3 deletion
    throw new Error('S3 storage not implemented yet')
  }
}

// Storage factory
export function createStorage() {
  const storageType = process.env.STORAGE_TYPE || 'local'
  
  switch (storageType) {
    case 's3':
      return new S3Storage(
        process.env.AWS_S3_BUCKET!,
        process.env.AWS_REGION!
      )
    case 'local':
    default:
      return new LocalStorage()
  }
}

// Image validation utilities
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
] as const

export const MAX_FILE_SIZE = {
  FREE: 5 * 1024 * 1024, // 5MB
  PRO: 10 * 1024 * 1024, // 10MB
} as const

export function validateImageFile(file: UploadedFile, userPlan: 'FREE' | 'PRO' = 'FREE'): string | null {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype as any)) {
    return 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
  }

  // Check file size
  const maxSize = MAX_FILE_SIZE[userPlan]
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    return `File too large. Maximum size is ${maxSizeMB}MB for ${userPlan} plan.`
  }

  return null // No errors
}

// Image processing utilities (using sharp when available)
export async function processImage(buffer: Buffer, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
} = {}): Promise<Buffer> {
  try {
    // Try to use sharp for image processing
    const sharp = await import('sharp')
    
    let pipeline = sharp.default(buffer)

    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    if (options.format) {
      switch (options.format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality: options.quality || 85 })
          break
        case 'webp':
          pipeline = pipeline.webp({ quality: options.quality || 85 })
          break
        case 'png':
          pipeline = pipeline.png({ compressionLevel: 6 })
          break
      }
    }

    return await pipeline.toBuffer()
  } catch (error) {
    console.warn('Sharp not available, returning original buffer:', error)
    // If sharp is not available, return original buffer
    return buffer
  }
}

// Generate multiple image sizes
export async function generateImageSizes(originalBuffer: Buffer, originalFilename: string) {
  const ext = path.extname(originalFilename)
  const baseName = path.basename(originalFilename, ext)

  const sizes = [
    { suffix: '_thumb', width: 200, height: 200 },
    { suffix: '_medium', width: 600, height: 400 },
    { suffix: '_large', width: 1200, height: 800 }
  ]

  const results = []

  for (const size of sizes) {
    try {
      const processedBuffer = await processImage(originalBuffer, {
        width: size.width,
        height: size.height,
        quality: 85,
        format: 'webp'
      })

      results.push({
        buffer: processedBuffer,
        filename: `${baseName}${size.suffix}.webp`,
        suffix: size.suffix,
        width: size.width,
        height: size.height
      })
    } catch (error) {
      console.error(`Failed to generate ${size.suffix} size:`, error)
    }
  }

  return results
}