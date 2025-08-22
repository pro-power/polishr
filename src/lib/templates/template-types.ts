// src/lib/templates/template-types.ts

export interface PortfolioTemplate {
  id: string
  name: string
  description: string
  category: 'minimal' | 'creative' | 'professional' | 'developer' | 'showcase'
  preview: string // Screenshot URL
  features: string[]
  sections: PortfolioSection[]
  isPro: boolean
  component: React.ComponentType<TemplateProps>
}

export interface TemplateProps {
  user: UserPortfolioData
  projects: ProjectData[]
  skills: UserSkillData[]
  experience: UserExperienceData[]
  theme: ColorTheme
  config: PortfolioConfig
}

export interface PortfolioSection {
  id: string
  name: string
  title: string
  description: string
  required: boolean
  order: number
}

export interface ColorTheme {
  id: string
  name: string
  description: string
  palette: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    surfaceVariant: string
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
    border: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  borderRadius: string
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

export interface UserPortfolioData {
  id: string
  displayName: string | null
  jobTitle: string | null
  bio: string | null
  location: string | null
  avatarUrl: string | null
  website: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  resumeUrl: string | null
  lookingForWork: boolean
  email: string // For contact
}

export interface ProjectData {
  id: string
  title: string
  description: string | null
  demoUrl: string | null
  repoUrl: string | null
  imageUrl: string | null
  techStack: string[]
  category: string | null
  status: string
  featured: boolean
}

export interface UserSkillData {
  id: string
  skillName: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string | null
}

export interface UserExperienceData {
  id: string
  type: 'work' | 'education' | 'project' | 'volunteer'
  title: string
  organization: string
  description: string | null
  startDate: Date | null
  endDate: Date | null
  isCurrent: boolean
  location: string | null
}

export interface PortfolioConfig {
  templateId: string
  themeId: string
  sectionOrder: string[]
  sectionVisibility: Record<string, boolean>
  customizations: Record<string, any>
}

export interface OnboardingData {
  step: number
  basicInfo: {
    displayName: string
    jobTitle: string
    bio: string
    location: string
  }
  socialLinks: {
    website: string
    githubUrl: string
    linkedinUrl: string
    twitterUrl: string
    resumeUrl: string
  }
  selectedTemplate: string
  selectedTheme: string
  lookingForWork: boolean
}

// Default portfolio sections
export const DEFAULT_PORTFOLIO_SECTIONS: PortfolioSection[] = [
  {
    id: 'header',
    name: 'header',
    title: 'Header',
    description: 'Photo, name, title, and contact info',
    required: true,
    order: 0
  },
  {
    id: 'about',
    name: 'about',
    title: 'About/Summary',
    description: 'Professional bio and career summary',
    required: true,
    order: 1
  },
  {
    id: 'projects',
    name: 'projects',
    title: 'Projects',
    description: 'Showcase of your best work',
    required: true,
    order: 2
  },
  {
    id: 'skills',
    name: 'skills',
    title: 'Skills',
    description: 'Technical and soft skills',
    required: false,
    order: 3
  },
  {
    id: 'experience',
    name: 'experience',
    title: 'Experience',
    description: 'Work history and education',
    required: false,
    order: 4
  },
  {
    id: 'contact',
    name: 'contact',
    title: 'Contact',
    description: 'Get in touch section',
    required: false,
    order: 5
  }
]