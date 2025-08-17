// src/components/projects/project-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Plus, Loader2, Save, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  projectSchema, 
  ProjectInput,
  PROJECT_CATEGORIES, 
  CTA_TYPE_OPTIONS,
  PROJECT_STATUS_OPTIONS 
} from '@/lib/validations/project'
import { CTAType, ProjectStatus } from '@prisma/client'

interface ProjectFormProps {
  initialData?: Partial<ProjectInput> & { id?: string }
  isEditing?: boolean
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [techStackInput, setTechStackInput] = useState('')
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
  const status = watch('status')

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(
          isEditing ? 'Project updated successfully!' : 'Project created successfully!',
          {
            description: `Your project "${data.title}" has been ${isEditing ? 'updated' : 'created'}.`,
          }
        )
        router.push('/dashboard/projects')
        router.refresh()
      } else {
        toast.error('Something went wrong', {
          description: result.error || 'Failed to save project. Please try again.',
        })
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your project..."
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('category')}
            >
              <option value="">Select a category</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label htmlFor="techStack">Technologies *</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add technology (e.g., React, TypeScript)"
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
              
              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechStack(tech)}
                      className="hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {errors.techStack && (
              <p className="text-sm text-destructive">{errors.techStack.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Links */}
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Settings */}
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                Featured projects appear first on your profile
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
                Public projects are visible on your profile
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

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        {/* Preview Button (only for editing) */}
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // TODO: Open preview modal or navigate to preview
              toast.info('Preview functionality coming soon!')
            }}
            disabled={isLoading}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Update Project' : 'Create Project'}
            </>
          )}
        </Button>
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