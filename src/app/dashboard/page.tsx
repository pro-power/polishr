// src/app/dashboard/page.tsx
'use client'

import { useSession, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

  if (!session) {
    return null
  }

  const statCards = [
    {
      name: 'Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: '#7c3aed'
    },
    {
      name: 'Views',
      value: stats.totalViews,
      icon: Eye,
      color: '#10b981'
    },
    {
      name: 'Clicks',
      value: stats.totalClicks,
      icon: MousePointer,
      color: '#f59e0b'
    },
    {
      name: 'Captures',
      value: stats.totalEmailCaptures,
      icon: Mail,
      color: '#ef4444'
    }
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
        {/* Welcome Section - Compact */}
        <div style={{ 
          backgroundColor: '#1a1a2e',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #7c3aed'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            margin: '0 0 4px 0'
          }}>
            Welcome back, {session.user?.name || 'Developer'}! 👋
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
            Here's your portfolio overview
          </p>
        </div>

        {/* Stats Grid - Compact */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px'
        }}>
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                style={{
                  backgroundColor: '#1a1a2e',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #7c3aed',
                  textAlign: 'center'
                }}
              >
                <Icon style={{ 
                  height: '20px', 
                  width: '20px', 
                  color: stat.color,
                  margin: '0 auto 8px auto',
                  display: 'block'
                }} />
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  margin: '0 0 4px 0'
                }}>
                  {stat.value.toLocaleString()}
                </p>
                <p style={{ 
                  color: '#a1a1aa', 
                  fontSize: '12px',
                  margin: 0
                }}>
                  {stat.name}
                </p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 300px',
          gap: '16px',
          flex: 1,
          minHeight: 0 // Important for flex children
        }}>
          {/* Recent Activity */}
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TrendingUp style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Recent Activity
            </h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid rgba(124, 58, 237, 0.2)'
              }}>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>Profile views today</span>
                <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>12</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid rgba(124, 58, 237, 0.2)'
              }}>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>Project clicks</span>
                <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>5</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid rgba(124, 58, 237, 0.2)'
              }}>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>Email captures</span>
                <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>2</span>
              </div>
              <button
                onClick={() => router.push('/dashboard/analytics')}
                style={{
                  marginTop: 'auto',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                View Detailed Analytics →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #7c3aed',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => router.push('/dashboard/projects/new')}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#7c3aed',
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
                <Plus style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Add Project
              </button>
              <button
                onClick={() => router.push('/dashboard/profile')}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Settings style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Edit Profile
              </button>
              <button
                onClick={() => router.push('/dashboard/analytics')}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <BarChart3 style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Analytics
              </button>
              <button
                onClick={() => window.open(`/profile/${session.user?.username || 'user'}`, '_blank')}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ExternalLink style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                View Profile
              </button>
            </div>

            {/* Progress Section */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(124, 58, 237, 0.3)' }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                margin: '0 0 8px 0'
              }}>
                Profile Progress
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  )
}