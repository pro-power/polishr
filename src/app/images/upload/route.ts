// src/app/api/images/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createResponse, createErrorResponse } from '@/lib/api-utils'
import { createStorage, validateImageFile, processImage, UploadedFile } from '@/lib/storage'

interface ImageUploadBody {
  projectId: string
  isPrimary?: boolean
  altText?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const isPrimary = formData.get('isPrimary') === 'true'
    const altText = formData.get('altText') as string || ''

    if (!file) {
      return createErrorResponse('No file provided', 400)
    }

    if (!projectId) {
      return createErrorResponse('Project ID is required', 400)
    }

    // Verify project belongs to user
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      },
      include: {
        images: true
      }
    })

    if (!project) {
      return createErrorResponse('Project not found', 404)
    }

    // Get user plan for file size limits
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { planType: true }
    })

    const userPlan = user?.planType === 'PRO' ? 'PRO' : 'FREE'

    // Convert File to UploadedFile format
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadedFile: UploadedFile = {
      fieldname: 'file',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      buffer,
      size: buffer.length
    }

    // Validate file
    const validationError = validateImageFile(uploadedFile, userPlan)
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    // Check project image limit
    const currentImageCount = project.images.length
    const maxImages = userPlan === 'PRO' ? 10 : 5

    if (currentImageCount >= maxImages) {
      return createErrorResponse(
        `Image limit reached. Maximum ${maxImages} images per project for ${userPlan} plan.`,
        403
      )
    }

    // Process image (optimize and resize)
    const processedBuffer = await processImage(buffer, {
      width: 1200,
      height: 800,
      quality: 85,
      format: 'webp'
    })

    // Create processed file object
    const processedFile: UploadedFile = {
      ...uploadedFile,
      buffer: processedBuffer,
      mimetype: 'image/webp',
      originalname: uploadedFile.originalname.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      size: processedBuffer.length
    }

    // Upload to storage
    const storage = createStorage()
    const result = await storage.uploadFile(processedFile, `projects/${projectId}`)

    // Get next position for image ordering
    const maxPosition = project.images.reduce((max, img) => Math.max(max, img.position), -1)
    const position = maxPosition + 1

    // Save image record to database
    const imageRecord = await db.projectImage.create({
      data: {
        projectId,
        url: result.url,
        altText: altText || `Image for ${project.title}`,
        position: isPrimary ? 0 : position
      }
    })

    // If this is set as primary, reorder other images
    if (isPrimary && project.images.length > 0) {
      await db.projectImage.updateMany({
        where: {
          projectId,
          id: { not: imageRecord.id }
        },
        data: {
          position: { increment: 1 }
        }
      })
    }

    // Update project's main imageUrl if this is the first/primary image
    if (isPrimary || project.images.length === 0) {
      await db.project.update({
        where: { id: projectId },
        data: { imageUrl: result.url }
      })
    }

    return createResponse({
      id: imageRecord.id,
      url: result.url,
      altText: imageRecord.altText,
      position: imageRecord.position,
      size: result.size,
      filename: result.filename
    }, 201)

  } catch (error) {
    console.error('Image upload error:', error)
    return createErrorResponse('Failed to upload image', 500)
  }
}

// DELETE method for removing uploaded images
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')

    if (!imageId) {
      return createErrorResponse('Image ID is required', 400)
    }

    // Find image and verify ownership
    const image = await db.projectImage.findFirst({
      where: { id: imageId },
      include: {
        project: {
          select: {
            id: true,
            userId: true,
            imageUrl: true
          }
        }
      }
    })

    if (!image || image.project.userId !== session.user.id) {
      return createErrorResponse('Image not found', 404)
    }

    // Delete from storage
    const storage = createStorage()
    const filename = image.url.split('/').pop()
    if (filename) {
      await storage.deleteFile(filename, `projects/${image.project.id}`)
    }

    // Delete from database
    await db.projectImage.delete({
      where: { id: imageId }
    })

    // If this was the primary image, update project imageUrl
    if (image.project.imageUrl === image.url) {
      const remainingImages = await db.projectImage.findFirst({
        where: { projectId: image.project.id },
        orderBy: { position: 'asc' }
      })

      await db.project.update({
        where: { id: image.project.id },
        data: { imageUrl: remainingImages?.url || null }
      })
    }

    // Reorder remaining images
    await db.$transaction(async (tx) => {
      const remainingImages = await tx.projectImage.findMany({
        where: { projectId: image.project.id },
        orderBy: { position: 'asc' }
      })

      for (let i = 0; i < remainingImages.length; i++) {
        await tx.projectImage.update({
          where: { id: remainingImages[i].id },
          data: { position: i }
        })
      }
    })

    return createResponse({ message: 'Image deleted successfully' })

  } catch (error) {
    console.error('Image deletion error:', error)
    return createErrorResponse('Failed to delete image', 500)
  }
}