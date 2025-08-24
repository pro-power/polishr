// src/app/dashboard/projects/new/page.tsx - Complete implementation with API integration
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lightbulb, Rocket, Zap, Image as ImageIcon, Link2, Code, Settings } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function CreateProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // FIXED: Initialize all form fields with empty strings instead of undefined
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    techStack: [] as string[],
    demoUrl: '',
    repoUrl: '',
    imageUrl: '',
    status: 'DRAFT',
    featured: false,
    ctaType: 'DEMO',
    ctaUrl: '',
    ctaText: ''
  })

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

  // FIXED: Ensure values are never undefined
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value === null || value === undefined ? '' : value 
    }))
  }

  // FIXED: Implement actual project creation with API call
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Missing required fields', {
        description: 'Please fill in the project title and description.'
      })
      return
    }

    if (formData.techStack.length === 0) {
      toast.error('Tech stack required', {
        description: 'Please add at least one technology to your tech stack.'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare project data for API
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category || null,
        techStack: formData.techStack,
        demoUrl: formData.demoUrl.trim() || null,
        repoUrl: formData.repoUrl.trim() || null,
        status: formData.status,
        featured: formData.featured,
        isPublic: formData.status !== 'DRAFT', // Public if not draft
        ctaType: formData.ctaType,
        ctaUrl: formData.ctaUrl.trim() || null,
        ctaText: formData.ctaText.trim() || null,
      }

      console.log('Creating project with data:', projectData)

      // Call the projects API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const result = await response.json()

      if (response.ok) {
        // Success! Show success toast and redirect
        toast.success('Project created successfully!', {
          description: 'Your project has been added to your portfolio.',
        })

        // Redirect to projects list after a short delay
        setTimeout(() => {
          router.push('/dashboard/projects')
        }, 1000)

      } else {
        // Handle API errors
        console.error('Project creation failed:', result)
        
        if (response.status === 403 && result.message?.includes('limit')) {
          toast.error('Project limit reached', {
            description: 'Upgrade to Pro for unlimited projects.',
          })
        } else {
          toast.error('Failed to create project', {
            description: result.message || 'Please try again.',
          })
        }
      }

    } catch (error) {
      console.error('Project creation error:', error)
      toast.error('Something went wrong', {
        description: 'Please check your connection and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: ImageIcon },
    { id: 'links', label: 'Links & CTA', icon: Link2 },
    { id: 'tech', label: 'Tech & Status', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="My Awesome Project"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Category
                </label>
                <select
                  value={formData.category || ''} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop App</option>
                  <option value="api">API/Backend</option>
                  <option value="ai">AI/Machine Learning</option>
                  <option value="tool">Developer Tool</option>
                  <option value="game">Game</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Description */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Description *
                </label>
                <textarea
                  value={formData.description || ''} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project, what it does, and what makes it special..."
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff',
                    resize: 'none',
                    height: '200px'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  {(formData.description || '').length}/500 characters
                </p>
              </div>
            </div>
          </div>
        )

      case 'links':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Demo URL */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Demo URL
                </label>
                <input
                  type="url"
                  value={formData.demoUrl || ''} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                  placeholder="https://my-project-demo.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                />
              </div>

              {/* Repository URL */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Repository URL
                </label>
                <input
                  type="url"
                  value={formData.repoUrl || ''} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('repoUrl', e.target.value)}
                  placeholder="https://github.com/username/project"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                />
              </div>

              {/* CTA Type */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Call-to-Action Type
                </label>
                <select
                  value={formData.ctaType || 'DEMO'} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('ctaType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                >
                  <option value="DEMO">Demo Link</option>
                  <option value="GITHUB">GitHub Repository</option>
                  <option value="WAITLIST">Email Waitlist</option>
                  <option value="BUY">Purchase Link</option>
                  <option value="CONTACT">Contact Form</option>
                  <option value="CUSTOM">Custom Button</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Custom CTA URL */}
              {(formData.ctaType === 'CUSTOM' || formData.ctaType === 'BUY') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#ffffff',
                    marginBottom: '6px'
                  }}>
                    CTA URL
                  </label>
                  <input
                    type="url"
                    value={formData.ctaUrl || ''} // FIXED: Ensure never undefined
                    onChange={(e) => handleInputChange('ctaUrl', e.target.value)}
                    placeholder="https://custom-action.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #7c3aed',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#0f0f23',
                      color: '#ffffff'
                    }}
                  />
                </div>
              )}

              {/* Custom CTA Text */}
              {(formData.ctaType === 'CUSTOM' || formData.ctaType === 'WAITLIST' || formData.ctaType === 'BUY') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#ffffff',
                    marginBottom: '6px'
                  }}>
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText || ''} // FIXED: Ensure never undefined
                    onChange={(e) => handleInputChange('ctaText', e.target.value)}
                    placeholder={
                      formData.ctaType === 'WAITLIST' ? 'Join Waitlist' :
                      formData.ctaType === 'BUY' ? 'Buy Now' :
                      'Custom Action'
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #7c3aed',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#0f0f23',
                      color: '#ffffff'
                    }}
                  />
                </div>
              )}

              {/* CTA Preview */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Button Preview
                </label>
                <div style={{
                  padding: '10px 12px',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  backgroundColor: '#1a1a2e'
                }}>
                  {formData.ctaType === 'DEMO' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      View Demo
                    </button>
                  )}
                  {formData.ctaType === 'GITHUB' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1f2937',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      View Code
                    </button>
                  )}
                  {formData.ctaType === 'WAITLIST' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {formData.ctaText || 'Join Waitlist'}
                    </button>
                  )}
                  {formData.ctaType === 'BUY' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {formData.ctaText || 'Buy Now'}
                    </button>
                  )}
                  {formData.ctaType === 'CUSTOM' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {formData.ctaText || 'Custom Action'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 'tech':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Tech Stack */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Tech Stack *
                </label>
                <input
                  type="text"
                  placeholder="Type and press Enter (e.g., React, Node.js, MongoDB)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim().replace(/,$/, '') // Remove trailing comma
                      if (value && !formData.techStack.includes(value)) {
                        handleInputChange('techStack', [...formData.techStack, value])
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                />
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  Press Enter or comma to add technologies
                </p>
                
                {/* Tech Stack Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {formData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                        color: '#7c3aed',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {tech}
                      <button
                        onClick={() => {
                          const newTechStack = formData.techStack.filter((_, i) => i !== index)
                          handleInputChange('techStack', newTechStack)
                        }}
                        style={{
                          marginLeft: '6px',
                          background: 'none',
                          border: 'none',
                          color: '#7c3aed',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {formData.techStack.length === 0 && (
                  <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                    Please add at least one technology
                  </p>
                )}
              </div>

              {/* Project Status */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Project Status
                </label>
                <select
                  value={formData.status || 'DRAFT'} // FIXED: Ensure never undefined
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff'
                  }}
                >
                  <option value="DRAFT">Draft - Work in progress</option>
                  <option value="LIVE">Live - Completed and public</option>
                  <option value="COMING_SOON">Coming Soon - Announced</option>
                  <option value="ARCHIVED">Archived - No longer featured</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Status Guide */}
              <div style={{
                padding: '16px',
                backgroundColor: '#0f0f23',
                borderRadius: '6px',
                border: '1px solid #7c3aed'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>
                  Status Guide
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { status: 'Draft', desc: 'Work in progress, not visible publicly', color: '#f59e0b' },
                    { status: 'Live', desc: 'Completed and showcased on your profile', color: '#10b981' },
                    { status: 'Coming Soon', desc: 'Announced but not yet released', color: '#3b82f6' },
                    { status: 'Archived', desc: 'Completed but no longer featured', color: '#6b7280' }
                  ].map((item) => (
                    <div key={item.status} style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        marginTop: '4px',
                        flexShrink: 0
                      }} />
                      <div>
                        <div style={{ 
                          color: '#ffffff', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          marginBottom: '2px'
                        }}>
                          {item.status}
                        </div>
                        <div style={{ 
                          color: '#a1a1aa', 
                          fontSize: '11px'
                        }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Featured */}
              <div>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.featured || false} // FIXED: Ensure never undefined
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#7c3aed'
                    }}
                  />
                  Featured Project
                </label>
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  Featured projects appear at the top of your portfolio
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/dashboard/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '6px',
                color: '#a1a1aa',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              <ArrowLeft style={{ height: '20px', width: '20px' }} />
            </Link>
            
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                margin: '0'
              }}>
                Create New Project
              </h1>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '4px 0 0 0' }}>
                Add a new project to your portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#1a1a2e', padding: '4px', borderRadius: '8px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: isActive ? '#7c3aed' : 'transparent',
                  color: isActive ? 'white' : '#a1a1aa',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <Icon style={{ height: '16px', width: '16px' }} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#1a1a2e', 
          borderRadius: '8px', 
          padding: '16px',
          overflow: 'auto'
        }}>
          {renderTabContent()}
        </div>

        {/* Actions */}
        <button
          onClick={handleSubmit}
          disabled={!formData.title || !formData.description || formData.techStack.length === 0 || isSubmitting}
          style={{
            padding: '12px 24px',
            backgroundColor: (!formData.title || !formData.description || formData.techStack.length === 0 || isSubmitting) 
              ? '#6b7280' : '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!formData.title || !formData.description || formData.techStack.length === 0 || isSubmitting) 
              ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            width: 'fit-content',
            alignSelf: 'flex-end',
            display: 'flex',
            alignItems: 'center',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }} />
              Creating...
            </>
          ) : (
            <>
              <Rocket style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Create Project
            </>
          )}
        </button>
      </div>
    </DashboardLayout>
  )
}