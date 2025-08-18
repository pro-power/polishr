// src/app/dashboard/analytics/page.tsx
'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { BarChart3, TrendingUp, Users, MousePointer, Eye, Calendar, ArrowUp, ArrowDown } from 'lucide-react'

function AnalyticsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  // Mock analytics data
  const stats = [
    { name: 'Total Views', value: '2,847', change: '+12%', trending: 'up', icon: Eye, color: '#3b82f6' },
    { name: 'Unique Visitors', value: '1,923', change: '+8%', trending: 'up', icon: Users, color: '#10b981' },
    { name: 'Total Clicks', value: '456', change: '+24%', trending: 'up', icon: MousePointer, color: '#f59e0b' },
    { name: 'Conversion Rate', value: '16%', change: '-4%', trending: 'down', icon: TrendingUp, color: '#8b5cf6' },
  ]

  const recentActivity = [
    { project: 'TaskFlow App', event: 'Profile View', timestamp: '2 hours ago', value: '+1 view' },
    { project: 'AI Content Generator', event: 'Email Capture', timestamp: '4 hours ago', value: '+1 lead' },
    { project: 'TaskFlow App', event: 'Demo Click', timestamp: '6 hours ago', value: '+1 click' },
    { project: 'Mobile Finance Tracker', event: 'Profile View', timestamp: '8 hours ago', value: '+1 view' },
    { project: 'TaskFlow App', event: 'GitHub Click', timestamp: '1 day ago', value: '+1 click' },
  ]

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

        {/* Compact Stats Grid - 4 in a row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                style={{
                  backgroundColor: '#1a1a2e',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #7c3aed',
                  textAlign: 'center'
                }}
              >
                <Icon style={{ 
                  height: '16px', 
                  width: '16px', 
                  color: stat.color,
                  margin: '0 auto 8px auto',
                  display: 'block'
                }} />
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  margin: '0 0 4px 0'
                }}>
                  {stat.value}
                </h3>
                <p style={{ 
                  color: '#a1a1aa', 
                  fontSize: '12px',
                  margin: '0 0 4px 0'
                }}>
                  {stat.name}
                </p>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  {stat.trending === 'up' ? (
                    <ArrowUp style={{ height: '12px', width: '12px', color: '#10b981' }} />
                  ) : (
                    <ArrowDown style={{ height: '12px', width: '12px', color: '#ef4444' }} />
                  )}
                  <span style={{ 
                    color: stat.trending === 'up' ? '#10b981' : '#ef4444', 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Two-column layout: Activity feed + Quick actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}>
          {/* Recent Activity */}
          <div style={{
            backgroundColor: '#1a1a2e',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #7c3aed' }}>
              <h2 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                margin: 0
              }}>
                Recent Activity
              </h2>
            </div>
            <div style={{ overflow: 'auto', maxHeight: '400px' }}>
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < recentActivity.length - 1 ? '1px solid rgba(124, 58, 237, 0.2)' : 'none',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#ffffff',
                      marginBottom: '2px'
                    }}>
                      {activity.project}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#a1a1aa'
                    }}>
                      {activity.event}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#a1a1aa'
                  }}>
                    {activity.timestamp}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '500',
                    color: '#10b981'
                  }}>
                    {activity.value}
                  </div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Export Data */}
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
                Export Data
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Export CSV
                </button>
                <button
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Export PDF
                </button>
              </div>
            </div>

            {/* Quick Insights */}
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
                Quick Insights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Best performing project:</span>
                  <span style={{ color: '#ffffff' }}>TaskFlow App</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Peak traffic time:</span>
                  <span style={{ color: '#ffffff' }}>2-4 PM</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#a1a1aa',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Avg. session duration:</span>
                  <span style={{ color: '#ffffff' }}>2m 34s</span>
                </div>
              </div>
            </div>

            {/* Coming Soon Preview */}
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #7c3aed'
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