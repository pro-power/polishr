// src/components/dashboard/dashboard-layout.tsx
'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Code2,
  ExternalLink
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: 'block'
          }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-300px',
          width: '280px',
          height: '100vh',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          transition: 'left 0.3s ease',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="lg:relative lg:left-0"
      >
        {/* Sidebar header */}
        <div style={{ 
          padding: '24px 20px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Code2 style={{ height: '32px', width: '32px', color: '#3b82f6', marginRight: '12px' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              DevStack
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              padding: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            className="lg:hidden"
          >
            <X style={{ height: '20px', width: '20px' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  margin: '0 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: active ? '#3b82f6' : '#6b7280',
                  backgroundColor: active ? '#eff6ff' : 'transparent',
                  fontWeight: active ? '600' : '500',
                  transition: 'all 0.2s'
                }}
              >
                <Icon style={{ height: '20px', width: '20px', marginRight: '12px' }} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div style={{ 
          padding: '20px', 
          borderTop: '1px solid #e5e7eb' 
        }}>
          {session?.user && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px' 
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '12px'
                }}>
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                    {session.user.name || 'User'}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>
                    {session.user.email}
                  </div>
                </div>
              </div>
              
              {/* View Profile Link */}
              <Link
                href={`/${session.user.username || 'profile'}`}
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              >
                <ExternalLink style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                View Public Profile
              </Link>
            </div>
          )}
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <LogOut style={{ height: '20px', width: '20px', marginRight: '12px' }} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '0' }} className="lg:ml-80">
        {/* Top bar */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              padding: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            className="lg:hidden"
          >
            <Menu style={{ height: '24px', width: '24px' }} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: 0
            }}>
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick actions could go here */}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}