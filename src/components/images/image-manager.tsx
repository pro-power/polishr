// src/components/images/image-manager.tsx
'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Star, StarOff, Trash2, GripVertical, Eye, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { ImageUploader } from './image-uploader'

interface ProjectImage {
  id: string
  url: string
  altText: string
  position: number
  size: number
  filename: string
}

interface ImageManagerProps {
  projectId: string
  images: ProjectImage[]
  onImagesChange?: (images: ProjectImage[]) => void
  maxImages?: number
  canReorder?: boolean
}

export function ImageManager({
  projectId,
  images: initialImages,
  onImagesChange,
  maxImages = 5,
  canReorder = true
}: ImageManagerProps) {
  const [images, setImages] = useState<ProjectImage[]>(initialImages)
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null)
  const [newAltText, setNewAltText] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const handleUploadComplete = (newImage: ProjectImage) => {
    const updatedImages = [...images, newImage].sort((a, b) => a.position - b.position)
    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !canReorder) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedImages = items.map((item, index) => ({
      ...item,
      position: index
    }))

    setImages(updatedImages)
    onImagesChange?.(updatedImages)

    try {
      const response = await fetch('/api/images/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          imageIds: updatedImages.map(img => img.id)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reorder images')
      }

      toast.success('Images reordered successfully')
    } catch (error) {
      console.error('Reorder error:', error)
      toast.error('Failed to reorder images')
      // Revert to original order
      setImages(initialImages)
      onImagesChange?.(initialImages)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    setIsDeleting(imageId)

    try {
      const response = await fetch(`/api/images/upload?id=${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      const updatedImages = images.filter(img => img.id !== imageId)
      setImages(updatedImages)
      onImagesChange?.(updatedImages)
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete image')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleUpdateAltText = async () => {
    if (!editingImage) return

    try {
      // For now, just update locally - you can add an API endpoint for this later
      const updatedImages = images.map(img =>
        img.id === editingImage.id ? { ...img, altText: newAltText } : img
      )
      setImages(updatedImages)
      onImagesChange?.(updatedImages)
      setEditingImage(null)
      setNewAltText('')
      toast.success('Alt text updated')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update alt text')
    }
  }

  const openEditDialog = (image: ProjectImage) => {
    setEditingImage(image)
    setNewAltText(image.altText)
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Images</h3>
        <ImageUploader
          projectId={projectId}
          existingImages={images}
          maxImages={maxImages}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          disabled={images.length >= maxImages}
        />
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">
              Uploaded Images ({images.length}/{maxImages})
            </h4>
            {canReorder && images.length > 1 && (
              <p className="text-sm text-muted-foreground">
                Drag to reorder • First image is used as project thumbnail
              </p>
            )}
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {images.map((image, index) => (
                    <Draggable
                      key={image.id}
                      draggableId={image.id}
                      index={index}
                      isDragDisabled={!canReorder}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            relative group border rounded-lg overflow-hidden bg-card
                            ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                            ${index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''}
                          `}
                        >
                          {/* Primary Badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 z-10">
                              <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                                Primary
                              </div>
                            </div>
                          )}

                          {/* Drag Handle */}
                          {canReorder && (
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                            >
                              <div className="bg-black/50 text-white p-1 rounded">
                                <GripVertical className="h-4 w-4" />
                              </div>
                            </div>
                          )}

                          {/* Image */}
                          <div className="aspect-video relative">
                            <img
                              src={image.url}
                              alt={image.altText}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                {/* Preview */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>Image Preview</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <img
                                        src={image.url}
                                        alt={image.altText}
                                        className="w-full h-auto max-h-[70vh] object-contain rounded"
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                {/* Edit Alt Text */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => openEditDialog(image)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Image Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                      <div>
                                        <Label htmlFor="altText">Alt Text</Label>
                                        <Input
                                          id="altText"
                                          value={newAltText}
                                          onChange={(e) => setNewAltText(e.target.value)}
                                          placeholder="Describe this image..."
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => setEditingImage(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button onClick={handleUpdateAltText}>
                                          Update
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                {/* Delete */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      disabled={isDeleting === image.id}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this image? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteImage(image.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>

                          {/* Image Info */}
                          <div className="p-3">
                            <p className="text-sm font-medium truncate">
                              {image.filename}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(image.size / 1024).toFixed(1)} KB
                            </p>
                            {image.altText && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {image.altText}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium">No images uploaded yet</p>
            <p className="text-sm">Upload your first image to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}