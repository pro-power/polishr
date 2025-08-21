// src/components/profile/project-card.tsx
'use client'

import { useState } from 'react'
import { ExternalLink, Github, Star, Eye, Mail, ShoppingCart, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

interface ProjectCardProps {
  project: PublicProject
  onProjectClick: (projectId: string, clickType: string, url?: string) => void
}

export function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getCTAIcon = (ctaType: string) => {
    switch (ctaType) {
      case 'DEMO':
        return <ExternalLink className="h-4 w-4" />
      case 'GITHUB':
        return <Github className="h-4 w-4" />
      case 'WAITLIST':
        return <Mail className="h-4 w-4" />
      case 'BUY':
        return <ShoppingCart className="h-4 w-4" />
      case 'CONTACT':
        return <MessageCircle className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const getCTAText = (ctaType: string, customText?: string | null) => {
    if (customText) return customText
    
    switch (ctaType) {
      case 'DEMO':
        return 'View Demo'
      case 'GITHUB':
        return 'View Code'
      case 'WAITLIST':
        return 'Join Waitlist'
      case 'BUY':
        return 'Get It Now'
      case 'CONTACT':
        return 'Contact'
      default:
        return 'Learn More'
    }
  }

  const getCTAUrl = () => {
    if (project.ctaUrl) return project.ctaUrl
    
    switch (project.ctaType) {
      case 'DEMO':
        return project.demoUrl
      case 'GITHUB':
        return project.repoUrl
      default:
        return project.demoUrl || project.repoUrl
    }
  }

  const handleCTAClick = () => {
    const url = getCTAUrl()
    if (url) {
      onProjectClick(project.id, 'cta', url)
    }
  }

  const handleDemoClick = () => {
    if (project.demoUrl) {
      onProjectClick(project.id, 'demo', project.demoUrl)
    }
  }

  const handleRepoClick = () => {
    if (project.repoUrl) {
      onProjectClick(project.id, 'repo', project.repoUrl)
    }
  }

  const handleImageClick = () => {
    onProjectClick(project.id, 'image')
  }

  const handleTitleClick = () => {
    onProjectClick(project.id, 'title')
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Project Image */}
      <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
        {project.imageUrl && !imageError ? (
          <>
            <img
              src={project.imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-300 cursor-pointer
                ${imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              onClick={handleImageClick}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
          </>
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
          >
            <div className="text-6xl opacity-20">📱</div>
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-500 text-yellow-50">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        {project.category && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </Badge>
          </div>
        )}

        {/* View Count */}
        {project.clickCount > 0 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-black/50 text-white">
              <Eye className="h-3 w-3 mr-1" />
              {project.clickCount}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        {/* Project Title */}
        <h3 
          className="font-semibold text-lg leading-tight cursor-pointer hover:text-primary transition-colors"
          onClick={handleTitleClick}
        >
          {project.title}
        </h3>

        {/* Project Description */}
        {project.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="text-xs"
              >
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.techStack.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Primary CTA */}
          <Button
            className="flex-1"
            onClick={handleCTAClick}
            disabled={!getCTAUrl()}
          >
            {getCTAIcon(project.ctaType)}
            <span className="ml-2">{getCTAText(project.ctaType, project.ctaText)}</span>
          </Button>

          {/* Secondary Actions */}
          <div className="flex gap-1">
            {/* Demo Link */}
            {project.demoUrl && project.ctaType !== 'DEMO' && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDemoClick}
                title="View Demo"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}

            {/* Repo Link */}
            {project.repoUrl && project.ctaType !== 'GITHUB' && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleRepoClick}
                title="View Source Code"
              >
                <Github className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Project Date */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Created {new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short'
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}