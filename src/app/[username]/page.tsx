// src/app/[username]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUserPortfolioData } from '@/lib/data-access'
import { MinimalTemplate } from '@/lib/templates/minimal'
import { getTheme } from '@/lib/themes'
import { ProjectData, UserSkillData, UserExperienceData, PortfolioConfig } from '@/lib/templates/template-types'

interface PortfolioPageProps {
  params: Promise<{ username: string }>
}

// Helper function to convert database enum to template enum
function convertSkillLevel(dbLevel: string): "beginner" | "intermediate" | "advanced" | "expert" {
  switch (dbLevel) {
    case 'BEGINNER': return 'beginner'
    case 'INTERMEDIATE': return 'intermediate'  
    case 'ADVANCED': return 'advanced'
    case 'EXPERT': return 'expert'
    default: return 'intermediate'
  }
}

// Helper function to convert database experience type to template type
function convertExperienceType(dbType: string): "project" | "work" | "education" | "volunteer" {
  switch (dbType) {
    case 'WORK': return 'work'
    case 'EDUCATION': return 'education'
    case 'VOLUNTEER': return 'volunteer'
    case 'PROJECT': return 'project'
    default: return 'work'
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params
  const portfolioData = await getUserPortfolioData(username)
  
  if (!portfolioData) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.',
    }
  }

  const { user } = portfolioData
  const title = `${user.displayName || user.email} - ${user.jobTitle || 'Developer Portfolio'}`
  const description = user.bio || `${user.displayName || user.username}'s professional developer portfolio showcasing projects and skills.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/${username}`,
      siteName: 'DevStack Link',
      images: user.avatarUrl ? [{
        url: user.avatarUrl,
        width: 400,
        height: 400,
        alt: `${user.displayName}'s profile photo`,
      }] : [],
    },
    twitter: {
      card: 'summary',
      title: `${user.displayName || user.email} - ${user.jobTitle || 'Developer Portfolio'}`,
      description: user.bio || `${user.displayName}'s professional developer portfolio`,
      images: user.avatarUrl ? [user.avatarUrl] : [],
    },
    // Add JSON-LD structured data for better SEO
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: user.displayName || user.username,
        jobTitle: user.jobTitle,
        description: user.bio,
        url: `/${username}`,
        image: user.avatarUrl,
        sameAs: [
          user.website,
          user.githubUrl,
          user.linkedinUrl,
          user.twitterUrl
        ].filter(Boolean),
        address: user.location ? {
          '@type': 'Place',
          name: user.location
        } : undefined,
        knowsAbout: portfolioData.skills?.map(skill => skill.skillName) || [],
        worksFor: portfolioData.experience
          ?.filter(exp => exp.isCurrent && exp.type === 'WORK')
          ?.map(exp => ({
            '@type': 'Organization',
            name: exp.organization
          })) || []
      })
    }
  }
}

// Main portfolio page component
export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params
  const portfolioData = await getUserPortfolioData(username)
  
  if (!portfolioData) {
    notFound()
  }

  const { user, projects, skills, experience, config } = portfolioData
  
  // Get the theme configuration
  const theme = getTheme(config.themeId || 'ocean')

  // Convert database data to template-compatible types
  const templateProjects: ProjectData[] = projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    demoUrl: project.demoUrl,
    repoUrl: project.repoUrl,
    techStack: project.techStack,
    category: project.category,
    ctaType: project.ctaType,
    ctaUrl: project.ctaUrl,
    ctaText: project.ctaText,
    imageUrl: project.imageUrl,
    clickCount: project.clickCount,
    viewCount: project.viewCount,
    createdAt: project.createdAt,
    position: project.position,
    // Add missing required properties
    status: 'LIVE', // Default to LIVE for public projects
    featured: false // Default to false, you can modify this if you have featured data
  }))

  const templateSkills: UserSkillData[] = skills.map(skill => ({
    id: skill.id,
    skillName: skill.skillName,
    skillLevel: convertSkillLevel(skill.skillLevel),
    category: skill.category,
    position: skill.position
  }))

  const templateExperience: UserExperienceData[] = experience.map(exp => ({
    id: exp.id,
    type: convertExperienceType(exp.type),
    title: exp.title,
    organization: exp.organization,
    description: exp.description,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: exp.isCurrent,
    location: exp.location,
    position: exp.position
  }))

  // Convert config to template-compatible type
  const templateConfig: PortfolioConfig = {
    templateId: config.templateId || 'minimal',
    themeId: config.themeId || 'ocean',
    sectionOrder: Array.isArray(config.sectionOrder) 
      ? config.sectionOrder as string[]
      : ['about', 'projects', 'skills', 'experience'],
    sectionVisibility: (config.sectionVisibility as Record<string, boolean>) || {
      about: true,
      projects: true,
      skills: true,
      experience: true
    },
    customizations: (config as any).customizations || null
  }

  // Track portfolio view (implement this in a client component or server action later)
  // await trackPortfolioView(user.id, request)

  // For now, we only have the Minimal template
  // Later you can add a switch statement for different templates based on config.templateId
  return (
    <MinimalTemplate
      user={user}
      projects={templateProjects}
      skills={templateSkills}
      experience={templateExperience}
      theme={theme}
      config={templateConfig}
    />
  )
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  // This would be implemented with a more efficient query in production
  // For now, return empty array to use dynamic rendering
  return []
  
  // Commented out for now - uncomment when ready for static generation:
  /*
  try {
    const users = await db.user.findMany({
      where: {
        isPublic: true,
        onboardingCompleted: true,
        username: { not: null },
      },
      select: { username: true },
      take: 100, // Limit for build performance
    })

    return users
      .filter(user => user.username)
      .map(user => ({
        username: user.username!,
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
  */
}