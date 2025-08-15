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
  Smartphone,
  Globe,
  Download,
  AlertTriangle
} from 'lucide-react'

function SettingsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Settings state
  const [settings, setSettings] = useState({
    // Privacy Settings
    profileVisibility: 'public', // public, private, unlisted
    showEmail: false,
    showAnalytics: true,
    allowIndexing: true,
    
    // Notification Settings
    emailNotifications: true,
    weeklyReports: true,
    projectComments: false,
    marketingEmails: false,
    
    // Account Settings
    twoFactorEnabled: false,
    loginAlerts: true,
    dataDownload: false,
    
    // Subscription Settings (for future)
    plan: 'free',
    autoRenew: true
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

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    setSaved(false)
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // TODO: API call to save settings
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
      // TODO: API call to change password
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
        // TODO: API call to delete account
        alert('Account deletion would be processed here')
      }
    }
  }

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
            Account Settings
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your account security, privacy, and notification preferences
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Privacy Settings */}
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
              <Eye style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Privacy Settings
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Profile Visibility */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="public">Public - Anyone can view your profile</option>
                  <option value="unlisted">Unlisted - Only people with the link</option>
                  <option value="private">Private - Only you can view</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Show email address on public profile
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.showAnalytics}
                    onChange={(e) => handleSettingChange('privacy', 'showAnalytics', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Show view counts on projects
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.allowIndexing}
                    onChange={(e) => handleSettingChange('privacy', 'allowIndexing', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Allow search engines to index your profile
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
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
              <Bell style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Email Notifications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    Email notifications
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Receive notifications about your account activity
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    Weekly analytics reports
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Get weekly summaries of your profile performance
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => handleSettingChange('notifications', 'marketingEmails', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    Marketing emails
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Receive updates about new features and tips
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Security Settings */}
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
              <Shield style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Security
            </h2>

            {/* Change Password */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                Change Password
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
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
                      cursor: 'pointer'
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
                      padding: '12px 40px 12px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
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
                      cursor: 'pointer'
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
                      padding: '12px 40px 12px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
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
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    opacity: loading ? 0.7 : 1,
                    width: 'fit-content'
                  }}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>
                    Two-Factor Authentication
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: settings.twoFactorEnabled ? '#dcfce7' : '#fef3c7',
                  color: settings.twoFactorEnabled ? '#166534' : '#92400e',
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
                  backgroundColor: settings.twoFactorEnabled ? '#dc2626' : '#3b82f6',
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

          {/* Subscription Settings (Pro Feature Preview) */}
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
              <CreditCard style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Subscription
            </h2>

            <div style={{
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    Current Plan: Free
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Upgrade to Pro for unlimited projects and advanced features
                  </p>
                </div>
                <button
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                • 3 projects (3/3 used)<br />
                • Basic analytics<br />
                • DevStack branding
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
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
              <Download style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Data & Privacy
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}
              >
                Download Your Data
              </button>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '-8px' }}>
                Export all your profile data, projects, and analytics
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{
            backgroundColor: '#fef2f2',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #fecaca'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#dc2626',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <AlertTriangle style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Danger Zone
            </h2>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
                Delete Account
              </h3>
              <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '12px' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
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
                <SettingsIcon style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                Settings Saved!
              </>
            ) : (
              <>
                <SettingsIcon style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                Save Settings
              </>
            )}
          </button>
        </div>
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