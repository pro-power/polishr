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
  RefreshCw
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status, router])

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedStatus) params.append('status', selectedStatus)
      if (showFeaturedOnly) params.append('featured', 'true')
      
      const response = await fetch(`/api/projects?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data.projects || [])

    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
      toast.error('Failed to load projects', {
        description: 'Please try again or refresh the page.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh projects when filters change
  useEffect(() => {
    if (status === 'authenticated') {
      const timeoutId = setTimeout(fetchProjects, 300) // Debounce search
      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, selectedCategory, selectedStatus, showFeaturedOnly, status])

  const handleDeleteProject = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Project deleted successfully')
        // Remove project from local state
        setProjects(prev => prev.filter(p => p.id !== id))
      } else {
        throw new Error('Failed to delete project')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete project')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return '#10b981'
      case 'DRAFT': return '#f59e0b'
      case 'COMING_SOON': return '#3b82f6'
      case 'ARCHIVED': return '#6b7280'
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

  const filteredProjects = projects.filter(project => {
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(project.description?.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    if (selectedCategory && project.category !== selectedCategory) return false
    if (selectedStatus && project.status !== selectedStatus) return false
    if (showFeaturedOnly && !project.featured) return false
    return true
  })

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '400px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#ffffff'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Loading projects...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        padding: '16px',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: '0'
            }}>
              My Projects
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '4px 0 0 0' }}>
              Manage and showcase your work
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={fetchProjects}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #7c3aed',
                borderRadius: '6px',
                color: '#7c3aed',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw style={{ height: '16px', width: '16px' }} />
              Refresh
            </button>
            
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
              New Project
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          padding: '16px',
          backgroundColor: '#1a1a2e',
          borderRadius: '8px'
        }}>
          {/* Search */}
          <div>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '16px',
                width: '16px',
                color: '#a1a1aa'
              }} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#0f0f23',
                  color: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #333',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#0f0f23',
              color: '#ffffff'
            }}
          >
            <option value="">All Categories</option>
            <option value="web">Web Application</option>
            <option value="mobile">Mobile App</option>
            <option value="desktop">Desktop App</option>
            <option value="api">API/Backend</option>
            <option value="ai">AI/Machine Learning</option>
            <option value="tool">Developer Tool</option>
            <option value="game">Game</option>
            <option value="other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #333',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#0f0f23',
              color: '#ffffff'
            }}
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="LIVE">Live</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Featured Filter */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#7c3aed'
              }}
            />
            Featured only
          </label>
        </div>

        {/* Error State */}
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444'
          }}>
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {filteredProjects.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '20px',
                    position: 'relative'
                  }}
                >
                  {/* Featured Badge */}
                  {project.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '2px 6px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      <Star style={{ height: '10px', width: '10px', marginRight: '2px' }} />
                      Featured
                    </div>
                  )}

                  {/* Project Image Placeholder */}
                  <div style={{
                    width: '100%',
                    height: '120px',
                    backgroundColor: '#0f0f23',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : (
                      <ImageIcon style={{ height: '32px', width: '32px', color: '#a1a1aa' }} />
                    )}
                  </div>

                  {/* Project Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#ffffff',
                        margin: 0,
                        flex: 1
                      }}>
                        {project.title}
                      </h3>
                      
                      <span style={{
                        padding: '2px 6px',
                        backgroundColor: getStatusColor(project.status),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '500'
                      }}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    <p style={{
                      color: '#a1a1aa',
                      fontSize: '13px',
                      margin: '0 0 12px 0',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {project.description || 'No description provided'}
                    </p>

                    {/* Tech Stack */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                      {project.techStack.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: 'rgba(124, 58, 237, 0.2)',
                            color: '#7c3aed',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span style={{
                          padding: '2px 6px',
                          color: '#a1a1aa',
                          fontSize: '10px'
                        }}>
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye style={{ height: '12px', width: '12px', color: '#a1a1aa' }} />
                        <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                          {project.totalClicks} clicks
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ height: '12px', width: '12px', color: '#a1a1aa' }} />
                        <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          backgroundColor: 'transparent',
                          border: '1px solid #7c3aed',
                          borderRadius: '4px',
                          color: '#7c3aed',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit style={{ height: '12px', width: '12px' }} />
                        Edit
                      </button>
                      
                      {project.demoUrl && (
                        <button
                          onClick={() => window.open(project.demoUrl!, '_blank')}
                          style={{
                            padding: '6px 8px',
                            backgroundColor: '#3b82f6',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <ExternalLink style={{ height: '12px', width: '12px' }} />
                        </button>
                      )}

                      {project.repoUrl && (
                        <button
                          onClick={() => window.open(project.repoUrl!, '_blank')}
                          style={{
                            padding: '6px 8px',
                            backgroundColor: '#1f2937',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <Github style={{ height: '12px', width: '12px' }} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: 'transparent',
                          border: '1px solid #ef4444',
                          borderRadius: '4px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <Trash2 style={{ height: '12px', width: '12px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              color: '#a1a1aa',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: '0 0 8px 0' }}>
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