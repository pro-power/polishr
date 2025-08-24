// src/app/dashboard/page.tsx
'use client'

import { useSession, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  Mail, 
  FolderOpen,
  Plus,
  TrendingUp,
  Users,
  Settings,
  ExternalLink
} from 'lucide-react'

interface UserStatusResponse {
  authenticated: boolean
  user?: {
    id: string
    email: string
    username: string
    displayName: string
    onboardingCompleted: boolean
    projectCount: number
    totalViews: number
    [key: string]: any
  } | null
}

function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() // FIXED: Removed update from destructuring
  const router = useRouter()
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)
  const [onboardingStatus, setOnboardingStatus] = useState<boolean | null>(null)
  const hasChecked = useRef(false)
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    // FIXED: Only run once per session establishment
    if (hasChecked.current) {
      return
    }

    // FIXED: Early return conditions
    if (status === 'loading') {
      return
    }

    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (!session?.user?.id) {
      return
    }

    const checkOnboardingStatus = async () => {
      try {
        console.log('🔍 Checking onboarding status for user:', session.user.id)
        hasChecked.current = true // FIXED: Mark as checked before API call
        
        const response = await fetch('/api/auth/status', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`)
        }

        const result: UserStatusResponse = await response.json()
        console.log('📊 Fresh user data from API:', result)
        
        if (!isMounted.current) {
          return
        }
        
        if (result.authenticated && result.user) {
          const isOnboardingCompleted = result.user.onboardingCompleted
          setOnboardingStatus(isOnboardingCompleted)
          
          if (!isOnboardingCompleted) {
            console.log('❌ Onboarding not completed, redirecting to onboarding')
            router.push('/onboarding')
            return
          } else {
            console.log('✅ Onboarding completed, user can access dashboard')
            
            // FIXED: Only log if session is out of sync, but DON'T update it
            if (session.user && !session.user.onboardingCompleted) {
              console.log('ℹ️ Session shows onboarding incomplete, but API shows complete. This is normal and will sync naturally.')
              // REMOVED: No session update call that was causing the loop
            }
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // On error, assume they can access dashboard if authenticated
        if (isMounted.current) {
          setOnboardingStatus(true)
        }
      } finally {
        if (isMounted.current) {
          setIsCheckingOnboarding(false)
        }
      }
    }

    checkOnboardingStatus()

  }, [status]) // FIXED: Only depend on status, not session

  // FIXED: Use our own onboardingStatus state instead of session
  if (status === 'unauthenticated') {
    return null
  }

  if (status === 'loading' || isCheckingOnboarding) {
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

  // FIXED: Show dashboard if onboarding check passed
  if (onboardingStatus === true || onboardingStatus === null) {
    return <>{children}</>
  }

  // If onboarding not completed, show loading while redirecting
  return (
    <DashboardLayout>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%'
      }}>
        <div style={{ color: '#ffffff' }}>Redirecting to onboarding...</div>
      </div>
    </DashboardLayout>
  )
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProjects: 3,
    totalViews: 127,
    totalClicks: 48,
    totalEmailCaptures: 12
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
          height: '100%'
        }}>
          <div style={{ color: '#ffffff' }}>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  const handleAddProjectHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#2563eb'
  }

  const handleAddProjectLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#3b82f6'
  }

  const handleViewPortfolioHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#059669'
  }

  const handleViewPortfolioLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#10b981'
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            Welcome back, {session?.user?.name || session?.user?.displayName || 'Developer'}!
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '16px' }}>
            Here's what's happening with your portfolio today.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Total Projects */}
          <div style={{
            backgroundColor: '#1e1e2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#3b82f6',
                padding: '8px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <FolderOpen style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Projects</h3>
            </div>
            <p style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {stats.totalProjects}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
              Total showcased projects
            </p>
          </div>

          {/* Total Views */}
          <div style={{
            backgroundColor: '#1e1e2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#10b981',
                padding: '8px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <Eye style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Profile Views</h3>
            </div>
            <p style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {stats.totalViews}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
              People who viewed your profile
            </p>
          </div>

          {/* Total Clicks */}
          <div style={{
            backgroundColor: '#1e1e2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#f59e0b',
                padding: '8px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <MousePointer style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Project Clicks</h3>
            </div>
            <p style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {stats.totalClicks}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
              Clicks on your project links
            </p>
          </div>

          {/* Email Captures */}
          <div style={{
            backgroundColor: '#1e1e2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#8b5cf6',
                padding: '8px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <Mail style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Email Captures</h3>
            </div>
            <p style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {stats.totalEmailCaptures}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
              Emails collected from projects
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Add New Project */}
          <div style={{
            backgroundColor: '#1e1e2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Plus style={{ width: '24px', height: '24px', color: '#3b82f6', marginRight: '12px' }} />
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>Add New Project</h3>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
              Showcase your latest work and attract more opportunities.
            </p>
            <button 
              onClick={() => router.push('/dashboard/projects/new')}
              onMouseEnter={handleAddProjectHover}
              onMouseLeave={handleAddProjectLeave}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Add Project
            </button>
          </div>

          {/* View Portfolio */}
          <div style={{
            backgroundColor: '#1e1e2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <ExternalLink style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px' }} />
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>View Your Portfolio</h3>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
              See how your portfolio looks to visitors and potential employers.
            </p>
            <button 
              onClick={() => window.open(`/${session?.user?.username || 'preview'}`, '_blank')}
              onMouseEnter={handleViewPortfolioHover}
              onMouseLeave={handleViewPortfolioLeave}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              View Portfolio
            </button>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div style={{
          backgroundColor: '#1e1e2e',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #313244'
        }}>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '20px', 
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            Getting Started
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                marginRight: '8px'
              }} />
              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Complete onboarding</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: stats.totalProjects > 0 ? '#10b981' : '#6b7280',
                marginRight: '8px'
              }} />
              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Add projects</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#6b7280',
                marginRight: '8px'
              }} />
              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Customize profile</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#6b7280',
                marginRight: '8px'
              }} />
              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Share profile</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <SessionProvider>
      <OnboardingCheck>
        <DashboardContent />
      </OnboardingCheck>
    </SessionProvider>
  )
}