// src/types/database.ts
import { 
    User, 
    Project, 
    ProjectImage, 
    ProfileView, 
    ProjectClick, 
    EmailCapture,
    PlanType,
    CTAType,
    ProjectStatus 
  } from '@prisma/client'
  
  // Extended types with relations
  export type UserWithProjects = User & {
    projects: Project[]
  }
  
  export type ProjectWithImages = Project & {
    images: ProjectImage[]
    user: User
  }
  
  export type ProjectWithAnalytics = Project & {
    clicks: ProjectClick[]
    emailCaptures: EmailCapture[]
    _count: {
      clicks: number
      emailCaptures: number
    }
  }
  
  export type UserProfile = User & {
    projects: ProjectWithImages[]
    _count: {
      projects: number
      profileViews: number
    }
  }
  
  // Analytics aggregation types
  export type AnalyticsSummary = {
    totalViews: number
    totalClicks: number
    totalEmailCaptures: number
    topReferer: string | null
    topCountry: string | null
    recentViews: ProfileView[]
    recentClicks: ProjectClick[]
  }
  
  export type ProjectAnalytics = {
    projectId: string
    totalClicks: number
    totalViews: number
    clicksByType: Record<string, number>
    recentClicks: ProjectClick[]
    conversionRate: number
  }
  
  // Dashboard data types
  export type DashboardStats = {
    totalProjects: number
    totalViews: number
    totalClicks: number
    totalEmailCaptures: number
    viewsThisMonth: number
    clicksThisMonth: number
    topProject: Project | null
    recentActivity: (ProfileView | ProjectClick)[]
  }
  
  // Form types for project creation/editing
  export type ProjectFormData = {
    title: string
    description?: string
    demoUrl?: string
    repoUrl?: string
    techStack: string[]
    category?: string
    ctaType: CTAType
    ctaUrl?: string
    ctaText?: string
    status: ProjectStatus
    featured: boolean
    isPublic: boolean
  }
  
  export type UserProfileFormData = {
    displayName?: string
    username?: string
    bio?: string
    website?: string
    twitterUrl?: string
    githubUrl?: string
    linkedinUrl?: string
    themeColor: string
    isPublic: boolean
  }
  
  // API response types
  export type ApiResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
    message?: string
  }
  
  export type PaginatedResponse<T> = {
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  
  // Search and filter types
  export type ProjectFilters = {
    category?: string
    status?: ProjectStatus
    featured?: boolean
    search?: string
  }
  
  export type AnalyticsFilters = {
    startDate?: Date
    endDate?: Date
    groupBy?: 'day' | 'week' | 'month'
  }
  
  // Export enum types for use in components
  export { PlanType, CTAType, ProjectStatus }

  