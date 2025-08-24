// src/app/dashboard/page.tsx
'use client'

import { useSession, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { toast } from 'sonner'
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
  ExternalLink,
  Loader2,
  RefreshCw
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

interface DashboardStats {
  totalProjects: number
  totalViews: number
  totalClicks: number
  totalEmailCaptures: number
  viewsThisMonth: number
  clicksThisMonth: number
  topProject?: {
    id: string
    title: string
    clickCount: number
    viewCount: number
  } | null
  recentActivity: Array<{
    type: string
    createdAt: string
    [key: string]: any
  }>
}

function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
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
    if (hasChecked.current) {
      return
    }

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
        hasChecked.current = true
        
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
            
            if (session.user && !session.user.onboardingCompleted) {
              console.log('ℹ️ Session shows onboarding incomplete, but API shows complete. This is normal and will sync naturally.')
            }
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
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

  }, [status])

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

  if (onboardingStatus === true || onboardingStatus === null) {
    return <>{children}</>
  }

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
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalViews: 0,
    totalClicks: 0,
    totalEmailCaptures: 0,
    viewsThisMonth: 0,
    clicksThisMonth: 0,
    topProject: null,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchDashboardStats()
    }
  }, [status, router])

  const fetchDashboardStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await fetch('/api/dashboard/stats', {
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics')
      }

      const data: DashboardStats = await response.json()
      setStats(data)

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError('Failed to load dashboard statistics')
      toast.error('Failed to load dashboard data', {
        description: 'Please try refreshing the page.'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleAddProjectHover = () => {
    // Add hover effect logic if needed
  }

  const handleAddProjectLeave = () => {
    // Remove hover effect logic if needed
  }

  const handleRefresh = () => {
    fetchDashboardStats(true)
  }

  if (status === 'loading' || (loading && stats.totalProjects === 0)) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <Loader2 style={{ width: '24px', height: '24px', color: '#ffffff' }} className="animate-spin" />
          <div style={{ color: '#ffffff', marginLeft: '12px' }}>Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  if (error && stats.totalProjects === 0) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ color: '#ef4444', fontSize: '16px' }}>Error loading dashboard</div>
          <button
            onClick={() => fetchDashboardStats()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate progress for getting started section
  const hasProjects = stats.totalProjects > 0
  const hasProfile = session.user?.displayName && session.user?.bio
  
  return (
    <DashboardLayout>
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        overflow: 'hidden'
      }}>
        {/* Header with Refresh Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: '0 0 4px 0'
            }}>
              Welcome back, {session.user?.name || session.user?.email}
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Here's what's happening with your portfolio
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#1a1a2e',
              color: '#a1a1aa',
              border: '1px solid #313244',
              borderRadius: '6px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            <RefreshCw 
              style={{ 
                width: '16px', 
                height: '16px',
                transform: refreshing ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease'
              }} 
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <FolderOpen style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px' }} />
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Projects</h3>
            </div>
            <p style={{ color: '#3b82f6', fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.totalProjects}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Total projects created
            </p>
          </div>

          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Eye style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px' }} />
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Views</h3>
            </div>
            <p style={{ color: '#10b981', fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.totalViews.toLocaleString()}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              {stats.viewsThisMonth > 0 && `+${stats.viewsThisMonth} this month`}
            </p>
          </div>

          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MousePointer style={{ width: '20px', height: '20px', color: '#f59e0b', marginRight: '8px' }} />
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Clicks</h3>
            </div>
            <p style={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.totalClicks.toLocaleString()}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              {stats.clicksThisMonth > 0 && `+${stats.clicksThisMonth} this month`}
            </p>
          </div>

          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #313244'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Mail style={{ width: '20px', height: '20px', color: '#8b5cf6', marginRight: '8px' }} />
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Leads</h3>
            </div>
            <p style={{ color: '#8b5cf6', fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
              {stats.totalEmailCaptures}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Email captures
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Project Performance */}
            {stats.topProject && (
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #313244'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <TrendingUp style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px' }} />
                  <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>Top Performing Project</h3>
                </div>
                <div style={{
                  backgroundColor: '#0f0f23',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #7c3aed'
                }}>
                  <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    {stats.topProject.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <p style={{ color: '#a1a1aa', fontSize: '12px', margin: '0 0 4px 0' }}>Total Clicks</p>
                      <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                        {stats.topProject.clickCount}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#a1a1aa', fontSize: '12px', margin: '0 0 4px 0' }}>Total Views</p>
                      <p style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                        {stats.topProject.viewCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentActivity.length > 0 && (
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #313244',
                flex: 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <BarChart3 style={{ width: '24px', height: '24px', color: '#3b82f6', marginRight: '12px' }} />
                  <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>Recent Activity</h3>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {stats.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#0f0f23',
                      borderRadius: '8px',
                      border: '1px solid #313244'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 4px 0' }}>
                          Profile viewed
                        </p>
                        <p style={{ color: '#a1a1aa', fontSize: '12px', margin: 0 }}>
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        +1 view
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Add Project */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #313244'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Plus style={{ width: '24px', height: '24px', color: '#3b82f6', marginRight: '12px' }} />
                <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>Add Project</h3>
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '16px' }}>
                Showcase your latest work to potential employers and clients.
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
                  transition: 'background-color 0.2s',
                  width: '100%'
                }}
              >
                Add Project
              </button>
            </div>

            {/* View Portfolio */}
            <div style={{
              backgroundColor: '#1a1a2e',
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
                onClick={() => {
                  if (session.user?.username) {
                    window.open(`/${session.user.username}`, '_blank')
                  } else {
                    toast.error('Please set up your username in profile settings first')
                  }
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  width: '100%'
                }}
              >
                View Portfolio
              </button>
            </div>

            {/* Getting Started Progress */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #313244'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Settings style={{ width: '24px', height: '24px', color: '#f59e0b', marginRight: '12px' }} />
                <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>Getting Started</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: hasProjects ? '#10b981' : '#6b7280',
                    marginRight: '8px'
                  }} />
                  <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    Add projects ({stats.totalProjects} added)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: hasProfile ? '#10b981' : '#6b7280',
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