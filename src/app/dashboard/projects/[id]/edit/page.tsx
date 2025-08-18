// src/app/dashboard/projects/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, Copy, Trash2, BarChart3, MousePointer, Mail } from 'lucide-react'
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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 style={{ 
              height: '32px', 
              width: '32px', 
              color: '#7c3aed',
              margin: '0 auto 12px auto',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#a1a1aa' }}>Loading project...</p>
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
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Back Button */}
          <div style={{ 
            backgroundColor: '#1a1a2e',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #7c3aed'
          }}>
            <Link 
              href="/dashboard/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 10px',
                backgroundColor: 'transparent',
                color: '#a1a1aa',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                width: 'fit-content'
              }}
            >
              <ArrowLeft style={{ height: '14px', width: '14px', marginRight: '6px' }} />
              Back to Projects
            </Link>
          </div>

          {/* Error State */}
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '40px',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#ffffff'
            }}>
              {error === 'Project not found' ? 'Project Not Found' : 'Error Loading Project'}
            </h2>
            <p style={{
              color: '#a1a1aa',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error === 'Project not found' 
                ? 'The project you\'re looking for doesn\'t exist or you don\'t have permission to edit it.'
                : 'There was an error loading your project. Please try again.'
              }
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={fetchProject}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(124, 58, 237, 0.2)',
                  color: '#7c3aed',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Try Again
              </button>
              <Link
                href="/dashboard/projects"
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Back to Projects
              </Link>
            </div>
          </div>
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
        gap: '16px',
        overflow: 'hidden'
      }}>
        {/* Compact Header */}
        <div style={{ 
          backgroundColor: '#1a1a2e',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #7c3aed'
        }}>
          {/* Back Button */}
          <div style={{ marginBottom: '12px' }}>
            <Link 
              href="/dashboard/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 10px',
                backgroundColor: 'transparent',
                color: '#a1a1aa',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                width: 'fit-content',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#a1a1aa'
              }}
            >
              <ArrowLeft style={{ height: '14px', width: '14px', marginRight: '6px' }} />
              Back to Projects
            </Link>
          </div>

          {/* Page Title and Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                margin: '0 0 4px 0'
              }}>
                Edit Project
              </h1>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
                Update "{project.title}" in your portfolio
              </p>
            </div>

            {/* Project Stats */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#ffffff' 
                }}>
                  {project.totalClicks}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px'
                }}>
                  <MousePointer style={{ height: '10px', width: '10px' }} />
                  Clicks
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#ffffff' 
                }}>
                  {project.totalEmailCaptures}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px'
                }}>
                  <Mail style={{ height: '10px', width: '10px' }} />
                  Leads
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#ffffff' 
                }}>
                  {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#a1a1aa'
                }}>
                  Created
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout: Form + Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}>
          {/* Project Form */}
          <div style={{ overflow: 'auto' }}>
            <ProjectForm 
              initialData={project}
              isEditing={true}
            />
          </div>

          {/* Actions Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Quick Actions */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #7c3aed'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    // TODO: Implement project preview
                    toast.info('Project preview coming soon!')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                >
                  <Eye style={{ height: '14px', width: '14px', marginRight: '8px' }} />
                  Preview Project
                </button>
                
                <button
                  onClick={() => {
                    // TODO: Implement project duplication
                    toast.info('Project duplication coming soon!')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                >
                  <Copy style={{ height: '14px', width: '14px', marginRight: '8px' }} />
                  Duplicate Project
                </button>

                <button
                  onClick={() => {
                    // Navigate to analytics for this project
                    router.push('/dashboard/analytics')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                >
                  <BarChart3 style={{ height: '14px', width: '14px', marginRight: '8px' }} />
                  View Analytics
                </button>
              </div>
            </div>

            {/* Project Performance */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #7c3aed'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Project Performance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Total Clicks</span>
                  <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '12px' }}>{project.totalClicks}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Email Captures</span>
                  <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '12px' }}>{project.totalEmailCaptures}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Conversion Rate</span>
                  <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '12px' }}>
                    {project.totalClicks > 0 ? ((project.totalEmailCaptures / project.totalClicks) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Status</span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: project.status === 'LIVE' ? '#10b981' : project.status === 'DRAFT' ? '#f59e0b' : '#3b82f6',
                    fontSize: '12px' 
                  }}>
                    {project.status === 'LIVE' ? 'Live' : project.status === 'DRAFT' ? 'Draft' : project.status === 'COMING_SOON' ? 'Coming Soon' : 'Archived'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Featured</span>
                  <span style={{ fontWeight: '600', color: project.featured ? '#f59e0b' : '#6b7280', fontSize: '12px' }}>
                    {project.featured ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #7c3aed'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { event: 'Demo clicked', time: '2 hours ago', type: 'click' },
                  { event: 'Profile viewed', time: '4 hours ago', type: 'view' },
                  { event: 'Email captured', time: '6 hours ago', type: 'lead' },
                  { event: 'GitHub clicked', time: '1 day ago', type: 'click' }
                ].map((activity, index) => (
                  <div key={index} style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activity.type === 'lead' ? '#10b981' : activity.type === 'click' ? '#3b82f6' : '#f59e0b'
                      }} />
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>{activity.event}</span>
                    </div>
                    <span style={{ color: '#a1a1aa', fontSize: '11px' }}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ef4444',
                marginBottom: '8px'
              }}>
                Danger Zone
              </h3>
              <p style={{ 
                fontSize: '12px', 
                color: '#ef4444', 
                marginBottom: '12px',
                opacity: 0.8
              }}>
                Permanently delete this project and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
                  )
                  if (confirmed) {
                    // TODO: Implement project deletion
                    toast.info('Project deletion will be implemented soon!')
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Trash2 style={{ height: '14px', width: '14px', marginRight: '8px' }} />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}