// src/app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { 
  User, 
  Mail, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin,
  Save,
  Eye,
  ExternalLink,
  Camera,
  Palette
} from 'lucide-react'

function ProfileContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
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
      router.push('/login')
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
      // TODO: API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock save
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

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Profile Settings
          </h1>
          <p style={{ color: '#6b7280' }}>
            Customize your public profile and personal information
          </p>
        </div>

        <div className="mobile-stack">
          {/* Main Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Personal Information */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <User style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                Personal Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Display Name */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
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
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Username */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
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
                      color: '#6b7280',
                      fontSize: '16px'
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
                        padding: '12px 12px 12px 120px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    This will be your public profile URL
                  </p>
                </div>

                {/* Email (readonly) */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
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
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Email cannot be changed here
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell visitors about yourself..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Globe style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                Social Links
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Website */}
                <div>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Globe style={{ height: '16px', width: '16px', marginRight: '6px' }} />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Github style={{ height: '16px', width: '16px', marginRight: '6px' }} />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/username"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Twitter style={{ height: '16px', width: '16px', marginRight: '6px' }} />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.twitterUrl}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/username"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Linkedin style={{ height: '16px', width: '16px', marginRight: '6px' }} />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Customization */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Palette style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                Theme Color
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {themeColors.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleInputChange('themeColor', theme.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: formData.themeColor === theme.value ? `2px solid ${theme.color}` : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: formData.themeColor === theme.value ? `${theme.color}10` : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: theme.color,
                      marginRight: '8px'
                    }} />
                    {theme.name}
                  </button>
                ))}
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
                padding: '16px 24px',
                backgroundColor: saved ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '16px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                'Saving...'
              ) : saved ? (
                <>
                  <Save style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                  Saved!
                </>
              ) : (
                <>
                  <Save style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Profile Preview */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '16px'
              }}>
                Profile Preview
              </h3>
              
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: themeColors.find(t => t.value === formData.themeColor)?.color || '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: '0 auto 12px'
                }}>
                  {formData.displayName?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                </div>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {formData.displayName || 'Your Name'}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  @{formData.username || 'username'}
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
                  {formData.bio || 'Your bio will appear here...'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.website && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <Globe style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                    Website
                  </div>
                )}
                {formData.githubUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <Github style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                    GitHub
                  </div>
                )}
                {formData.twitterUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <Twitter style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                    Twitter
                  </div>
                )}
                {formData.linkedinUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <Linkedin style={{ height: '14px', width: '14px', marginRight: '6px' }} />
                    LinkedIn
                  </div>
                )}
              </div>

              <button
                onClick={() => window.open(`/${formData.username || 'preview'}`, '_blank')}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Eye style={{ height: '16px', width: '16px', marginRight: '6px' }} />
                Preview Profile
              </button>
            </div>

            {/* Quick Tips */}
            <div style={{
              backgroundColor: '#eff6ff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #bfdbfe'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#1e40af',
                marginBottom: '12px'
              }}>
                💡 Profile Tips
              </h3>
              <ul style={{ color: '#1e40af', fontSize: '14px', lineHeight: '1.5', paddingLeft: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Choose a memorable username</li>
                <li style={{ marginBottom: '8px' }}>Write a compelling bio that shows your personality</li>
                <li style={{ marginBottom: '8px' }}>Add your social links to build credibility</li>
                <li>Pick a theme color that matches your brand</li>
              </ul>
            </div>

            {/* Profile Stats */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '16px'
              }}>
                Profile Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Profile Views</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>127</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Projects</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>3</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Clicks</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>48</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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