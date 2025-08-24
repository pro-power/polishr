// src/lib/data-access.ts
import { db } from '@/lib/db'
import { 
  DashboardStats, 
  AnalyticsSummary,
  UserProfile,
  ProjectWithAnalytics 
} from '@/types/database'
import { Project, User, ProjectStatus } from '@prisma/client'

// Define ProjectStats interface locally since it doesn't exist in types/database
interface ProjectStats {
  totalProjects: number
  liveProjects: number
  draftProjects: number
  featuredProjects: number
  totalClicks: number
  totalViews: number
  totalEmailCaptures: number
  averageClicksPerProject: number
  mostClickedProject?: {
    id: string
    title: string
    clickCount: number
    viewCount: number
    _count: {
      clicks: number
      emailCaptures: number
    }
  } | null
  recentlyUpdated: Array<{
    id: string
    title: string
    updatedAt: string
    status: string
  }>
}

/**
 * Get comprehensive dashboard statistics for a user
 */
export async function getUserDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    // Get basic project counts and totals
    const [projectStats, viewStats, clickStats, emailStats] = await Promise.all([
      // Project statistics
      db.project.aggregate({
        where: { userId },
        _count: { id: true },
      }),
      
      // Profile view statistics
      db.profileView.aggregate({
        where: { userId },
        _count: { id: true },
      }),
      
      // Project click statistics (sum across all user projects)
      db.projectClick.aggregate({
        where: { 
          project: { userId } 
        },
        _count: { id: true },
      }),
      
      // Email capture statistics
      db.emailCapture.aggregate({
        where: { userId },
        _count: { id: true },
      }),
    ])

    // Get monthly statistics (current month)
    const currentMonthStart = new Date()
    currentMonthStart.setDate(1)
    currentMonthStart.setHours(0, 0, 0, 0)

    const [monthlyViews, monthlyClicks] = await Promise.all([
      db.profileView.count({
        where: {
          userId,
          createdAt: { gte: currentMonthStart }
        }
      }),
      db.projectClick.count({
        where: {
          project: { userId },
          createdAt: { gte: currentMonthStart }
        }
      })
    ])

    // Get top performing project
    const topProject = await db.project.findFirst({
      where: { userId },
      orderBy: [
        { clickCount: 'desc' },
        { viewCount: 'desc' }
      ],
      take: 1
    })

    // Get recent activity (profile views and project clicks)
    const [recentViews, recentClicks] = await Promise.all([
      db.profileView.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          country: true,
          referer: true,
          device: true
        }
      }),
      db.projectClick.findMany({
        where: { project: { userId } },
        include: {
          project: {
            select: { title: true, id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    // Combine and sort recent activity
    const recentActivity = [
      ...recentViews.map(view => ({
        type: 'view' as const,
        createdAt: view.createdAt,
        data: view
      })),
      ...recentClicks.map(click => ({
        type: 'click' as const,
        createdAt: click.createdAt,
        data: click
      }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10)

    return {
      totalProjects: projectStats._count.id,
      totalViews: viewStats._count.id,
      totalClicks: clickStats._count.id,
      totalEmailCaptures: emailStats._count.id,
      viewsThisMonth: monthlyViews,
      clicksThisMonth: monthlyClicks,
      topProject,
      recentActivity: recentActivity.map(item => item.data) as any[]
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return default stats on error
    return {
      totalProjects: 0,
      totalViews: 0,
      totalClicks: 0,
      totalEmailCaptures: 0,
      viewsThisMonth: 0,
      clicksThisMonth: 0,
      topProject: null,
      recentActivity: []
    }
  }
}

/**
 * Get detailed project statistics for analytics page
 */
export async function getUserProjectStats(userId: string): Promise<ProjectStats> {
  try {
    const [projects, clickStats, viewStats, emailStats] = await Promise.all([
      // Get all projects with status counts
      db.project.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          status: true,
          featured: true,
          clickCount: true,
          viewCount: true,
          updatedAt: true,
          createdAt: true,
          _count: {
            select: {
              clicks: true,
              emailCaptures: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      
      // Total click statistics
      db.projectClick.aggregate({
        where: { project: { userId } },
        _count: { id: true }
      }),
      
      // Total view statistics  
      db.profileView.aggregate({
        where: { userId },
        _count: { id: true }
      }),
      
      // Total email captures
      db.emailCapture.aggregate({
        where: { userId },
        _count: { id: true }
      })
    ])

    // Calculate statistics
    const totalProjects = projects.length
    const liveProjects = projects.filter(p => p.status === ProjectStatus.LIVE).length
    const draftProjects = projects.filter(p => p.status === ProjectStatus.DRAFT).length
    const featuredProjects = projects.filter(p => p.featured).length
    
    const totalClicks = clickStats._count.id
    const totalViews = viewStats._count.id
    const totalEmailCaptures = emailStats._count.id
    
    const averageClicksPerProject = totalProjects > 0 ? Math.round(totalClicks / totalProjects) : 0
    
    // Find most clicked project
    const mostClickedProject = projects.reduce((max, project) => 
      (project._count.clicks > (max?._count?.clicks || 0)) ? project : max, 
      null as any
    )
    
    // Recently updated projects
    const recentlyUpdated = projects.slice(0, 5).map(project => ({
      id: project.id,
      title: project.title,
      updatedAt: project.updatedAt.toISOString(),
      status: project.status
    }))

    return {
      totalProjects,
      liveProjects,
      draftProjects,
      featuredProjects,
      totalClicks,
      totalViews,
      totalEmailCaptures,
      averageClicksPerProject,
      mostClickedProject,
      recentlyUpdated
    }
  } catch (error) {
    console.error('Error fetching project stats:', error)
    return {
      totalProjects: 0,
      liveProjects: 0,
      draftProjects: 0,
      featuredProjects: 0,
      totalClicks: 0,
      totalViews: 0,
      totalEmailCaptures: 0,
      averageClicksPerProject: 0,
      mostClickedProject: null,
      recentlyUpdated: []
    }
  }
}

/**
 * Get analytics summary with time-based data
 */
export async function getUserAnalyticsSummary(
  userId: string, 
  days: number = 30
): Promise<AnalyticsSummary> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get analytics data for the specified period
    const [profileViews, projectClicks, emailCaptures] = await Promise.all([
      db.profileView.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      
      db.projectClick.findMany({
        where: {
          project: { userId },
          createdAt: { gte: startDate }
        },
        include: {
          project: {
            select: { title: true, id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      
      db.emailCapture.count({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      })
    ])

    // Calculate totals
    const totalViews = profileViews.length
    const totalClicks = projectClicks.length
    const totalEmailCaptures = emailCaptures

    // Find top referer
    const refererCounts = profileViews
      .filter(view => view.referer)
      .reduce((acc, view) => {
        const referer = new URL(view.referer!).hostname
        acc[referer] = (acc[referer] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const topReferer = Object.entries(refererCounts).length > 0
      ? Object.entries(refererCounts).sort(([,a], [,b]) => b - a)[0][0]
      : null

    // Find top country
    const countryCounts = profileViews
      .filter(view => view.country)
      .reduce((acc, view) => {
        acc[view.country!] = (acc[view.country!] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const topCountry = Object.entries(countryCounts).length > 0
      ? Object.entries(countryCounts).sort(([,a], [,b]) => b - a)[0][0]
      : null

    return {
      totalViews,
      totalClicks,
      totalEmailCaptures,
      topReferer,
      topCountry,
      recentViews: profileViews.slice(0, 10),
      recentClicks: projectClicks.slice(0, 10)
    }
  } catch (error) {
    console.error('Error fetching analytics summary:', error)
    return {
      totalViews: 0,
      totalClicks: 0,
      totalEmailCaptures: 0,
      topReferer: null,
      topCountry: null,
      recentViews: [],
      recentClicks: []
    }
  }
}

/**
 * Get user portfolio data for public profile pages
 */
export async function getUserPortfolioData(username: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
      include: {
        projects: {
          where: { 
            isPublic: true,
            status: { not: ProjectStatus.DRAFT }
          },
          orderBy: [
            { featured: 'desc' },
            { position: 'asc' },
            { createdAt: 'desc' }
          ],
          include: {
            images: {
              orderBy: { position: 'asc' }
            }
          }
        },
        skills: {
          orderBy: { position: 'asc' }
        },
        experience: {
          orderBy: [
            { isCurrent: 'desc' },
            { startDate: 'desc' }
          ]
        },
        portfolioConfig: true
      }
    })

    if (!user || !user.isPublic) {
      return null
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        jobTitle: user.jobTitle,
        location: user.location,
        avatarUrl: user.avatarUrl,
        website: user.website,
        twitterUrl: user.twitterUrl,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        lookingForWork: user.lookingForWork,
        resumeUrl: user.resumeUrl,
        email: user.email // Only for portfolio display
      },
      projects: user.projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        demoUrl: project.demoUrl,
        repoUrl: project.repoUrl,
        techStack: project.techStack,
        category: project.category,
        ctaType: project.ctaType,
        ctaUrl: project.ctaUrl,
        ctaText: project.ctaText,
        imageUrl: project.imageUrl || project.images[0]?.url,
        clickCount: project.clickCount,
        viewCount: project.viewCount,
        createdAt: project.createdAt.toISOString(),
        position: project.position
      })),
      skills: user.skills,
      experience: user.experience,
      config: user.portfolioConfig || {
        templateId: 'minimal',
        themeId: 'ocean',
        sectionOrder: ['about', 'projects', 'skills', 'experience'],
        sectionVisibility: {
          about: true,
          projects: true,
          skills: true,
          experience: true
        }
      }
    }
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return null
  }
}

/**
 * Get paginated projects for a user
 */
export async function getUserProjects(
  userId: string,
  options: {
    search?: string
    category?: string
    status?: ProjectStatus
    featured?: boolean
    limit?: number
    offset?: number
  } = {}
) {
  try {
    const { search, category, status, featured, limit = 20, offset = 0 } = options

    // Build where clause
    const where: any = { userId }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    // Get projects and total count
    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 1
          },
          _count: {
            select: {
              clicks: true,
              emailCaptures: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { position: 'asc' },
          { updatedAt: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      db.project.count({ where })
    ])

    return {
      projects: projects.map(project => ({
        ...project,
        imageUrl: project.imageUrl || project.images[0]?.url || null,
        totalClicks: project._count.clicks,
        totalEmailCaptures: project._count.emailCaptures,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    }
  } catch (error) {
    console.error('Error fetching user projects:', error)
    return {
      projects: [],
      pagination: {
        total: 0,
        limit: options.limit || 20,
        offset: options.offset || 0,
        hasMore: false
      }
    }
  }
}

/**
 * Get project analytics data for a specific project
 */
export async function getProjectAnalytics(
  projectId: string,
  userId: string,
  days: number = 30
) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Verify project ownership
    const project = await db.project.findFirst({
      where: { id: projectId, userId }
    })

    if (!project) {
      throw new Error('Project not found or unauthorized')
    }

    // Get click analytics
    const [clicks, clicksByType, recentClicks] = await Promise.all([
      db.projectClick.count({
        where: {
          projectId,
          createdAt: { gte: startDate }
        }
      }),

      db.projectClick.groupBy({
        by: ['clickType'],
        where: {
          projectId,
          createdAt: { gte: startDate }
        },
        _count: {
          id: true
        }
      }),

      db.projectClick.findMany({
        where: {
          projectId,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    ])

    // Format click types
    const clicksByTypeFormatted = clicksByType.reduce((acc, item) => {
      acc[item.clickType] = item._count.id
      return acc
    }, {} as Record<string, number>)

    // Calculate conversion rate (clicks to email captures ratio)
    const emailCaptures = await db.emailCapture.count({
      where: {
        projectId,
        createdAt: { gte: startDate }
      }
    })

    const conversionRate = clicks > 0 ? Math.round((emailCaptures / clicks) * 100) : 0

    return {
      projectId,
      totalClicks: clicks,
      totalViews: project.viewCount,
      clicksByType: clicksByTypeFormatted,
      recentClicks,
      conversionRate
    }
  } catch (error) {
    console.error('Error fetching project analytics:', error)
    throw error
  }
}