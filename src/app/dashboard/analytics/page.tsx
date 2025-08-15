// src/app/dashboard/analytics/page.tsx
'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { BarChart3, TrendingUp, Users, MousePointer, Eye, Calendar } from 'lucide-react'

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
    { name: 'Total Views', value: '2,847', change: '+12%', icon: Eye, color: '#3b82f6' },
    { name: 'Unique Visitors', value: '1,923', change: '+8%', icon: Users, color: '#10b981' },
    { name: 'Total Clicks', value: '456', change: '+24%', icon: MousePointer, color: '#f59e0b' },
    { name: 'Conversion Rate', value: '16%', change: '+4%', icon: TrendingUp, color: '#8b5cf6' },
  ]

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '8px'
          }}>
            Analytics
          </h1>
          <p style={{ color: '#6b7280' }}>
            Track your profile performance and visitor engagement
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((stat) => {
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon style={{ height: '24px', width: '24px', color: stat.color }} />
                  </div>
                  <span style={{ 
                    color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {stat.change}
                  </span>
                </div>
                <h3 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {stat.name}
                </p>
              </div>
            )
          })}
        </div>

        {/* Coming Soon Message */}
        <div style={{
          backgroundColor: 'white',
          padding: '60px 40px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <BarChart3 style={{ height: '64px', width: '64px', color: '#6b7280', margin: '0 auto' }} />
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '12px'
          }}>
            Advanced Analytics Coming Soon
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto 24px' }}>
            We're building detailed analytics including visitor insights, top-performing projects, 
            geographic data, and conversion tracking. Stay tuned!
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                📊 Visitor Insights
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Detailed visitor demographics and behavior
              </p>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                🗺️ Geographic Data
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                See where your visitors are coming from
              </p>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                📈 Conversion Tracking
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Track email captures and project engagement
              </p>
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