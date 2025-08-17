// src/lib/validations/project.ts
import { z } from 'zod'
import { CTAType, ProjectStatus } from '@prisma/client'

// Project creation/update validation
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  demoUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  repoUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  techStack: z
    .array(z.string().min(1, 'Technology name cannot be empty'))
    .min(1, 'Please add at least one technology')
    .max(10, 'Maximum 10 technologies allowed'),
  category: z
    .string()
    .min(1, 'Please select a category')
    .optional()
    .nullable(),
  ctaType: z.nativeEnum(CTAType),
  ctaUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  ctaText: z
    .string()
    .max(50, 'CTA text must be less than 50 characters')
    .optional()
    .nullable(),
  status: z.nativeEnum(ProjectStatus),
  featured: z.boolean().default(false),
  isPublic: z.boolean().default(true),
})

// Project reorder validation
export const projectReorderSchema = z.object({
  projectIds: z.array(z.string().cuid('Invalid project ID')),
})

// Project query parameters
export const projectQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  featured: z.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
})

// Public project view (subset of full project)
export const publicProjectSchema = projectSchema.pick({
  title: true,
  description: true,
  demoUrl: true,
  repoUrl: true,
  techStack: true,
  category: true,
  ctaType: true,
  ctaUrl: true,
  ctaText: true,
}).extend({
  id: z.string(),
  clickCount: z.number(),
  viewCount: z.number(),
  imageUrl: z.string().nullable(),
  createdAt: z.date(),
})

// Type exports
export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectReorderInput = z.infer<typeof projectReorderSchema>
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>
export type PublicProject = z.infer<typeof publicProjectSchema>

// Project categories enum for UI
export const PROJECT_CATEGORIES = [
  { value: 'web', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'desktop', label: 'Desktop App' },
  { value: 'api', label: 'API/Backend' },
  { value: 'ai', label: 'AI/Machine Learning' },
  { value: 'tool', label: 'Developer Tool' },
  { value: 'library', label: 'Library/Package' },
  { value: 'game', label: 'Game' },
  { value: 'other', label: 'Other' },
] as const

// CTA type options for UI
export const CTA_TYPE_OPTIONS = [
  { value: CTAType.DEMO, label: 'Live Demo', description: 'Link to working demo' },
  { value: CTAType.GITHUB, label: 'View Code', description: 'GitHub repository' },
  { value: CTAType.WAITLIST, label: 'Join Waitlist', description: 'Email capture for upcoming project' },
  { value: CTAType.BUY, label: 'Purchase', description: 'Link to purchase/download' },
  { value: CTAType.CONTACT, label: 'Contact', description: 'Get in touch about project' },
  { value: CTAType.CUSTOM, label: 'Custom', description: 'Custom call-to-action' },
] as const

// Project status options for UI
export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.DRAFT, label: 'Draft', description: 'Hidden from public profile' },
  { value: ProjectStatus.LIVE, label: 'Live', description: 'Visible on public profile' },
  { value: ProjectStatus.COMING_SOON, label: 'Coming Soon', description: 'Show as upcoming project' },
  { value: ProjectStatus.ARCHIVED, label: 'Archived', description: 'Completed but no longer featured' },
] as const