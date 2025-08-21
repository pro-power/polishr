// src/components/projects/project-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Plus, Loader2, Save, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { ImageManager } from '@/components/images/image-manager'

import { 
  projectSchema, 
  ProjectInput,
  PROJECT_CATEGORIES, 
  CTA_TYPE_OPTIONS,
  PROJECT_STATUS_OPTIONS 
} from '@/lib/validations/project'
import { CTAType, ProjectStatus } from '@prisma/client'

interface ProjectImage {
  id: string
  url: string
  altText: string
  position: number
  size: number
  filename: string
}

interface ProjectFormProps {
  initialData?: Partial<ProjectInput> & { 
    id?: string
    images?: ProjectImage[]
  }
  isEditing?: boolean
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [techStackInput, setTechStackInput] = useState('')
  const [projectImages, setProjectImages] = useState<ProjectImage[]>(initialData?.images || [])
  const [activeTab, setActiveTab] = useState('details')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      demoUrl: initialData?.demoUrl || '',
      repoUrl: initialData?.repoUrl || '',
      techStack: initialData?.techStack || [],
      category: initialData?.category || '',
      ctaType: initialData?.ctaType || CTAType.DEMO,
      ctaUrl: initialData?.ctaUrl || '',
      ctaText: initialData?.ctaText || '',
      status: initialData?.status || ProjectStatus.DRAFT,
      featured: initialData?.featured || false,
      isPublic: initialData?.isPublic ?? true,
    },
  })

  const watchedValues = watch()
  const techStack = watch('techStack')
  const ctaType = watch('ctaType')

  // Auto-save draft functionality
  useEffect(() => {
    if (isEditing && initialData?.id) {
      const timeoutId = setTimeout(() => {
        // Auto-save logic could go here
        console.log('Auto-saving draft...')
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [watchedValues, isEditing, initialData?.id])

  const addTechStack = (tech: string) => {
    if (tech.trim() && !techStack.includes(tech.trim())) {
      setValue('techStack', [...techStack, tech.trim()])
      setTechStackInput('')
    }
  }

  const removeTechStack = (tech: string) => {
    setValue('techStack', techStack.filter(t => t !== tech))
  }

  const handleTechStackKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechStack(techStackInput)
    }
  }

  const onSubmit = async (data: ProjectInput) => {
    setIsLoading(true)

    try {
      const url = isEditing ? `/api/projects/${initialData?.id}` : '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save project')
      }

      const project = await response.json()

      toast.success(isEditing ? 'Project updated successfully!' : 'Project created successfully!')

      // Redirect to project edit page if creating new project
      if (!isEditing) {
        router.push(`/dashboard/projects/${project.id}/edit`)
      } else {
        // Refresh the page or update the data
        router.refresh()
      }
    } catch (error) {
      console.error('Project submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagesChange = (newImages: ProjectImage[]) => {
    setProjectImages(newImages)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="settings">Settings & CTA</TabsTrigger>
        </TabsList>

        {/* Project Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="My Awesome Project"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its features, and what makes it special..."
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('category')}
                >
                  <option value="">Select a category</option>
                  {PROJECT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="techStackInput">Add Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    id="techStackInput"
                    placeholder="e.g., React, TypeScript, Node.js"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyPress={handleTechStackKeyPress}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTechStack(techStackInput)}
                    disabled={!techStackInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tech Stack Tags */}
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechStack(tech)}
                        className="hover:bg-primary/20 rounded p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Links */}
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demo URL */}
              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  type="url"
                  placeholder="https://your-project-demo.com"
                  {...register('demoUrl')}
                />
                {errors.demoUrl && (
                  <p className="text-sm text-destructive">{errors.demoUrl.message}</p>
                )}
              </div>

              {/* Repository URL */}
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Repository URL</Label>
                <Input
                  id="repoUrl"
                  type="url"
                  placeholder="https://github.com/username/project"
                  {...register('repoUrl')}
                />
                {errors.repoUrl && (
                  <p className="text-sm text-destructive">{errors.repoUrl.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Images</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload images to showcase your project. The first image will be used as the thumbnail.
              </p>
            </CardHeader>
            <CardContent>
              {initialData?.id ? (
                <ImageManager
                  projectId={initialData.id}
                  images={projectImages}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                  canReorder={true}
                />
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <div className="text-muted-foreground">
                    <p className="font-medium">Save your project first</p>
                    <p className="text-sm">You can upload images after creating the project</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings & CTA Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Call to Action */}
          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* CTA Type */}
              <div className="space-y-2">
                <Label htmlFor="ctaType">CTA Type *</Label>
                <select
                  id="ctaType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('ctaType')}
                >
                  {CTA_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {errors.ctaType && (
                  <p className="text-sm text-destructive">{errors.ctaType.message}</p>
                )}
              </div>

              {/* CTA URL (conditional) */}
              {(ctaType === CTAType.CUSTOM || ctaType === CTAType.BUY || ctaType === CTAType.CONTACT) && (
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">CTA URL</Label>
                  <Input
                    id="ctaUrl"
                    type="url"
                    placeholder="https://example.com"
                    {...register('ctaUrl')}
                  />
                  {errors.ctaUrl && (
                    <p className="text-sm text-destructive">{errors.ctaUrl.message}</p>
                  )}
                </div>
              )}

              {/* CTA Text (conditional) */}
              {ctaType === CTAType.CUSTOM && (
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Button Text</Label>
                  <Input
                    id="ctaText"
                    placeholder="Get Started"
                    {...register('ctaText')}
                  />
                  {errors.ctaText && (
                    <p className="text-sm text-destructive">{errors.ctaText.message}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('status')}
                >
                  {PROJECT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>

              <Separator />

              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Project</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight this project on your profile
                  </p>
                </div>
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Project</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this project visible on your public profile
                  </p>
                </div>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPublic"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <div className="flex gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // TODO: Implement preview functionality
                toast.info('Preview functionality coming soon!')
              }}
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </div>

      {/* Form Preview (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Form Data Preview (Dev Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(watchedValues, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </form>
  )
}