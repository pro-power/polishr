// src/types/project.ts
import { Project, ProjectImage, ProjectClick, EmailCapture, CTAType, ProjectStatus } from '@prisma/client'

// Extended project with relations and computed fields
export interface ProjectWithDetails extends Project {
  images: ProjectImage[]
  imageUrl: string | null
  totalClicks: number
  totalEmailCaptures: number
  _count?: {
    clicks: number
    emailCaptures: number
  }
}

// Project for public display (subset of full project)
export interface PublicProject {
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
  imageUrl: string | null
  clickCount: number
  viewCount: number
  createdAt: Date | string
  position: number
}

// Project form data (for creation/editing)
export interface ProjectFormData {
  title: string
  description?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
  techStack: string[]
  category?: string | null
  ctaType: CTAType
  ctaUrl?: string | null
  ctaText?: string | null
  status: ProjectStatus
  featured: boolean
  isPublic: boolean
}

// Project list item (for dashboard)
export interface ProjectListItem {
  id: string
  title: string
  description: string | null
  category: string | null
  status: ProjectStatus
  featured: boolean
  isPublic: boolean
  techStack: string[]
  imageUrl: string | null
  totalClicks: number
  totalEmailCaptures: number
  position: number
  createdAt: string
  updatedAt: string
  demoUrl: string | null
  repoUrl: string | null
  ctaType: CTAType
}

// Project analytics data
export interface ProjectAnalytics {
  projectId: string
  totalClicks: number
  totalViews: number
  clicksByType: Record<string, number>
  recentClicks: ProjectClick[]
  conversionRate: number
  topReferrers: Array<{ referer: string; count: number }>
  clicksByDate: Array<{ date: string; clicks: number }>
}

// Project filters for API queries
export interface ProjectFilters {
  search?: string
  category?: string
  status?: ProjectStatus
  featured?: boolean
  isPublic?: boolean
  limit?: number
  offset?: number
}

// Project statistics
export interface ProjectStats {
  totalProjects: number
  liveProjects: number
  draftProjects: number
  featuredProjects: number
  totalClicks: number
  totalViews: number
  totalEmailCaptures: number
  averageClicksPerProject: number
  mostClickedProject?: ProjectListItem
  recentlyUpdated: ProjectListItem[]
}

// Project creation/update response
export interface ProjectResponse {
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
  position: number
  imageUrl: string | null
  images: ProjectImage[]
  totalClicks: number
  totalEmailCaptures: number
  createdAt: string
  updatedAt: string
}

// Paginated projects response
export interface ProjectsResponse {
  projects: ProjectListItem[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// Project reorder request
export interface ProjectReorderRequest {
  projectIds: string[]
}

// Project duplicate request
export interface ProjectDuplicateRequest {
  sourceProjectId: string
  newTitle?: string
}

// Project action types for UI
export type ProjectAction = 
  | 'edit'
  | 'delete'
  | 'duplicate'
  | 'preview'
  | 'toggle-featured'
  | 'toggle-public'
  | 'view-analytics'

// Project card props for components
export interface ProjectCardProps {
  project: ProjectListItem
  onAction: (action: ProjectAction, projectId: string) => void
  isLoading?: boolean
  showActions?: boolean
}

// Project form props
export interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { id?: string }
  isEditing?: boolean
  onSubmit?: (data: ProjectFormData) => Promise<void>
  onCancel?: () => void
}

// Validation error type
export interface ProjectValidationError {
  field: keyof ProjectFormData
  message: string
}

// Project upload data (for image handling)
export interface ProjectUploadData {
  projectId: string
  images: File[]
  primaryImageIndex?: number
}

// Project SEO data
export interface ProjectSEOData {
  title: string
  description: string
  imageUrl?: string
  url: string
  siteName: string
  type: 'website' | 'article'
}

// Project sharing data
export interface ProjectSharingData {
  id: string
  title: string
  description: string
  imageUrl?: string
  url: string
  socialText: string
}