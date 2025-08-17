// src/hooks/use-projects.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string | null
  demoUrl: string | null
  repoUrl: string | null
  techStack: string[]
  category: string | null
  ctaType: string
  ctaUrl: string | null
  ctaText: string | null
  status: string
  featured: boolean
  isPublic: boolean
  imageUrl: string | null
  totalClicks: number
  totalEmailCaptures: number
  position: number
  createdAt: string
  updatedAt: string
}

interface ProjectsResponse {
  projects: Project[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

interface UseProjectsOptions {
  search?: string
  category?: string
  status?: string
  featured?: boolean
  limit?: number
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  })

  const fetchProjects = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      if (options.featured !== undefined) params.append('featured', options.featured.toString())
      
      params.append('limit', (options.limit || 10).toString())
      params.append('offset', reset ? '0' : pagination.offset.toString())

      const response = await fetch(`/api/projects?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data: ProjectsResponse = await response.json()
      
      if (reset) {
        setProjects(data.projects)
      } else {
        setProjects(prev => [...prev, ...data.projects])
      }
      
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [options, pagination.offset])

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))
    }
  }, [pagination.hasMore, loading])

  const refresh = useCallback(() => {
    setPagination(prev => ({ ...prev, offset: 0 }))
    fetchProjects(true)
  }, [fetchProjects])

  useEffect(() => {
    fetchProjects(true)
  }, [options.search, options.category, options.status, options.featured])

  useEffect(() => {
    if (pagination.offset > 0) {
      fetchProjects(false)
    }
  }, [pagination.offset])

  return {
    projects,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
  }
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/projects/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Project not found')
          return
        }
        throw new Error('Failed to fetch project')
      }

      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id, fetchProject])

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  }
}

export function useProjectActions() {
  const [loading, setLoading] = useState(false)

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      toast.success('Project deleted successfully')
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const reorderProjects = useCallback(async (projectIds: string[]) => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder projects')
      }

      toast.success('Projects reordered successfully')
      return true
    } catch (error) {
      console.error('Error reordering projects:', error)
      toast.error('Failed to reorder projects')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const duplicateProject = useCallback(async (id: string) => {
    setLoading(true)
    try {
      // First fetch the project to duplicate
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const project = await response.json()
      
      // Create a duplicate with modified title
      const duplicateData = {
        ...project,
        title: `${project.title} (Copy)`,
        status: 'DRAFT', // Always create duplicates as drafts
        featured: false, // Don't duplicate featured status
      }

      // Remove fields that shouldn't be duplicated
      delete duplicateData.id
      delete duplicateData.createdAt
      delete duplicateData.updatedAt
      delete duplicateData.totalClicks
      delete duplicateData.totalEmailCaptures
      delete duplicateData.imageUrl
      delete duplicateData.images

      const createResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData),
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create duplicate project')
      }

      const newProject = await createResponse.json()
      toast.success('Project duplicated successfully')
      return newProject
    } catch (error) {
      console.error('Error duplicating project:', error)
      toast.error('Failed to duplicate project')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    deleteProject,
    reorderProjects,
    duplicateProject,
  }
}