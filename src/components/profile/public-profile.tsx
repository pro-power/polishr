// src/components/profile/public-profile.tsx
'use client'

import { useState } from 'react'
import { ExternalLink, Github, Twitter, Linkedin, Globe, Calendar, Star, Eye, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectCard } from './project-card'

interface PublicProject {
  id: string
  title: string
  description: string | null
  demoUrl: string | null
  repoUrl: string | null
  techStack: string[]
  category: string | null
  ctaType: string
  ctaUrl: string | null
  ctaText: string | null
  featured: boolean
  imageUrl: string | null
  clickCount: number
  createdAt: string
}

interface PublicProfileData {
  username: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  website: string | null
  twitterUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  themeColor: string
  memberSince: string
  projects: PublicProject[]
  totalProjects: number
  featuredProjects: number
}

interface PublicProfileProps {
  profile: PublicProfileData
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(profile.projects.map(p => p.category).filter(Boolean)))

  // Filter projects
  const filteredProjects = profile.projects.filter(project => {
    if (showFeaturedOnly && !project.featured) return false
    if (selectedCategory !== 'all' && project.category !== selectedCategory) return false
    return true
  })

  const handleProjectClick = async (projectId: string, clickType: string, url?: string) => {
    try {
      // Track the click
      await fetch(`/api/projects/${projectId}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clickType })
      })

      // Open URL if provided
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Failed to track click:', error)
      // Still open URL even if tracking fails
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const themeClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    pink: 'from-pink-500 to-rose-500',
    indigo: 'from-indigo-500 to-purple-500'
  }

  const gradientClass = themeClasses[profile.themeColor as keyof typeof themeClasses] || themeClasses.blue

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-br ${gradientClass} text-white`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Avatar */}
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white/20">
              <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName || profile.username} />
              <AvatarFallback className="text-2xl bg-white/10">
                {(profile.displayName || profile.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Name and Username */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              {profile.displayName || profile.username}
            </h1>
            {profile.displayName && (
              <p className="text-xl opacity-90 mb-4">@{profile.username}</p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Social Links */}
            <div className="flex justify-center gap-4 mb-8">
              {profile.website && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                  onClick={() => window.open(profile.website!, '_blank', 'noopener,noreferrer')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </Button>
              )}
              
              {profile.githubUrl && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                  onClick={() => window.open(profile.githubUrl!, '_blank', 'noopener,noreferrer')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              )}

              {profile.twitterUrl && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                  onClick={() => window.open(profile.twitterUrl!, '_blank', 'noopener,noreferrer')}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              )}

              {profile.linkedinUrl && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                  onClick={() => window.open(profile.linkedinUrl!, '_blank', 'noopener,noreferrer')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold">{profile.totalProjects}</div>
                <div className="text-sm opacity-75">Projects</div>
              </div>
              {profile.featuredProjects > 0 && (
                <div>
                  <div className="text-2xl font-bold">{profile.featuredProjects}</div>
                  <div className="text-sm opacity-75">Featured</div>
                </div>
              )}
              <div>
                <div className="text-2xl font-bold">
                  {new Date(profile.memberSince).getFullYear()}
                </div>
                <div className="text-sm opacity-75">Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Projects</h2>
              <p className="text-muted-foreground">
                {filteredProjects.length} of {profile.totalProjects} projects
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Featured Toggle */}
              {profile.featuredProjects > 0 && (
                <Button
                  variant={showFeaturedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Featured Only
                </Button>
              )}

              {/* Category Filter */}
              {categories.length > 1 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category!}>
                        {category!.charAt(0).toUpperCase() + category!.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectClick={handleProjectClick}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <div className="text-6xl mb-4">📂</div>
                  <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                  <p>
                    {showFeaturedOnly 
                      ? "No featured projects match your criteria."
                      : selectedCategory !== 'all'
                      ? "No projects found in this category."
                      : "This developer hasn't shared any public projects yet."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="flex items-center justify-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Member since {new Date(profile.memberSince).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
            <p className="mt-2 text-xs">
              Powered by <span className="font-semibold">DevStack Link</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}