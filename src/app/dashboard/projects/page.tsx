// src/app/dashboard/projects/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { toast } from 'sonner'
import { 
  Plus, 
  ExternalLink, 
  Github, 
  Eye, 
  MousePointer, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  Calendar,
  Search,
  Star,
  Filter,
  RefreshCw,
  Loader2,
  MoreVertical,
  Copy,
  BarChart3,
  FolderOpen
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string | null
  demoUrl: string | null
  repoUrl: string | null
  techStack: string[]
  category: string | null
  status: string
  featured: boolean
  isPublic: boolean
  imageUrl: string | null
  totalClicks: number
  totalEmailCaptures: number
  createdAt: string
  updatedAt: string
  ctaType: string
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

function ProjectsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State management
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  })
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchProjects(true) // Reset pagination when authenticated
    }
  }, [status, router])

  // Refetch when filters change
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects(true)
    }
  }, [searchQuery, selectedCategory, selectedStatus, showFeaturedOnly, status])

  // Fetch projects from API
  const fetchProjects = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPagination(prev => ({ ...prev, offset: 0 }))
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedStatus) params.append('status', selectedStatus)
      if (showFeaturedOnly) params.append('featured', 'true')
      params.append('limit', pagination.limit.toString())
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
      toast.error('Failed to load projects', {
        description: 'Please try again or refresh the page.'
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      // Remove project from local state
      setProjects(prev => prev.filter(p => p.id !== projectId))
      toast.success('Project deleted successfully')

    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project', {
        description: 'Please try again.'
      })
    }
  }

  const handleToggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !currentFeatured
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      // Update project in local state
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, featured: !currentFeatured } : p
      ))
      
      toast.success(`Project ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`)

    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project', {
        description: 'Please try again.'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return '#10b981'
      case 'DRAFT': return '#6b7280'
      case 'COMING_SOON': return '#f59e0b'
      case 'ARCHIVED': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LIVE': return 'Live'
      case 'DRAFT': return 'Draft'
      case 'COMING_SOON': return 'Coming Soon'
      case 'ARCHIVED': return 'Archived'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (status === 'loading' || (loading && projects.length === 0)) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <Loader2 style={{ width: '24px', height: '24px', color: '#ffffff' }} className="animate-spin" />
          <div style={{ color: '#ffffff', marginLeft: '12px' }}>Loading projects...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  if (error && projects.length === 0) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ color: '#ef4444', fontSize: '16px' }}>Error loading projects</div>
          <button
            onClick={() => fetchProjects(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: '0 0 4px 0'
            }}>
              Projects ({pagination.total})
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Manage your portfolio projects and showcase your work
            </p>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Project
          </button>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '16px', 
              height: '16px', 
              color: '#6b7280' 
            }} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px 8px 36px',
                backgroundColor: '#1a1a2e',
                border: '1px solid #313244',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1a1a2e',
              border: '1px solid #313244',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px'
            }}
          >
            <option value="">All Categories</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="ai">AI/ML</option>
            <option value="tool">Tool</option>
            <option value="other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1a1a2e',
              border: '1px solid #313244',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px'
            }}
          >
            <option value="">All Status</option>
            <option value="LIVE">Live</option>
            <option value="DRAFT">Draft</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Featured Filter */}
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              style={{ accentColor: '#7c3aed' }}
            />
            Featured Only
          </label>

          {/* Refresh Button */}
          <button
            onClick={() => fetchProjects(true)}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: '#1a1a2e',
              color: '#a1a1aa',
              border: '1px solid #313244',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            Refresh
          </button>
        </div>

        {/* Projects Grid */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {projects.length === 0 && !loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              textAlign: 'center',
              color: '#a1a1aa'
            }}>
              <FolderOpen style={{ width: '64px', height: '64px', marginBottom: '16px', color: '#6b7280' }} />
              <h3 style={{ 
                color: '#ffffff', 
                fontSize: '18px', 
                fontWeight: '600', 
                margin: '0 0 8px 0' 
              }}>
                {searchQuery || selectedCategory || selectedStatus || showFeaturedOnly 
                  ? 'No projects found' 
                  : 'No projects yet'
                }
              </h3>
              <p style={{ margin: '0 0 16px 0', maxWidth: '400px' }}>
                {searchQuery || selectedCategory || selectedStatus || showFeaturedOnly 
                  ? 'Try adjusting your filters or search terms.'
                  : 'Create your first project to start building your portfolio.'
                }
              </p>
              {!searchQuery && !selectedCategory && !selectedStatus && !showFeaturedOnly && (
                <button
                  onClick={() => router.push('/dashboard/projects/new')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus style={{ height: '16px', width: '16px' }} />
                  Create Your First Project
                </button>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      backgroundColor: '#1a1a2e',
                      borderRadius: '12px',
                      border: '1px solid #313244',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.borderColor = '#7c3aed'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = '#313244'
                    }}
                  >
                    {/* Project Image */}
                    <div style={{
                      height: '200px',
                      backgroundColor: '#0f0f23',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <ImageIcon style={{ width: '40px', height: '40px', color: '#6b7280' }} />
                      )}
                      
                      {/* Status Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: getStatusColor(project.status),
                        border: `1px solid ${getStatusColor(project.status)}`
                      }}>
                        {getStatusLabel(project.status)}
                      </div>

                      {/* Featured Badge */}
                      {project.featured && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          backgroundColor: 'rgba(251, 191, 36, 0.2)',
                          color: '#f59e0b',
                          border: '1px solid #f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Star style={{ width: '10px', height: '10px', fill: 'currentColor' }} />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div style={{ padding: '16px' }}>
                      {/* Title and Actions */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '600',
                          margin: '0',
                          flex: 1,
                          marginRight: '12px'
                        }}>
                          {project.title}
                        </h3>
                        
                        {/* Actions Dropdown */}
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                            style={{
                              padding: '4px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: '#a1a1aa'
                            }}
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{
                        color: '#a1a1aa',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        margin: '0 0 12px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {project.description || 'No description provided.'}
                      </p>

                      {/* Tech Stack */}
                      {project.techStack.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginBottom: '12px'
                        }}>
                          {project.techStack.slice(0, 4).map((tech, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                                color: '#a78bfa',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span style={{
                              color: '#6b7280',
                              fontSize: '11px',
                              alignSelf: 'center'
                            }}>
                              +{project.techStack.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #313244',
                        marginTop: '12px'
                      }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                              {project.totalClicks}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MousePointer style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                              {project.totalClicks}
                            </span>
                          </div>
                          {project.totalEmailCaptures > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '500' }}>
                                {project.totalEmailCaptures} leads
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <span style={{ color: '#6b7280', fontSize: '11px' }}>
                          {formatDate(project.updatedAt)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '12px'
                      }}>
                        {project.demoUrl && (
                          <button
                            onClick={() => window.open(project.demoUrl!, '_blank')}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            <ExternalLink style={{ width: '12px', height: '12px' }} />
                            Demo
                          </button>
                        )}
                        
                        {project.repoUrl && (
                          <button
                            onClick={() => window.open(project.repoUrl!, '_blank')}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: 'rgba(107, 114, 128, 0.2)',
                              color: '#9ca3af',
                              border: '1px solid rgba(107, 114, 128, 0.3)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            <Github style={{ width: '12px', height: '12px' }} />
                            Code
                          </button>
                        )}

                        <button
                          onClick={() => router.push(`/dashboard/analytics`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            backgroundColor: 'rgba(124, 58, 237, 0.2)',
                            color: '#a78bfa',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <BarChart3 style={{ width: '12px', height: '12px' }} />
                        </button>

                        <button
                          onClick={() => handleToggleFeatured(project.id, project.featured)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            backgroundColor: project.featured 
                              ? 'rgba(251, 191, 36, 0.2)' 
                              : 'rgba(107, 114, 128, 0.2)',
                            color: project.featured ? '#f59e0b' : '#9ca3af',
                            border: `1px solid ${project.featured 
                              ? 'rgba(251, 191, 36, 0.3)' 
                              : 'rgba(107, 114, 128, 0.3)'}`,
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Star style={{ 
                            width: '12px', 
                            height: '12px',
                            fill: project.featured ? 'currentColor' : 'none'
                          }} />
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {pagination.hasMore && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  marginTop: '20px'
                }}>
                  <button
                    onClick={() => fetchProjects(false)}
                    disabled={loadingMore}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#1a1a2e',
                      color: '#ffffff',
                      border: '1px solid #313244',
                      borderRadius: '8px',
                      cursor: loadingMore ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loadingMore && <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />}
                    {loadingMore ? 'Loading...' : `Load More (${pagination.total - projects.length} remaining)`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function ProjectsPage() {
  return (
    <SessionProvider>
      <ProjectsContent />
    </SessionProvider>
  )
}