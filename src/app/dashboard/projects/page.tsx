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
  Calendar
} from 'lucide-react'

// Mock project data - TODO: Replace with actual API calls
const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce platform built with Next.js and Stripe',
    demoUrl: 'https://demo.example.com',
    repoUrl: 'https://github.com/user/ecommerce',
    imageUrl: null,
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'Prisma'],
    status: 'LIVE',
    featured: true,
    clickCount: 45,
    viewCount: 123,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management tool with real-time updates',
    demoUrl: 'https://tasks.example.com',
    repoUrl: 'https://github.com/user/taskmanager',
    imageUrl: null,
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    status: 'LIVE',
    featured: false,
    clickCount: 23,
    viewCount: 67,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Beautiful weather dashboard with location-based forecasts',
    demoUrl: null,
    repoUrl: 'https://github.com/user/weather',
    imageUrl: null,
    techStack: ['Vue.js', 'Chart.js', 'Weather API'],
    status: 'DRAFT',
    featured: false,
    clickCount: 8,
    viewCount: 34,
    createdAt: '2024-01-05'
  }
]

function ProjectsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState(mockProjects)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }
      case 'DRAFT': return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' }
      case 'ARCHIVED': return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
    }
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
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
            <Plus style={{ height: '20px', width: '20px', marginRight: '8px' }} />
            Add Project
          </button>
        </div>

        {/* Stats Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
              Total Projects
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {projects.length}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
              Total Views
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {projects.reduce((sum, p) => sum + p.viewCount, 0)}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
              Total Clicks
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {projects.reduce((sum, p) => sum + p.clickCount, 0)}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
              Live Projects
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {projects.filter(p => p.status === 'LIVE').length}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            border: '2px dashed #d1d5db',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <ImageIcon style={{ height: '48px', width: '48px', color: '#9ca3af', margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              No projects yet
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Start building your portfolio by adding your first project
            </p>
            <button
              onClick={() => router.push('/dashboard/projects/new')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
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
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Project Image Placeholder */}
                  <div style={{
                    height: '160px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <ImageIcon style={{ height: '40px', width: '40px', color: '#9ca3af' }} />
                    )}
                  </div>

                  {/* Project Content */}
                  <div style={{ padding: '20px' }}>
                    {/* Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {project.title}
                        </h3>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {project.status}
                        </div>
                        {project.featured && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '4px 8px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #fcd34d',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}>
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {project.techStack.map((tech, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      marginBottom: '16px',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye style={{ height: '14px', width: '14px', color: '#6b7280' }} />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {project.viewCount} views
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MousePointer style={{ height: '14px', width: '14px', color: '#6b7280' }} />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {project.clickCount} clicks
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ height: '14px', width: '14px', color: '#6b7280' }} />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
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
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                          style={{
                            padding: '8px',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          title="Edit project"
                        >
                          <Edit style={{ height: '16px', width: '16px', color: '#6b7280' }} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this project?')) {
                              // TODO: Delete project
                              console.log('Delete project:', project.id)
                            }
                          }}
                          style={{
                            padding: '8px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          title="Delete project"
                        >
                          <Trash2 style={{ height: '16px', width: '16px', color: '#dc2626' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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