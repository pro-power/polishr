// src/components/images/image-uploader.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface ImageFile extends File {
  preview?: string
}

interface UploadedImage {
  id: string
  url: string
  altText: string
  position: number
  size: number
  filename: string
}

interface ImageUploaderProps {
  projectId: string
  existingImages?: UploadedImage[]
  maxImages?: number
  onUploadComplete?: (image: UploadedImage) => void
  onUploadError?: (error: string) => void
  disabled?: boolean
}

export function ImageUploader({
  projectId,
  existingImages = [],
  maxImages = 5,
  onUploadComplete,
  onUploadError,
  disabled = false
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState<ImageFile[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentCount = existingImages.length + uploading.length
    const availableSlots = maxImages - currentCount
    
    if (availableSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed per project`)
      return
    }

    const filesToUpload = acceptedFiles.slice(0, availableSlots)
    
    if (acceptedFiles.length > availableSlots) {
      toast.warning(`Only uploading first ${availableSlots} images due to limit`)
    }

    const imageFiles: ImageFile[] = filesToUpload.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    )

    setUploading(prev => [...prev, ...imageFiles])
    
    // Start uploading each file
    imageFiles.forEach(file => uploadFile(file))
  }, [existingImages.length, uploading.length, maxImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: disabled || uploading.length + existingImages.length >= maxImages
  })

  const uploadFile = async (file: ImageFile) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectId', projectId)
    formData.append('isPrimary', (existingImages.length === 0).toString())
    formData.append('altText', `Image for project - ${file.name}`)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
        }))
      }, 200)

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadedImage: UploadedImage = await response.json()

      // Complete progress
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 100
      }))

      // Remove from uploading list
      setUploading(prev => prev.filter(f => f.name !== file.name))
      
      // Clear progress after animation
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [file.name]: _, ...rest } = prev
          return rest
        })
      }, 1000)

      onUploadComplete?.(uploadedImage)
      toast.success('Image uploaded successfully')

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setErrors(prev => ({
        ...prev,
        [file.name]: errorMessage
      }))

      onUploadError?.(errorMessage)
      toast.error(`Failed to upload ${file.name}`)
    }
  }

  const removeUploadingFile = (fileName: string) => {
    setUploading(prev => prev.filter(f => f.name !== fileName))
    setUploadProgress(prev => {
      const { [fileName]: _, ...rest } = prev
      return rest
    })
    setErrors(prev => {
      const { [fileName]: _, ...rest } = prev
      return rest
    })
  }

  const isAtLimit = existingImages.length + uploading.length >= maxImages

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          ${disabled || isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            {isDragActive ? (
              <p>Drop images here...</p>
            ) : (
              <div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-muted-foreground">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            )}
          </div>
          
          {isAtLimit && (
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Maximum {maxImages} images reached
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploading Images</h4>
          {uploading.map((file) => (
            <div key={file.name} className="flex items-center gap-3 p-3 border rounded-lg">
              {file.preview && (
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded"
                  onLoad={() => URL.revokeObjectURL(file.preview!)}
                />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {uploadProgress[file.name] !== undefined && (
                  <div className="mt-1">
                    <Progress value={uploadProgress[file.name]} className="h-1" />
                  </div>
                )}
                
                {errors[file.name] && (
                  <p className="text-xs text-destructive mt-1">{errors[file.name]}</p>
                )}
              </div>

              {uploadProgress[file.name] === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : uploadProgress[file.name] !== undefined ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadingFile(file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}