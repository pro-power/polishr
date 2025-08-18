// src/app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { 
  User, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin,
  Save,
  Eye,
  Palette,
  Settings
} from 'lucide-react'

function ProfileContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    website: '',
    twitterUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    themeColor: 'blue'
  })
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Load user data
  useEffect(() => {
    if (session?.user) {
      setFormData({
        displayName: session.user.name || '',
        username: session.user.username || '',
        bio: '',
        website: '',
        twitterUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        themeColor: 'blue'
      })
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const themeColors = [
    { name: 'Blue', value: 'blue', color: '#3b82f6' },
    { name: 'Purple', value: 'purple', color: '#8b5cf6' },
    { name: 'Green', value: 'green', color: '#10b981' },
    { name: 'Pink', value: 'pink', color: '#ec4899' },
    { name: 'Orange', value: 'orange', color: '#f59e0b' },
    { name: 'Red', value: 'red', color: '#ef4444' }
  ]

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'theme', label: 'Theme', icon: Palette },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Display Name */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your full name"
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

              {/* Username */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a1a1aa',
                    fontSize: '14px'
                  }}>
                    devstack.link/
                  </span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                    placeholder="username"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 110px',
                      border: '1px solid #7c3aed',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#0f0f23',
                      color: '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={session.user?.email || ''}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#a1a1aa',
                    opacity: 0.7
                  }}
                />
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  Email cannot be changed here
                </p>
              </div>
            </div>

            <div>
              {/* Bio */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell visitors about yourself..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #7c3aed',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#0f0f23',
                    color: '#ffffff',
                    resize: 'none',
                    height: '180px'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '4px' }}>
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>
        )

      case 'social':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Website */}
              <div>
                <label style={{ 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Globe style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
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

              {/* GitHub */}
              <div>
                <label style={{ 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Github style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username"
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Twitter */}
              <div>
                <label style={{ 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Twitter style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/username"
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

              {/* LinkedIn */}
              <div>
                <label style={{ 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: '#ffffff',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Linkedin style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
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
            </div>
          </div>
        )

      case 'theme':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '100%' }}>
            <div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                Choose Theme Color
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {themeColors.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleInputChange('themeColor', theme.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: formData.themeColor === theme.value ? `2px solid ${theme.color}` : '1px solid #7c3aed',
                      borderRadius: '6px',
                      backgroundColor: formData.themeColor === theme.value ? `${theme.color}20` : '#0f0f23',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#ffffff'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: theme.color,
                      marginRight: '8px'
                    }} />
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                Preview
              </h3>
              <div style={{
                padding: '16px',
                backgroundColor: '#0f0f23',
                borderRadius: '8px',
                border: '1px solid #7c3aed',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: themeColors.find(t => t.value === formData.themeColor)?.color || '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 auto 12px'
                }}>
                  {formData.displayName?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                </div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  marginBottom: '4px'
                }}>
                  {formData.displayName || 'Your Name'}
                </h4>
                <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>
                  @{formData.username || 'username'}
                </p>
                <p style={{ color: '#a1a1aa', fontSize: '12px', lineHeight: '1.4' }}>
                  {formData.bio || 'Your bio will appear here...'}
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
              Profile Settings
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Customize your public profile and personal information
            </p>
          </div>

          {/* Profile Stats */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>127</div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Views</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>3</div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Projects</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>48</div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Clicks</div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '200px 1fr',
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

            {/* Preview Button */}
            <button
              onClick={() => window.open(`/${formData.username || 'preview'}`, '_blank')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#7c3aed',
                marginTop: '16px',
                justifyContent: 'center'
              }}
            >
              <Eye style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Preview
            </button>
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

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 20px',
            backgroundColor: saved ? '#10b981' : '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            opacity: loading ? 0.7 : 1,
            width: 'fit-content',
            alignSelf: 'flex-end'
          }}
        >
          {loading ? (
            'Saving...'
          ) : saved ? (
            <>
              <Save style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Settings Saved!
            </>
          ) : (
            <>
              <Save style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </DashboardLayout>
  )
}

export default function ProfilePage() {
  return (
    <SessionProvider>
      <ProfileContent />
    </SessionProvider>
  )
}