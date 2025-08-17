// src/app/preview/[username]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Globe, 
  Github, 
  Twitter, 
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  ExternalLink,
  Mail,
  MapPin
} from 'lucide-react'

// Template configurations
const TEMPLATES = {
  professional: {
    name: 'Professional',
    colors: { primary: '#2563eb', bg: '#ffffff', text: '#111827', secondary: '#f8fafc' },
    fonts: { heading: 'font-semibold', body: 'font-normal', size: 'text-base' }
  },
  creative: {
    name: 'Creative',
    colors: { primary: '#7c3aed', bg: '#faf5ff', text: '#1f2937', secondary: '#f3e8ff' },
    fonts: { heading: 'font-bold', body: 'font-medium', size: 'text-lg' }
  },
  minimal: {
    name: 'Minimal',
    colors: { primary: '#059669', bg: '#f9fafb', text: '#374151', secondary: '#f0fdf4' },
    fonts: { heading: 'font-medium', body: 'font-light', size: 'text-sm' }
  }
}

const SOCIAL_ICONS: Record<string, any> = {
  website: Globe,
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  discord: MessageCircle,
  dribbble: Globe,
  behance: Globe,
  tiktok: Globe
}

interface ProfileData {
  displayName: string
  username: string
  bio: string
  selectedTemplate: keyof typeof TEMPLATES
  selectedSocials: Set<string>
  socialLinks: Record<string, string>
}

interface Project {
  id: string
  title: string
  description: string
  demoUrl?: string
  repoUrl?: string
  imageUrl?: string
  techStack: string[]
}

export default function PreviewPage() {
  const params = useParams()
  const username = params?.username as string
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'Loading...',
    username: username || 'preview',
    bio: '',
    selectedTemplate: 'professional',
    selectedSocials: new Set(['website', 'github']),
    socialLinks: {}
  })

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Sample Project',
      description: 'This is a sample project to show how your portfolio will look.',
      demoUrl: 'https://example.com',
      repoUrl: 'https://github.com/example',
      techStack: ['React', 'TypeScript', 'Tailwind CSS']
    }
  ])

  // Listen for updates from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PROFILE_UPDATE') {
        setProfileData(event.data.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Load initial data or use defaults
  useEffect(() => {
    // TODO: Load actual user data and projects
    // For now, using sample data
    setProfileData({
      displayName: 'John Developer',
      username: username || 'preview',
      bio: 'Full-stack developer passionate about building amazing web applications. I love React, Node.js, and everything in between.',
      selectedTemplate: 'professional',
      selectedSocials: new Set(['website', 'github', 'twitter', 'linkedin']),
      socialLinks: {
        website: 'https://johndeveloper.com',
        github: 'https://github.com/johndeveloper',
        twitter: 'https://twitter.com/johndeveloper',
        linkedin: 'https://linkedin.com/in/johndeveloper'
      }
    })
  }, [username])

  const template = TEMPLATES[profileData.selectedTemplate]

  const renderTemplate = () => {
    switch (profileData.selectedTemplate) {
      case 'creative':
        return <CreativeTemplate />
      case 'minimal':
        return <MinimalTemplate />
      default:
        return <ProfessionalTemplate />
    }
  }

  function ProfessionalTemplate() {
    return (
      <div 
        className="min-h-screen py-12 px-4"
        style={{ backgroundColor: template.colors.bg }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div 
              className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
              style={{ backgroundColor: template.colors.primary }}
            >
              {profileData.displayName.charAt(0)}
            </div>
            <h1 
              className={`text-4xl ${template.fonts.heading} mb-2`}
              style={{ color: template.colors.text }}
            >
              {profileData.displayName}
            </h1>
            <p className="text-gray-500 text-lg mb-4">@{profileData.username}</p>
            <p 
              className={`text-lg ${template.fonts.body} max-w-2xl mx-auto leading-relaxed`}
              style={{ color: template.colors.text }}
            >
              {profileData.bio}
            </p>
          </div>

          {/* Social Links */}
          {Array.from(profileData.selectedSocials).length > 0 && (
            <div className="flex justify-center space-x-6 mb-12">
              {Array.from(profileData.selectedSocials).map(platformId => {
                const link = profileData.socialLinks[platformId]
                if (!link) return null
                
                const Icon = SOCIAL_ICONS[platformId] || Globe
                return (
                  <a
                    key={platformId}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:shadow-md transition-all"
                    style={{ 
                      borderColor: template.colors.primary + '40',
                      color: template.colors.primary 
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="capitalize font-medium">{platformId}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          )}

          {/* Projects */}
          <div className="mb-12">
            <h2 
              className={`text-2xl ${template.fonts.heading} text-center mb-8`}
              style={{ color: template.colors.text }}
            >
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400">Project Screenshot</div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-lg ${template.fonts.heading} mb-2`} style={{ color: template.colors.text }}>
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map(tech => (
                        <span 
                          key={tech}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: template.colors.primary + '20',
                            color: template.colors.primary 
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          className="flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium text-white"
                          style={{ backgroundColor: template.colors.primary }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Demo</span>
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          className="flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium border"
                          style={{ 
                            borderColor: template.colors.primary,
                            color: template.colors.primary 
                          }}
                        >
                          <Github className="h-4 w-4" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div 
            className="text-center p-8 rounded-lg"
            style={{ backgroundColor: template.colors.secondary }}
          >
            <h2 
              className={`text-2xl ${template.fonts.heading} mb-4`}
              style={{ color: template.colors.text }}
            >
              Let's Work Together
            </h2>
            <p className="text-gray-600 mb-6">
              Interested in collaborating? I'd love to hear from you.
            </p>
            <button 
              className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: template.colors.primary }}
            >
              <Mail className="h-5 w-5 inline mr-2" />
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    )
  }

  function CreativeTemplate() {
    return (
      <div 
        className="min-h-screen py-8 px-4"
        style={{ 
          backgroundColor: template.colors.bg,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%)'
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Artistic Header */}
          <div className="text-center mb-16 relative">
            <div className="relative inline-block">
              <div 
                className="w-40 h-40 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-5xl font-bold shadow-2xl transform rotate-3"
                style={{ backgroundColor: template.colors.primary }}
              >
                {profileData.displayName.charAt(0)}
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-pink-400 rounded-full animate-bounce"></div>
            </div>
            <h1 
              className={`text-5xl ${template.fonts.heading} mb-3 transform -rotate-1`}
              style={{ color: template.colors.text }}
            >
              {profileData.displayName}
            </h1>
            <p className="text-purple-600 text-xl mb-6 font-medium">@{profileData.username}</p>
            <div className="max-w-3xl mx-auto">
              <p 
                className={`text-xl ${template.fonts.body} leading-relaxed`}
                style={{ color: template.colors.text }}
              >
                {profileData.bio}
              </p>
            </div>
          </div>

          {/* Creative Social Links */}
          {Array.from(profileData.selectedSocials).length > 0 && (
            <div className="flex justify-center flex-wrap gap-4 mb-16">
              {Array.from(profileData.selectedSocials).map((platformId, index) => {
                const link = profileData.socialLinks[platformId]
                if (!link) return null
                
                const Icon = SOCIAL_ICONS[platformId] || Globe
                const rotations = ['rotate-2', '-rotate-1', 'rotate-1', '-rotate-2']
                return (
                  <a
                    key={platformId}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${rotations[index % rotations.length]}`}
                    style={{ 
                      backgroundColor: 'white',
                      color: template.colors.primary,
                      border: `2px solid ${template.colors.primary}40`
                    }}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="capitalize font-bold">{platformId}</span>
                  </a>
                )
              })}
            </div>
          )}

          {/* Projects with Creative Layout */}
          <div className="mb-16">
            <h2 
              className={`text-4xl ${template.fonts.heading} text-center mb-12 transform -rotate-1`}
              style={{ color: template.colors.text }}
            >
              🎨 My Creations
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                >
                  <div className="h-56 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <div className="text-white text-2xl font-bold">✨ {project.title}</div>
                  </div>
                  <div className="p-8">
                    <h3 className={`text-2xl ${template.fonts.heading} mb-3`} style={{ color: template.colors.text }}>
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.techStack.map(tech => (
                        <span 
                          key={tech}
                          className="px-4 py-2 rounded-full text-sm font-bold transform rotate-1"
                          style={{ 
                            backgroundColor: template.colors.primary + '30',
                            color: template.colors.primary 
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl transition-all"
                          style={{ backgroundColor: template.colors.primary }}
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>See Live</span>
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold border-2 hover:shadow-lg transition-all"
                          style={{ 
                            borderColor: template.colors.primary,
                            color: template.colors.primary 
                          }}
                        >
                          <Github className="h-5 w-5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Contact */}
          <div className="text-center">
            <div 
              className="inline-block p-12 rounded-3xl shadow-2xl transform rotate-1"
              style={{ backgroundColor: 'white' }}
            >
              <h2 
                className={`text-3xl ${template.fonts.heading} mb-6`}
                style={{ color: template.colors.text }}
              >
                🚀 Ready to Create Something Amazing?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Let's turn your ideas into reality!
              </p>
              <button 
                className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ backgroundColor: template.colors.primary }}
              >
                <Mail className="h-6 w-6 inline mr-3" />
                Let's Collaborate!
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function MinimalTemplate() {
    return (
      <div 
        className="min-h-screen py-16 px-4"
        style={{ backgroundColor: template.colors.bg }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Minimal Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-6 mb-8">
              <div 
                className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-2xl font-medium"
                style={{ backgroundColor: template.colors.primary }}
              >
                {profileData.displayName.charAt(0)}
              </div>
              <div>
                <h1 
                  className={`text-3xl ${template.fonts.heading}`}
                  style={{ color: template.colors.text }}
                >
                  {profileData.displayName}
                </h1>
                <p className="text-gray-500">@{profileData.username}</p>
              </div>
            </div>
            <p 
              className={`text-lg ${template.fonts.body} leading-relaxed`}
              style={{ color: template.colors.text }}
            >
              {profileData.bio}
            </p>
          </div>

          {/* Minimal Social Links */}
          {Array.from(profileData.selectedSocials).length > 0 && (
            <div className="mb-20">
              <h2 
                className={`text-lg ${template.fonts.heading} mb-6`}
                style={{ color: template.colors.text }}
              >
                Connect
              </h2>
              <div className="space-y-3">
                {Array.from(profileData.selectedSocials).map(platformId => {
                  const link = profileData.socialLinks[platformId]
                  if (!link) return null
                  
                  const Icon = SOCIAL_ICONS[platformId] || Globe
                  return (
                    <a
                      key={platformId}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="capitalize">{platformId}</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Minimal Projects */}
          <div className="mb-20">
            <h2 
              className={`text-lg ${template.fonts.heading} mb-8`}
              style={{ color: template.colors.text }}
            >
              Work
            </h2>
            <div className="space-y-12">
              {projects.map(project => (
                <div key={project.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl ${template.fonts.heading}`} style={{ color: template.colors.text }}>
                      {project.title}
                    </h3>
                    <div className="flex space-x-2">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span 
                        key={tech}
                        className="text-sm"
                        style={{ color: template.colors.primary }}
                      >
                        {tech}
                      </span>
                    )).reduce((prev, curr, i) => [prev, <span key={i} className="text-gray-400">•</span>, curr] as any)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Contact */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Interested in working together?</p>
            <button 
              className={`${template.fonts.heading} underline hover:no-underline transition-all`}
              style={{ color: template.colors.primary }}
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white px-4 py-2 text-sm flex justify-between items-center">
        <span>🔄 Live Preview - Updates automatically as you edit</span>
        <span className="text-gray-400">Template: {template.name}</span>
      </div>
      
      {renderTemplate()}
    </div>
  )
}