// src/app/dashboard/projects/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lightbulb, Rocket, Zap, Image as ImageIcon, Link2, Code, Settings } from 'lucide-react'
import Link from 'next/link'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function CreateProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    console.log('Creating project:', formData)
    // TODO: Implement project creation
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
                  value={formData.title}
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
                  value={formData.category}
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
                  <option value="ai">AI/ML Project</option>
                  <option value="tool">Developer Tool</option>
                  <option value="game">Game</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Project Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/project-image.png"
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
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  Optional: Add a screenshot or preview image
                </p>
              </div>
            </div>

            <div>
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
                  value={formData.description}
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
                  {formData.description.length}/500 characters
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
                  value={formData.demoUrl}
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
                  value={formData.repoUrl}
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
                  value={formData.ctaType}
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
                  <option value="EMAIL">Email Capture</option>
                  <option value="CUSTOM">Custom Button</option>
                  <option value="NONE">No CTA</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Custom CTA URL */}
              {formData.ctaType === 'CUSTOM' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#ffffff',
                    marginBottom: '6px'
                  }}>
                    Custom CTA URL
                  </label>
                  <input
                    type="url"
                    value={formData.ctaUrl}
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
              {(formData.ctaType === 'CUSTOM' || formData.ctaType === 'EMAIL') && (
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
                    value={formData.ctaText}
                    onChange={(e) => handleInputChange('ctaText', e.target.value)}
                    placeholder={formData.ctaType === 'EMAIL' ? 'Get Updates' : 'Custom Action'}
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
                  CTA Preview
                </label>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#0f0f23',
                  borderRadius: '6px',
                  border: '1px solid #7c3aed'
                }}>
                  {formData.ctaType === 'DEMO' && formData.demoUrl && (
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      View Demo
                    </button>
                  )}
                  {formData.ctaType === 'EMAIL' && (
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {formData.ctaText || 'Get Updates'}
                    </button>
                  )}
                  {formData.ctaType === 'CUSTOM' && formData.ctaUrl && (
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {formData.ctaText || 'Custom Action'}
                    </button>
                  )}
                  {formData.ctaType === 'NONE' && (
                    <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                      No call-to-action button
                    </span>
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
                  Tech Stack
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB (comma separated)"
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
                      const value = e.currentTarget.value.trim()
                      if (value && !formData.techStack.includes(value)) {
                        handleInputChange('techStack', [...formData.techStack, value])
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                />
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  Press Enter or comma to add tags
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
                  value={formData.status}
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

            <div>
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
                        <div style={{ color: '#a1a1aa', fontSize: '11px', lineHeight: '1.3' }}>
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
              {/* Featured Project */}
              <div>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    style={{ marginRight: '8px', width: '16px', height: '16px' }}
                  />
                  Featured Project
                </label>
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  Featured projects appear first on your profile
                </p>
              </div>

              {/* Project Visibility */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Visibility
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px', 
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.status !== 'DRAFT'}
                      onChange={() => handleInputChange('status', 'LIVE')}
                      style={{ marginRight: '8px' }}
                    />
                    Public - Visible on your profile
                  </label>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px', 
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.status === 'DRAFT'}
                      onChange={() => handleInputChange('status', 'DRAFT')}
                      style={{ marginRight: '8px' }}
                    />
                    Private - Only visible to you
                  </label>
                </div>
              </div>
            </div>

            <div>
              {/* Project Tips */}
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
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Lightbulb style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                  💡 Tips
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    'Add both demo and GitHub links',
                    'Use clear, descriptive titles',
                    'Include relevant tech stack tags',
                    'Write compelling descriptions',
                    'Feature your best projects'
                  ].map((tip, index) => (
                    <div key={index} style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px'
                    }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: '#7c3aed',
                        marginTop: '6px',
                        flexShrink: 0
                      }} />
                      <span style={{ color: '#a1a1aa', fontSize: '12px', lineHeight: '1.4' }}>{tip}</span>
                    </div>
                  ))}
                </div>
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

          {/* Page Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                margin: '0 0 4px 0'
              }}>
                Create New Project
              </h1>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
                Add a new project to showcase in your developer portfolio
              </p>
            </div>

            {/* Portfolio Stats */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>3</div>
                <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Projects</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>1</div>
                <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Featured</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>261</div>
                <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Total Clicks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '240px 1fr',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}>
          {/* Tabs Sidebar */}
          <div style={{
            backgroundColor: '#1a1a2e',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            padding: '12px'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                    color: isActive ? '#7c3aed' : '#a1a1aa',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#a1a1aa'
                    }
                  }}
                >
                  <Icon style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  {tab.label}
                </button>
              )
            })}

            {/* Motivation */}
            <div style={{
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>🚀</span>
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: '#a1a1aa', 
                lineHeight: '1.4',
                margin: 0
              }}>
                Every great developer started with one project. Make yours count!
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            overflow: 'hidden'
          }}>
            {renderTabContent()}
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleSubmit}
          disabled={!formData.title || !formData.description}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 20px',
            backgroundColor: (!formData.title || !formData.description) ? '#6b7280' : '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!formData.title || !formData.description) ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            width: 'fit-content',
            alignSelf: 'flex-end'
          }}
        >
          <Rocket style={{ height: '16px', width: '16px', marginRight: '8px' }} />
          Create Project
        </button>
      </div>
    </DashboardLayout>
  )
}