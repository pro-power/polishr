// src/app/dashboard/projects/new/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProjectForm } from '@/components/projects/project-form'

export default function CreateProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
          minHeight: '400px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          {/* Back Button */}
          <div style={{ marginBottom: '16px' }}>
            <Link 
              href="/dashboard/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                width: 'fit-content',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <ArrowLeft style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Back to Projects
            </Link>
          </div>

          {/* Page Title */}
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '8px'
            }}>
              Create New Project
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              Add a new project to showcase in your developer portfolio
            </p>
          </div>
        </div>

        {/* Project Form */}
        <ProjectForm />

        {/* Help Section */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            💡 Project Tips
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <div>
              <h4 style={{ 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Writing Great Descriptions
              </h4>
              <ul style={{ 
                listStyle: 'disc', 
                paddingLeft: '20px',
                lineHeight: '1.6',
                margin: 0
              }}>
                <li style={{ marginBottom: '4px' }}>Explain what problem your project solves</li>
                <li style={{ marginBottom: '4px' }}>Mention key features and technologies</li>
                <li style={{ marginBottom: '4px' }}>Keep it concise but informative</li>
                <li>Use active voice and clear language</li>
              </ul>
            </div>
            <div>
              <h4 style={{ 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Project Status Guide
              </h4>
              <ul style={{ 
                listStyle: 'disc', 
                paddingLeft: '20px',
                lineHeight: '1.6',
                margin: 0
              }}>
                <li style={{ marginBottom: '4px' }}>
                  <strong>Draft:</strong> Work in progress, not visible publicly
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>Live:</strong> Completed and showcased on your profile
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>Coming Soon:</strong> Announced but not yet released
                </li>
                <li>
                  <strong>Archived:</strong> Completed but no longer featured
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}