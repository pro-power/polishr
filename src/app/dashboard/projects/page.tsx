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
  Star,
  Filter
} from 'lucide-react'

function ProjectsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Mock data for demo
  const [projects] = useState([
    {
      id: '1',
      title: 'TaskFlow App',
      description: 'A project management application with real-time collaboration features and team workspace.',
      demoUrl: 'https://taskflow-demo.com',
      repoUrl: 'https://github.com/demo/taskflow',
      imageUrl: null,
      techStack: ['Next.js', 'TypeScript', 'Prisma'],
      category: 'web',
      status: 'LIVE',
      featured: true,
      totalClicks: 127,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'AI Content Generator',
      description: 'Machine learning powered content generation tool with advanced AI capabilities.',
      demoUrl: null,
      repoUrl: 'https://github.com/demo/ai-content',
      imageUrl: null,
      techStack: ['Python', 'FastAPI', 'OpenAI'],
      category: 'ai',
      status: 'COMING_SOON',
      featured: false,
      totalClicks: 45,
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      title: 'Mobile Finance Tracker',
      description: 'React Native app for personal finance tracking with beautiful charts and insights.',
      demoUrl: null,
      repoUrl: 'https://github.com/demo/finance-tracker',
      imageUrl: null,
      techStack: ['React Native', 'Firebase'],
      category: 'mobile',
      status: 'ARCHIVED',
      featured: false,
      totalClicks: 89,
      createdAt: '2023-12-10',
    }
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <div style={{ color: '#ffffff' }}>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const handleDeleteProject = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    )
    
    if (confirmed) {
      console.log('Delete project:', id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' }
      case 'DRAFT': return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' }
      case 'COMING_SOON': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }
      case 'ARCHIVED': return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' }
      default: return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' }
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'LIVE': 'Live',
      'DRAFT': 'Draft',
      'COMING_SOON': 'Coming Soon',
      'ARCHIVED': 'Archived'
    }
    return statusMap[status] || status
  }

  const stats = {
    total: projects.length,
    live: projects.filter(p => p.status === 'LIVE').length,
    draft: projects.filter(p => p.status === 'DRAFT').length,
    featured: projects.filter(p => p.featured).length,
    totalClicks: projects.reduce((sum, p) => sum + (p.totalClicks || 0), 0),
  }

  return (
    <DashboardLayout>
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden'
      }}>
        {/* Compact Header */}
        <div style={{ 
          backgroundColor: '#1a1a2e',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #7c3aed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: '0 0 4px 0'
            }}>
              My Projects
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Manage and showcase your development projects
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
            Add Project
          </button>
        </div>

        {/* Compact Stats Grid - 5 in a row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px'
        }}>
          {[
            { name: 'Total', value: stats.total, icon: ImageIcon, color: '#7c3aed' },
            { name: 'Live', value: stats.live, icon: Eye, color: '#10b981' },
            { name: 'Draft', value: stats.draft, icon: Edit, color: '#f59e0b' },
            { name: 'Featured', value: stats.featured, icon: Star, color: '#ef4444' },
            { name: 'Clicks', value: stats.totalClicks, icon: MousePointer, color: '#3b82f6' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                style={{
                  backgroundColor: '#1a1a2e',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #7c3aed',
                  textAlign: 'center'
                }}
              >
                <Icon style={{ 
                  height: '16px', 
                  width: '16px', 
                  color: stat.color,
                  margin: '0 auto 6px auto',
                  display: 'block'
                }} />
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  margin: '0 0 2px 0'
                }}>
                  {stat.value}
                </p>
                <p style={{ 
                  color: '#a1a1aa', 
                  fontSize: '12px',
                  margin: 0
                }}>
                  {stat.name}
                </p>
              </div>
            )
          })}
        </div>

        {/* Compact Filters */}
        <div style={{ 
          backgroundColor: '#1a1a2e',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #7c3aed',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '250px' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              height: '14px', 
              width: '14px', 
              color: '#a1a1aa' 
            }} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px 8px 32px',
                border: '1px solid #7c3aed',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#0f0f23',
                color: '#ffffff'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 10px',
              border: '1px solid #7c3aed',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#0f0f23',
              color: '#ffffff',
              minWidth: '120px'
            }}
          >
            <option value="">All Categories</option>
            <option value="web">Web App</option>
            <option value="mobile">Mobile App</option>
            <option value="ai">AI/ML</option>
            <option value="tool">Tool</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 10px',
              border: '1px solid #7c3aed',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#0f0f23',
              color: '#ffffff',
              minWidth: '100px'
            }}
          >
            <option value="">All Status</option>
            <option value="LIVE">Live</option>
            <option value="DRAFT">Draft</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Featured Filter */}
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: showFeaturedOnly ? '#7c3aed' : 'transparent',
              color: showFeaturedOnly ? 'white' : '#a1a1aa',
              border: '1px solid #7c3aed',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            <Star style={{ height: '14px', width: '14px', marginRight: '6px' }} />
            Featured
          </button>
        </div>

        {/* Projects Grid */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {projects.length === 0 ? (
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '40px 30px',
              borderRadius: '8px',
              border: '1px solid #7c3aed',
              textAlign: 'center'
            }}>
              <ImageIcon style={{ height: '32px', width: '32px', color: '#a1a1aa', margin: '0 auto 12px auto' }} />
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                No projects yet
              </h3>
              <p style={{ color: '#a1a1aa', marginBottom: '16px', fontSize: '14px' }}>
                Start building your portfolio by adding your first project.
              </p>
              <button
                onClick={() => router.push('/dashboard/projects/new')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0 auto',
                  fontSize: '14px'
                }}
              >
                <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Add Your First Project
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {projects.map((project) => {
                const statusStyle = getStatusColor(project.status)
                
                return (
                  <div
                    key={project.id}
                    style={{
                      backgroundColor: '#1a1a2e',
                      borderRadius: '8px',
                      border: '1px solid #7c3aed',
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {/* Compact Project Image */}
                    <div style={{
                      aspectRatio: '16/8',
                      backgroundColor: '#0f0f23',
                      position: 'relative',
                      overflow: 'hidden',
                      borderBottom: '1px solid #7c3aed'
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
                          <ImageIcon style={{ height: '20px', width: '20px', color: '#7c3aed' }} />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
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
                        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '500',
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.3)'
                          }}>
                            <Star style={{ height: '8px', width: '8px', marginRight: '2px' }} />
                            Featured
                          </span>
                        </div>
                      )}

                      {/* Actions Menu */}
                      <div style={{ position: 'absolute', bottom: '6px', right: '6px' }}>
                        <div style={{ 
                          display: 'flex', 
                          gap: '4px'
                        }}>
                          <button
                            onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                            style={{
                              padding: '4px',
                              backgroundColor: 'rgba(26, 26, 46, 0.9)',
                              border: '1px solid #7c3aed',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              backdropFilter: 'blur(4px)'
                            }}
                            title="Edit project"
                          >
                            <Edit style={{ height: '12px', width: '12px', color: '#7c3aed' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id, project.title)}
                            style={{
                              padding: '4px',
                              backgroundColor: 'rgba(26, 26, 46, 0.9)',
                              border: '1px solid #ef4444',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              backdropFilter: 'blur(4px)'
                            }}
                            title="Delete project"
                          >
                            <Trash2 style={{ height: '12px', width: '12px', color: '#ef4444' }} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Compact Project Content */}
                    <div style={{ padding: '12px' }}>
                      {/* Title and Category */}
                      <div style={{ marginBottom: '6px' }}>
                        <h3 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: '#ffffff',
                          marginBottom: '2px',
                          lineHeight: '1.3'
                        }}>
                          {project.title}
                        </h3>
                        {project.category && (
                          <p style={{ fontSize: '11px', color: '#a1a1aa' }}>
                            {project.category}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {project.description && (
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#a1a1aa', 
                          marginBottom: '8px',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {project.description}
                        </p>
                      )}

                      {/* Tech Stack */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                                color: '#7c3aed',
                                fontSize: '10px',
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
                              padding: '1px 4px',
                              borderRadius: '3px',
                              backgroundColor: 'rgba(124, 58, 237, 0.2)',
                              color: '#7c3aed',
                              fontSize: '10px',
                              fontWeight: '500'
                            }}>
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats and Actions */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                      }}>
                        {/* Stats */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          fontSize: '11px',
                          color: '#a1a1aa'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <MousePointer style={{ height: '8px', width: '8px' }} />
                            {project.totalClicks}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Calendar style={{ height: '8px', width: '8px' }} />
                            {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px 6px',
                                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                                color: '#7c3aed',
                                textDecoration: 'none',
                                border: '1px solid rgba(124, 58, 237, 0.3)',
                                borderRadius: '3px',
                                fontSize: '10px',
                                fontWeight: '500'
                              }}
                            >
                              <ExternalLink style={{ height: '10px', width: '10px', marginRight: '2px' }} />
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
                                padding: '4px 6px',
                                backgroundColor: '#374151',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '3px',
                                fontSize: '10px',
                                fontWeight: '500'
                              }}
                            >
                              <Github style={{ height: '10px', width: '10px', marginRight: '2px' }} />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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