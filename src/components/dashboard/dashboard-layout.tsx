// src/components/dashboard/dashboard-layout.tsx
'use client'

import { ReactNode, useState, useEffect } from 'react'
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
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f23' }}>
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        style={{
          width: '280px',
          backgroundColor: '#1a1a2e',
          borderRight: '1px solid #7c3aed',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: isMobile ? 50 : 'auto',
          transform: isMobile ? `translateX(${sidebarOpen ? '0' : '-100%'})` : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Sidebar header */}
        <div style={{ 
          padding: '24px 20px', 
          borderBottom: '1px solid #7c3aed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Code2 style={{ height: '32px', width: '32px', color: '#7c3aed', marginRight: '12px' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
              DevStack
            </span>
          </Link>
          {/* Close button - only visible on mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            >
              <X style={{ height: '20px', width: '20px' }} />
            </button>
          )}
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
                onClick={() => isMobile && setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  margin: '0 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: active ? '#7c3aed' : '#a1a1aa',
                  backgroundColor: active ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                  fontWeight: active ? '600' : '500',
                  transition: 'all 0.2s ease',
                  border: active ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.05)'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#a1a1aa'
                  }
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
          borderTop: '1px solid #7c3aed' 
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
                  backgroundColor: '#7c3aed',
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
                  <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '14px' }}>
                    {session.user.name || 'User'}
                  </div>
                  <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    {session.user.email}
                  </div>
                </div>
              </div>
              
              {/* View Profile Link */}
              <Link
                href={`/profile/${session.user.username || 'user'}`}
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#7c3aed',
                  fontSize: '14px',
                  marginBottom: '8px',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'
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
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
            }}
          >
            <LogOut style={{ height: '20px', width: '20px', marginRight: '12px' }} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: isMobile ? '100%' : 'calc(100% - 280px)', // Calculate remaining width
        minHeight: '100vh',
        overflow: 'hidden' // Prevent scrolling
      }}>
        {/* Top bar */}
        <header style={{
          backgroundColor: '#1a1a2e',
          borderBottom: '1px solid #7c3aed',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Mobile menu button - only show on mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            >
              <Menu style={{ height: '24px', width: '24px' }} />
            </button>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: 0
            }}>
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick actions or user menu could go here */}
          </div>
        </header>

        {/* Page content */}
        <main style={{ 
          flex: 1, 
          padding: '16px', // Reduced padding
          backgroundColor: '#0f0f23',
          height: 'calc(100vh - 73px)', // Fixed height, no min-height
          overflow: 'auto' // Allow scrolling only in main content area
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}