// src/app/dashboard/projects/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProjectForm } from '@/components/projects/project-form'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ProjectWithDetails } from '@/types/project'
import { CTAType, ProjectStatus } from '@prisma/client'

interface ProjectData {
  id: string
  title: string
  description: string | null
  demoUrl: string | null
  repoUrl: string | null
  techStack: string[]
  category: string | null
  ctaType: CTAType
  ctaUrl: string | null
  ctaText: string | null
  status: ProjectStatus
  featured: boolean
  isPublic: boolean
  imageUrl: string | null
  totalClicks: number
  totalEmailCaptures: number
  createdAt: string
}

interface EditProjectPageProps {
  params: { id: string }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchProject()
    }
  }, [status, router, params.id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/projects/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Project not found')
          return
        }
        throw new Error('Failed to fetch project')
      }

      const data = await response.json()
      
      // Ensure the data has the correct types
      const projectData: ProjectData = {
        ...data,
        ctaType: data.ctaType as CTAType,
        status: data.status as ProjectStatus,
      }
      
      setProject(projectData)
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
      toast.error('Failed to load project', {
        description: 'Please try again or go back to your projects list.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Error State */}
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {error === 'Project not found' ? 'Project Not Found' : 'Error Loading Project'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {error === 'Project not found' 
                  ? 'The project you\'re looking for doesn\'t exist or you don\'t have permission to edit it.'
                  : 'There was an error loading your project. Please try again.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchProject} variant="outline">
                  Try Again
                </Button>
                <Button asChild>
                  <Link href="/dashboard/projects">Back to Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
              <p className="text-muted-foreground mt-2">
                Update "{project.title}" in your portfolio
              </p>
            </div>

            {/* Project Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-semibold text-foreground">{project.totalClicks}</div>
                <div>Clicks</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{project.totalEmailCaptures}</div>
                <div>Leads</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div>Created</div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Form */}
        <ProjectForm 
          initialData={project}
          isEditing={true}
        />

        {/* Project Management Actions */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Project Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement project preview
                toast.info('Project preview coming soon!')
              }}
            >
              Preview Project
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement project duplication
                toast.info('Project duplication coming soon!')
              }}
            >
              Duplicate Project
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                // TODO: Implement project deletion with confirmation
                const confirmed = window.confirm(
                  `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
                )
                if (confirmed) {
                  // Delete project logic will be implemented
                  toast.info('Project deletion will be implemented soon!')
                }
              }}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}