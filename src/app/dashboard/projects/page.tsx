// src/app/dashboard/projects/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
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
  Star
} from 'lucide-react'

import { useProjects, useProjectActions } from '@/hooks/use-projects'
import { PROJECT_CATEGORIES, PROJECT_STATUS_OPTIONS } from '@/lib/validations/project'
import { toast } from 'sonner'

function ProjectsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const { projects, loading, error, pagination, loadMore, refresh } = useProjects({
    search: searchQuery,
    category: selectedCategory || undefined,
    status: selectedStatus || undefined,
    featured: showFeaturedOnly || undefined,
    limit: 12,
  })

  const { loading: actionLoading, deleteProject, duplicateProject } = useProjectActions()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleDeleteProject = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    )
    
    if (confirmed) {
      const success = await deleteProject(id)
      if (success) {
        refresh() // Refresh the projects list
      }
    }
  }

  const handleDuplicateProject = async (id: string) => {
    const newProject = await duplicateProject(id)
    if (newProject) {
      refresh() // Refresh the projects list
      router.push(`/dashboard/projects/${newProject.id}/edit`)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }
      case 'DRAFT': return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' }
      case 'COMING_SOON': return { bg: '#eff6ff', text: '#1e40af', border: '#93c5fd' }
      case 'ARCHIVED': return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
    }
  }

  const getStatusLabel = (status: string) => {
    return PROJECT_STATUS_OPTIONS.find(option => option.value === status)?.label || status
  }

  const stats = {
    total: pagination.total,
    live: projects.filter(p => p.status === 'LIVE').length,
    draft: projects.filter(p => p.status === 'DRAFT').length,
    featured: projects.filter(p => p.featured).length,
    totalViews: projects.reduce((sum, p) => sum + (p.totalClicks || 0), 0),
    totalClicks: projects.reduce((sum, p) => sum + (p.totalClicks || 0), 0),
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                My Projects
              </h1>
              <p style={{ color: '#6b7280' }}>
                Manage and showcase your development projects
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/projects/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '16px'
              }}
            >
              <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Add Project
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Total Projects
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.total}
                </p>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ImageIcon style={{ height: '16px', width: '16px', color: '#3b82f6' }} />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Live Projects
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.live}
                </p>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Eye style={{ height: '16px', width: '16px', color: '#10b981' }} />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Total Clicks
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.totalClicks}
                </p>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#fff7ed',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MousePointer style={{ height: '16px', width: '16px', color: '#f59e0b' }} />
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Featured
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.featured}
                </p>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#faf5ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star style={{ height: '16px', width: '16px', color: '#8b5cf6' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '250px' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                height: '16px', 
                width: '16px', 
                color: '#6b7280' 
              }} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              <option value="">All Categories</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                minWidth: '130px'
              }}
            >
              <option value="">All Status</option>
              {PROJECT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Featured Filter */}
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: showFeaturedOnly ? '#3b82f6' : 'white',
                color: showFeaturedOnly ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <Star style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Featured Only
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 && !loading ? (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <ImageIcon style={{ height: '48px', width: '48px', color: '#9ca3af', margin: '0 auto' }} />
            </div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '8px'
            }}>
              {searchQuery || selectedCategory || selectedStatus ? 'No projects found' : 'No projects yet'}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {searchQuery || selectedCategory || selectedStatus 
                ? 'Try adjusting your filters to find projects.'
                : 'Start building your portfolio by adding your first project.'
              }
            </p>
            {!searchQuery && !selectedCategory && !selectedStatus && (
              <button
                onClick={() => router.push('/dashboard/projects/new')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0 auto'
                }}
              >
                <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {projects.map((project) => {
              const statusStyle = getStatusColor(project.status)
              
              return (
                <div
                  key={project.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Project Image */}
                  <div style={{
                    aspectRatio: '16/9',
                    backgroundColor: '#f3f4f6',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <ImageIcon style={{ height: '32px', width: '32px', color: '#9ca3af' }} />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fcd34d'
                        }}>
                          <Star style={{ height: '12px', width: '12px', marginRight: '4px' }} />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Actions Menu */}
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                          style={{
                            padding: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)'
                          }}
                          title="Edit project"
                        >
                          <Edit style={{ height: '16px', width: '16px', color: '#6b7280' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.title)}
                          style={{
                            padding: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)'
                          }}
                          title="Delete project"
                        >
                          <Trash2 style={{ height: '16px', width: '16px', color: '#dc2626' }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div style={{ padding: '24px' }}>
                    {/* Title and Category */}
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px',
                        lineHeight: '1.4'
                      }}>
                        {project.title}
                      </h3>
                      {project.category && (
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                          {PROJECT_CATEGORIES.find(cat => cat.value === project.category)?.label}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        marginBottom: '16px',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {project.description}
                      </p>
                    )}

                    {/* Tech Stack */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MousePointer style={{ height: '12px', width: '12px' }} />
                        {project.totalClicks} clicks
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ height: '12px', width: '12px' }} />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            textDecoration: 'none',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <ExternalLink style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                          Demo
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: '#374151',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <Github style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {pagination.hasMore && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Loading...' : 'Load More Projects'}
            </button>
          </div>
        )}
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