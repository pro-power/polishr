// src/app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  CreditCard, 
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Download,
  AlertTriangle
} from 'lucide-react'

function SettingsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Settings state
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showAnalytics: true,
    allowIndexing: true,
    emailNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
    twoFactorEnabled: false,
    loginAlerts: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('privacy')

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

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    setSaved(false)
  }

  const handleSaveSettings = async () => {
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

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match")
      return
    }
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Password changed successfully')
    } catch (error) {
      console.error('Password change error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    )
    
    if (confirmed) {
      const doubleConfirm = window.prompt(
        'Type "DELETE" to confirm account deletion:'
      )
      
      if (doubleConfirm === 'DELETE') {
        alert('Account deletion would be processed here')
      }
    }
  }

  const tabs = [
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'privacy':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Profile Visibility */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                Profile Visibility
              </label>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #7c3aed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#1a1a2e',
                  color: '#ffffff'
                }}
              >
                <option value="public">Public - Anyone can view your profile</option>
                <option value="unlisted">Unlisted - Only people with the link</option>
                <option value="private">Private - Only you can view</option>
              </select>
            </div>

            {/* Privacy Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px', color: '#ffffff' }}>
                  Show email address on public profile
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showAnalytics}
                  onChange={(e) => handleSettingChange('showAnalytics', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px', color: '#ffffff' }}>
                  Show view counts on projects
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.allowIndexing}
                  onChange={(e) => handleSettingChange('allowIndexing', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px', color: '#ffffff' }}>
                  Allow search engines to index your profile
                </span>
              </label>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                  Email notifications
                </div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                  Receive notifications about your account activity
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                  Weekly analytics reports
                </div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                  Get weekly summaries of your profile performance
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                  Marketing emails
                </div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                  Receive updates about new features and tips
                </div>
              </div>
            </label>
          </div>
        )

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Change Password */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#ffffff' }}>
                Change Password
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #7c3aed',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#1a1a2e',
                      color: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#a1a1aa'
                    }}
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="New password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #7c3aed',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#1a1a2e',
                      color: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#a1a1aa'
                    }}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #7c3aed',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#1a1a2e',
                      color: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#a1a1aa'
                    }}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    opacity: loading ? 0.7 : 1,
                    width: 'fit-content'
                  }}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div style={{ padding: '16px', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#ffffff' }}>
                    Two-Factor Authentication
                  </h3>
                  <p style={{ fontSize: '12px', color: '#a1a1aa' }}>
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: settings.twoFactorEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: settings.twoFactorEnabled ? '#10b981' : '#f59e0b',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <button
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: settings.twoFactorEnabled ? '#ef4444' : '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {settings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                Current Plan: Free
              </h3>
              <p style={{ fontSize: '14px', color: '#a1a1aa' }}>
                Upgrade to Pro for unlimited projects and advanced features
              </p>
            </div>
            <button
              style={{
                padding: '12px 20px',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                marginBottom: '12px'
              }}
            >
              Upgrade to Pro
            </button>
            <div style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'left' }}>
              • 3 projects (3/3 used)<br />
              • Basic analytics<br />
              • DevStack branding
            </div>
          </div>
        )

      case 'danger':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <button
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Download style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Download Your Data
              </button>
              <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '8px' }}>
                Export all your profile data, projects, and analytics
              </p>
            </div>

            <div style={{ 
              padding: '16px', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ef4444' }}>
                Delete Account
              </h3>
              <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '12px' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Trash2 style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Delete Account
              </button>
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
        {/* Header */}
        <div style={{ 
          backgroundColor: '#1a1a2e',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #7c3aed'
        }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            margin: '0 0 4px 0'
          }}>
            Account Settings
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
            Manage your account security, privacy, and notification preferences
          </p>
        </div>

        {/* Main Content */}
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
                    padding: '10px 12px',
                    marginBottom: '4px',
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
          </div>

          {/* Tab Content */}
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              {(() => {
                const activeTabData = tabs.find(tab => tab.id === activeTab)
                const Icon = activeTabData?.icon
                return (
                  <>
                    {Icon && <Icon style={{ height: '18px', width: '18px', marginRight: '8px', color: '#7c3aed' }} />}
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                      {activeTabData?.label}
                    </h2>
                  </>
                )
              })()}
            </div>
            
            {renderTabContent()}
          </div>
        </div>

        {/* Save Button */}
        {activeTab !== 'security' && activeTab !== 'danger' && (
          <button
            onClick={handleSaveSettings}
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
                <SettingsIcon style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Settings Saved!
              </>
            ) : (
              <>
                <SettingsIcon style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Save Settings
              </>
            )}
          </button>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function SettingsPage() {
  return (
    <SessionProvider>
      <SettingsContent />
    </SessionProvider>
  )
}