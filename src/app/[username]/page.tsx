// src/app/[username]/page.tsx - Fixed for Next.js 15

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import { MinimalTemplate } from '@/lib/templates/minimal'
import { getTheme } from '@/lib/themes'
import { 
  UserPortfolioData, 
  ProjectData, 
  UserSkillData, 
  UserExperienceData,
  PortfolioConfig 
} from '@/lib/templates/template-types'

interface PortfolioPageProps {
  params: Promise<{ username: string }> // Changed: params is now a Promise
}

async function getUserPortfolioData(username: string) {
  const user = await db.user.findUnique({
    where: { 
      username,
      isPublic: true, // Only show public portfolios
      onboardingCompleted: true, // Only show completed portfolios
    },
    include: {
      projects: {
        where: { 
          isPublic: true,
          status: 'LIVE', // Only show live projects
        },
        orderBy: [
          { featured: 'desc' },
          { position: 'asc' },
          { createdAt: 'desc' },
        ],
      },
      skills: {
        orderBy: { position: 'asc' },
      },
      experience: {
        orderBy: [
          { isCurrent: 'desc' },
          { startDate: 'desc' },
        ],
      },
      portfolioConfig: true,
    },
  })

  if (!user) {
    return null
  }

  // Transform data for template
  const userPortfolioData: UserPortfolioData = {
    id: user.id,
    displayName: user.displayName,
    jobTitle: user.jobTitle,
    bio: user.bio,
    location: user.location,
    avatarUrl: user.avatarUrl,
    website: user.website,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    twitterUrl: user.twitterUrl,
    resumeUrl: user.resumeUrl,
    lookingForWork: user.lookingForWork,
    email: user.email,
  }

  const projectData: ProjectData[] = user.projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    demoUrl: project.demoUrl,
    repoUrl: project.repoUrl,
    imageUrl: project.imageUrl,
    techStack: project.techStack,
    category: project.category,
    status: project.status,
    featured: project.featured,
  }))

  const skillData: UserSkillData[] = user.skills.map(skill => ({
    id: skill.id,
    skillName: skill.skillName,
    skillLevel: skill.skillLevel.toLowerCase() as any,
    category: skill.category,
  }))

  const experienceData: UserExperienceData[] = user.experience.map(exp => ({
    id: exp.id,
    type: exp.type.toLowerCase() as any,
    title: exp.title,
    organization: exp.organization,
    description: exp.description,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: exp.isCurrent,
    location: exp.location,
  }))

  const portfolioConfig: PortfolioConfig = user.portfolioConfig ? {
    templateId: user.portfolioConfig.templateId,
    themeId: user.portfolioConfig.themeId,
    sectionOrder: (user.portfolioConfig.sectionOrder as string[]) || ['header', 'about', 'projects', 'skills', 'experience', 'contact'],
    sectionVisibility: (user.portfolioConfig.sectionVisibility as Record<string, boolean>) || {
      header: true,
      about: true,
      projects: true,
      skills: true,
      experience: true,
      contact: true,
    },
    customizations: (user.portfolioConfig.customizations as Record<string, any>) || {},
  } : {
    templateId: user.templateId,
    themeId: user.themeId,
    sectionOrder: ['header', 'about', 'projects', 'skills', 'experience', 'contact'],
    sectionVisibility: {
      header: true,
      about: true,
      projects: true,
      skills: true,
      experience: true,
      contact: true,
    },
    customizations: {},
  }

  return {
    user: userPortfolioData,
    projects: projectData,
    skills: skillData,
    experience: experienceData,
    config: portfolioConfig,
  }
}

// Fixed: Await params before use
export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params // Added: await params
  const portfolioData = await getUserPortfolioData(username)
  
  if (!portfolioData) {
    return {
      title: 'Portfolio Not Found',
    }
  }

  const { user } = portfolioData
  
  return {
    title: `${user.displayName || user.email} - ${user.jobTitle || 'Developer Portfolio'}`,
    description: user.bio || `${user.displayName}'s professional developer portfolio showcasing projects and skills.`,
    openGraph: {
      title: `${user.displayName || user.email} - ${user.jobTitle || 'Developer Portfolio'}`,
      description: user.bio || `${user.displayName}'s professional developer portfolio`,
      type: 'website',
      url: `https://devstack.link/${username}`,
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
  }
}

// Fixed: Await params before use
export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params // Added: await params
  const portfolioData = await getUserPortfolioData(username)
  
  if (!portfolioData) {
    notFound()
  }

  const { user, projects, skills, experience, config } = portfolioData
  const theme = getTheme(config.themeId)

  // Track portfolio view (you can implement this later)
  // await trackPortfolioView(user.id, request)

  // For now, we only have the Minimal template
  // Later you can add a switch statement for different templates
  return (
    <MinimalTemplate
      user={user}
      projects={projects}
      skills={skills}
      experience={experience}
      theme={theme}
      config={config}
    />
  )
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  // Get usernames of public portfolios for static generation
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
}