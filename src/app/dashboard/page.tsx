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
  Users
} from 'lucide-react'

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalViews: 0,
    totalClicks: 0,
    totalEmailCaptures: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    // Fetch user stats
    if (session?.user?.id) {
      // TODO: Replace with actual API call
      setStats({
        totalProjects: 3,
        totalViews: 127,
        totalClicks: 48,
        totalEmailCaptures: 12
      })
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const statCards = [
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      name: 'Profile Views',
      value: stats.totalViews,
      icon: Eye,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      name: 'Project Clicks',
      value: stats.totalClicks,
      icon: MousePointer,
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    {
      name: 'Email Captures',
      value: stats.totalEmailCaptures,
      icon: Mail,
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    }
  ]

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Welcome back, {session.user?.name || 'Developer'}! 👋
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Here's what's happening with your developer portfolio today.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      {stat.name}
                    </p>
                    <p style={{ 
                      fontSize: '32px', 
                      fontWeight: 'bold', 
                      color: '#111827',
                      margin: 0
                    }}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon style={{ height: '24px', width: '24px', color: stat.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TrendingUp style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Recent Activity
            </h3>
            <div style={{ color: '#6b7280' }}>
              <p style={{ marginBottom: '12px' }}>📊 12 profile views today</p>
              <p style={{ marginBottom: '12px' }}>🖱️ 5 project clicks this week</p>
              <p style={{ marginBottom: '12px' }}>📧 2 new email captures</p>
              <p style={{ color: '#3b82f6', cursor: 'pointer' }}>
                View detailed analytics →
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Plus style={{ height: '20px', width: '20px', marginRight: '8px' }} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => router.push('/dashboard/projects/new')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                + Add New Project
              </button>
              <button
                onClick={() => router.push('/dashboard/profile')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push('/dashboard/analytics')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginTop: '32px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            🚀 Next Steps to Complete Your Profile
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: stats.totalProjects > 0 ? '#10b981' : '#d1d5db',
                marginRight: '12px'
              }} />
              <span style={{ color: '#374151' }}>Add your first project</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db',
                marginRight: '12px'
              }} />
              <span style={{ color: '#374151' }}>Customize your profile</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db',
                marginRight: '12px'
              }} />
              <span style={{ color: '#374151' }}>Share your profile link</span>
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