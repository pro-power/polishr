// prisma/seed.ts
import { PrismaClient, CTAType, ProjectStatus, PlanType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.projectClick.deleteMany()
  await prisma.profileView.deleteMany()
  await prisma.emailCapture.deleteMany()
  await prisma.passwordResetToken.deleteMany()
  await prisma.projectImage.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  console.log('👤 Creating demo users...')
  
  const demoPassword = await bcrypt.hash('demo123456', 12)
  const testPassword = await bcrypt.hash('test123456', 12)

  // Main demo user (verified)
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@devstack.link',
      username: 'demo',
      displayName: 'Demo Developer',
      bio: 'Full-stack developer passionate about building amazing web applications. This is a demo account showcasing DevStack Link features.',
      passwordHash: demoPassword,
      emailVerified: new Date(), // Pre-verified for demo
      website: 'https://demo.devstack.link',
      githubUrl: 'https://github.com/demo',
      twitterUrl: 'https://twitter.com/demo',
      linkedinUrl: 'https://linkedin.com/in/demo',
      themeColor: 'blue',
      isPublic: true,
      planType: PlanType.FREE,
      lastLoginAt: new Date(),
    },
  })

  // Test user (unverified - for testing email verification)
  const testUser = await prisma.user.create({
    data: {
      email: 'test@devstack.link',
      username: 'testuser',
      displayName: 'Test User',
      bio: 'Test account for email verification flow.',
      passwordHash: testPassword,
      emailVerified: null, // Unverified for testing
      emailVerificationToken: 'test-verification-token-123',
      isPublic: false,
      planType: PlanType.FREE,
    },
  })

  // Pro user (verified with more features)
  const proUser = await prisma.user.create({
    data: {
      email: 'pro@devstack.link',
      username: 'prodev',
      displayName: 'Pro Developer',
      bio: 'Senior full-stack developer with 10+ years of experience. Building scalable web applications and leading development teams.',
      passwordHash: demoPassword,
      emailVerified: new Date(),
      website: 'https://prodev.com',
      githubUrl: 'https://github.com/prodev',
      twitterUrl: 'https://twitter.com/prodev',
      linkedinUrl: 'https://linkedin.com/in/prodev',
      themeColor: 'purple',
      isPublic: true,
      planType: PlanType.PRO,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    },
  })

  console.log('📁 Creating demo projects...')

  // Demo projects for main user
  const demoProjects = [
    {
      title: 'TaskFlow - Project Management App',
      description: 'A comprehensive project management application built with Next.js, TypeScript, and Prisma. Features real-time collaboration, kanban boards, and team analytics.',
      demoUrl: 'https://taskflow-demo.vercel.app',
      repoUrl: 'https://github.com/demo/taskflow',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      category: 'web',
      ctaType: CTAType.DEMO,
      ctaUrl: 'https://taskflow-demo.vercel.app',
      ctaText: 'Try Live Demo',
      status: ProjectStatus.LIVE,
      featured: true,
      position: 0,
      isPublic: true,
    },
    {
      title: 'CodeShare - Developer Collaboration Platform',
      description: 'Real-time code sharing and collaboration platform for developers. Built with WebSockets, Monaco Editor, and Redis for session management.',
      demoUrl: 'https://codeshare-demo.com',
      repoUrl: 'https://github.com/demo/codeshare',
      techStack: ['React', 'Node.js', 'Socket.io', 'Redis', 'Monaco Editor'],
      category: 'tool',
      ctaType: CTAType.GITHUB,
      ctaUrl: 'https://github.com/demo/codeshare',
      ctaText: 'View Source Code',
      status: ProjectStatus.LIVE,
      featured: true,
      position: 1,
      isPublic: true,
    },
    {
      title: 'AI Content Generator',
      description: 'Machine learning powered content generation tool using OpenAI GPT-4. Features custom prompts, batch processing, and content optimization.',
      demoUrl: null,
      repoUrl: 'https://github.com/demo/ai-content-gen',
      techStack: ['Python', 'FastAPI', 'OpenAI API', 'PostgreSQL', 'React'],
      category: 'ai',
      ctaType: CTAType.WAITLIST,
      ctaUrl: 'mailto:demo@devstack.link?subject=AI Content Generator Beta',
      ctaText: 'Join Beta Waitlist',
      status: ProjectStatus.COMING_SOON,
      featured: false,
      position: 2,
      isPublic: true,
    },
    {
      title: 'Mobile Finance Tracker',
      description: 'React Native app for personal finance tracking with bank integration, expense categorization, and budget planning.',
      demoUrl: null,
      repoUrl: 'https://github.com/demo/finance-tracker',
      techStack: ['React Native', 'Expo', 'Firebase', 'Plaid API'],
      category: 'mobile',
      ctaType: CTAType.GITHUB,
      ctaUrl: 'https://github.com/demo/finance-tracker',
      ctaText: 'View on GitHub',
      status: ProjectStatus.ARCHIVED,
      featured: false,
      position: 3,
      isPublic: true,
    },
    {
      title: 'Draft Project - E-learning Platform',
      description: 'Work in progress: Building a comprehensive e-learning platform with video streaming, interactive quizzes, and progress tracking.',
      demoUrl: null,
      repoUrl: null,
      techStack: ['Next.js', 'Prisma', 'Stripe', 'AWS S3'],
      category: 'web',
      ctaType: CTAType.CUSTOM,
      ctaUrl: null,
      ctaText: 'Coming Soon',
      status: ProjectStatus.DRAFT,
      featured: false,
      position: 4,
      isPublic: false,
    },
  ]

  for (const projectData of demoProjects) {
    await prisma.project.create({
      data: {
        ...projectData,
        userId: demoUser.id,
        clickCount: Math.floor(Math.random() * 500) + 50,
        viewCount: Math.floor(Math.random() * 1000) + 100,
      },
    })
  }

  // Pro user projects
  const proProjects = [
    {
      title: 'Enterprise Analytics Dashboard',
      description: 'High-performance analytics dashboard for enterprise clients with real-time data visualization and custom reporting.',
      demoUrl: 'https://analytics-pro.com',
      repoUrl: null, // Private repo
      techStack: ['React', 'D3.js', 'Node.js', 'ClickHouse', 'Redis'],
      category: 'web',
      ctaType: CTAType.CONTACT,
      ctaUrl: 'mailto:pro@devstack.link',
      ctaText: 'Contact for Demo',
      status: ProjectStatus.LIVE,
      featured: true,
      position: 0,
      isPublic: true,
    },
    {
      title: 'DevOps Automation Suite',
      description: 'Complete DevOps automation platform with CI/CD pipelines, infrastructure as code, and monitoring.',
      demoUrl: null,
      repoUrl: 'https://github.com/prodev/devops-suite',
      techStack: ['Go', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana'],
      category: 'tool',
      ctaType: CTAType.BUY,
      ctaUrl: 'https://devops-suite.com/pricing',
      ctaText: 'View Pricing',
      status: ProjectStatus.LIVE,
      featured: true,
      position: 1,
      isPublic: true,
    },
  ]

  for (const projectData of proProjects) {
    await prisma.project.create({
      data: {
        ...projectData,
        userId: proUser.id,
        clickCount: Math.floor(Math.random() * 1000) + 200,
        viewCount: Math.floor(Math.random() * 2000) + 500,
      },
    })
  }

  console.log('📊 Creating analytics data...')

  // Create some sample profile views
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan']
  const devices = ['desktop', 'mobile', 'tablet']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']

  // Generate profile views for demo user
  for (let i = 0; i < 50; i++) {
    const randomDate = new Date(oneWeekAgo.getTime() + Math.random() * (Date.now() - oneWeekAgo.getTime()))
    
    await prisma.profileView.create({
      data: {
        userId: demoUser.id,
        visitorId: `visitor_${i}_${Math.random().toString(36).substr(2, 9)}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        createdAt: randomDate,
      },
    })
  }

  // Create some email captures
  const sampleEmails = [
    'john@example.com',
    'sarah@company.com',
    'mike@startup.io',
    'lisa@agency.co',
    'alex@freelance.dev',
  ]

  for (const email of sampleEmails) {
    await prisma.emailCapture.create({
      data: {
        email,
        userId: demoUser.id,
        source: 'profile',
        metadata: {
          referrer: 'https://twitter.com',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
    })
  }

  console.log('🔒 Creating password reset token (for testing)...')

  // Create a test password reset token for the test user
  await prisma.passwordResetToken.create({
    data: {
      userId: testUser.id,
      token: 'test-reset-token-123',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      used: false,
    },
  })

  console.log('📈 Creating daily analytics...')

  // Create daily analytics for the past week
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    await prisma.dailyAnalytics.create({
      data: {
        date,
        totalViews: Math.floor(Math.random() * 100) + 20,
        totalClicks: Math.floor(Math.random() * 50) + 10,
        uniqueVisitors: Math.floor(Math.random() * 80) + 15,
        newSignups: Math.floor(Math.random() * 5),
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('🎉 Demo accounts created:')
  console.log('   📧 demo@devstack.link (password: demo123456) - Verified user with projects')
  console.log('   📧 test@devstack.link (password: test123456) - Unverified user for testing')
  console.log('   📧 pro@devstack.link (password: demo123456) - Pro user with advanced features')
  console.log('')
  console.log('🔧 Test tokens created:')
  console.log('   📧 Email verification: test-verification-token-123')
  console.log('   🔑 Password reset: test-reset-token-123')
  console.log('')
  console.log('📊 Sample data includes:')
  console.log('   • 5 demo projects with different statuses')
  console.log('   • 50+ profile views with analytics')
  console.log('   • Email captures from visitors')
  console.log('   • Daily analytics for the past week')
  console.log('')
  console.log('🌐 Ready to test:')
  console.log('   • Email verification flow')
  console.log('   • Password reset flow')
  console.log('   • Project management')
  console.log('   • Public profile views')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })