// src/app/dashboard/analytics/page.tsx
'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { toast } from 'sonner'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Eye, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Loader2,
  RefreshCw,
  Filter
} from 'lucide-react'

interface AnalyticsSummary {
  totalViews: number
  totalClicks: number
  totalEmailCaptures: number
  topReferer: string | null
  topCountry: string | null
  recentViews: Array<{
    id: string
    createdAt: string
    country?: string
    referer?: string
    device?: string
  }>
  recentClicks: Array<{
    id: string
    createdAt: string
    clickType: string
    project: {
      title: string
      id: string
    }
  }>
}

interface ProjectStats {
  totalProjects: number
  liveProjects: number
  draftProjects: number
  featuredProjects: number
  totalClicks: number
  totalViews: number
  totalEmailCaptures: number
  averageClicksPerProject: number
  mostClickedProject?: {
    id: string
    title: string
    clickCount: number
    viewCount: number
  } | null
  recentlyUpdated: Array<{
    id: string
    title: string
    updatedAt: string
    status: string
  }>
}

function AnalyticsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>({
    totalViews: 0,
    totalClicks: 0,
    totalEmailCaptures: 0,
    topReferer: null,
    topCountry: null,
    recentViews: [],
    recentClicks: []
  })
  
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    totalProjects: 0,
    liveProjects: 0,
    draftProjects: 0,
    featuredProjects: 0,
    totalClicks: 0,
    totalViews: 0,
    totalEmailCaptures: 0,
    averageClicksPerProject: 0,
    mostClickedProject: null,
    recentlyUpdated: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<number>(30) // days

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchAnalyticsData()
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalyticsData()
    }
  }, [timeRange, status])

  const fetchAnalyticsData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      // Fetch analytics summary and project stats in parallel
      const [summaryResponse, statsResponse] = await Promise.all([
        fetch(`/api/dashboard/analytics?days=${timeRange}&type=summary`),
        fetch(`/api/dashboard/analytics?type=detailed`)
      ])

      if (!summaryResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const [summaryData, statsData] = await Promise.all([
        summaryResponse.json(),
        statsResponse.json()
      ])

      setAnalyticsSummary(summaryData)
      setProjectStats(statsData)

    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data')
      toast.error('Failed to load analytics', {
        description: 'Please try refreshing the page.'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchAnalyticsData(true)
  }

  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Calculate percentage changes (mock for now since we don't have historical data)
  const getChangePercentage = (current: number, type: 'positive' | 'negative' | 'neutral' = 'positive') => {
    // This would normally compare with previous period
    const change = Math.floor(Math.random() * 30) - 10 // Random for demo
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
      display: `${change >= 0 ? '+' : ''}${change}%`
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <Loader2 style={{ width: '24px', height: '24px', color: '#ffffff' }} className="animate-spin" />
          <div style={{ color: '#ffffff', marginLeft: '12px' }}>Loading analytics...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  if (error) {
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
          <div style={{ color: '#ef4444', fontSize: '16px' }}>Error loading analytics</div>
          <button
            onClick={() => fetchAnalyticsData()}
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

  const stats = [
    { 
      name: 'Total Views', 
      value: analyticsSummary.totalViews.toLocaleString(), 
      change: getChangePercentage(analyticsSummary.totalViews), 
      icon: Eye, 
      color: '#3b82f6' 
    },
    { 
      name: 'Unique Visitors', 
      value: Math.round(analyticsSummary.totalViews * 0.7).toLocaleString(), // Estimate
      change: getChangePercentage(analyticsSummary.totalViews), 
      icon: Users, 
      color: '#10b981' 
    },
    { 
      name: 'Total Clicks', 
      value: analyticsSummary.totalClicks.toLocaleString(), 
      change: getChangePercentage(analyticsSummary.totalClicks), 
      icon: MousePointer, 
      color: '#f59e0b' 
    },
    { 
      name: 'Conversion Rate', 
      value: analyticsSummary.totalClicks > 0 
        ? `${Math.round((analyticsSummary.totalEmailCaptures / analyticsSummary.totalClicks) * 100)}%`
        : '0%',
      change: getChangePercentage(analyticsSummary.totalEmailCaptures, 'neutral'), 
      icon: TrendingUp, 
      color: '#8b5cf6' 
    },
  ]

  const recentActivity = [
    ...analyticsSummary.recentViews.slice(0, 3).map(view => ({
      event: 'Profile View',
      timestamp: formatActivityTime(view.createdAt),
      value: '+1 view',
      project: null,
      detail: view.country ? `from ${view.country}` : 'Unknown location'
    })),
    ...analyticsSummary.recentClicks.slice(0, 2).map(click => ({
      event: `${click.clickType} Click`,
      timestamp: formatActivityTime(click.createdAt),
      value: '+1 click',
      project: click.project.title,
      detail: click.project.title
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

  return (
    <DashboardLayout>
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden'
      }}>
        {/* Header with Time Range Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: '0 0 4px 0'
            }}>
              Analytics
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
              Track your profile performance and visitor engagement
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              style={{
                padding: '6px 12px',
                backgroundColor: '#1a1a2e',
                color: '#ffffff',
                border: '1px solid #313244',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
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
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} style={{
                backgroundColor: '#1a1a2e',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #313244'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Icon style={{ width: '18px', height: '18px', color: stat.color }} />
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontSize: '12px',
                    color: stat.change.isPositive ? '#10b981' : '#ef4444'
                  }}>
                    {stat.change.isPositive ? (
                      <ArrowUp style={{ width: '12px', height: '12px', marginRight: '2px' }} />
                    ) : (
                      <ArrowDown style={{ width: '12px', height: '12px', marginRight: '2px' }} />
                    )}
                    {stat.change.display}
                  </div>
                </div>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  margin: '0 0 4px 0' 
                }}>
                  {stat.value}
                </p>
                <p style={{ color: '#a1a1aa', fontSize: '12px', margin: 0 }}>
                  {stat.name}
                </p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '16px',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Left Column - Recent Activity */}
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #313244',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              Recent Activity
            </h3>
            <div style={{ 
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    backgroundColor: '#0f0f23',
                    borderRadius: '6px',
                    border: '1px solid #313244'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                        {activity.project ? `${activity.project} - ${activity.event}` : activity.event}
                      </span>
                      <span style={{ color: '#10b981', fontSize: '12px' }}>
                        {activity.value}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                        {activity.detail}
                      </span>
                      <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: '#a1a1aa'
                }}>
                  No recent activity
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Insights and Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Performing Project */}
            {projectStats.mostClickedProject && (
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #313244'
              }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>
                  Top Performing Project
                </h3>
                <div style={{
                  backgroundColor: '#0f0f23',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #7c3aed'
                }}>
                  <h4 style={{ 
                    color: '#ffffff', 
                    fontSize: '14px', 
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {projectStats.mostClickedProject.title}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#a1a1aa', fontSize: '11px', margin: 0 }}>Clicks</p>
                      <p style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                        {projectStats.mostClickedProject.clickCount}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#a1a1aa', fontSize: '11px', margin: 0 }}>Views</p>
                      <p style={{ color: '#3b82f6', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                        {projectStats.mostClickedProject.viewCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Insights */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #313244'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Quick Insights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Total Projects:</span>
                  <span style={{ color: '#ffffff' }}>{projectStats.totalProjects}</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Live Projects:</span>
                  <span style={{ color: '#ffffff' }}>{projectStats.liveProjects}</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Featured Projects:</span>
                  <span style={{ color: '#ffffff' }}>{projectStats.featuredProjects}</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Avg. clicks per project:</span>
                  <span style={{ color: '#ffffff' }}>{projectStats.averageClicksPerProject}</span>
                </div>
                {analyticsSummary.topCountry && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#a1a1aa',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Top country:</span>
                    <span style={{ color: '#ffffff' }}>{analyticsSummary.topCountry}</span>
                  </div>
                )}
                {analyticsSummary.topReferer && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#a1a1aa',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Top referer:</span>
                    <span style={{ color: '#ffffff' }}>{analyticsSummary.topReferer}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recently Updated Projects */}
            {projectStats.recentlyUpdated.length > 0 && (
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #313244'
              }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>
                  Recently Updated
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projectStats.recentlyUpdated.slice(0, 3).map((project, index) => (
                    <div key={project.id} style={{
                      padding: '8px',
                      backgroundColor: '#0f0f23',
                      borderRadius: '4px',
                      border: '1px solid #313244'
                    }}>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#ffffff',
                        marginBottom: '2px'
                      }}>
                        {project.title}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#a1a1aa'
                      }}>
                        {formatActivityTime(project.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coming Soon Preview */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #313244'
            }}>
              <div style={{ textAlign: 'center' }}>
                <BarChart3 style={{ 
                  height: '32px', 
                  width: '32px', 
                  color: '#7c3aed', 
                  margin: '0 auto 8px auto',
                  display: 'block'
                }} />
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Advanced Analytics
                </h3>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa', 
                  marginBottom: '12px'
                }}>
                  Detailed insights coming soon
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#a1a1aa'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#7c3aed'
                    }} />
                    Geographic data
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#7c3aed'
                    }} />
                    Conversion tracking
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#7c3aed'
                    }} />
                    Real-time data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AnalyticsPage() {
  return (
    <SessionProvider>
      <AnalyticsContent />
    </SessionProvider>
  )
}