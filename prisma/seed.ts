// prisma/seed.ts
import { PrismaClient, PlanType, CTAType, ProjectStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user with hashed password
  const hashedPassword = await bcrypt.hash('demo123456', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@devstack.link' },
    update: {},
    create: {
      email: 'demo@devstack.link',
      emailVerified: new Date(),
      passwordHash: hashedPassword,
      username: 'demo',
      displayName: 'Demo Developer',
      bio: 'Full-stack developer passionate about building amazing products. This is a demo profile showcasing DevStack Link.',
      website: 'https://github.com',
      githubUrl: 'https://github.com/demo',
      twitterUrl: 'https://twitter.com/demo',
      themeColor: 'purple',
      planType: PlanType.PRO,
    },
  })

  console.log('👤 Created demo user:', demoUser.email)

  // Create demo projects
  const projects = [
    {
      title: 'AI-Powered Task Manager',
      description: 'A smart task management app that uses AI to prioritize and organize your daily tasks. Built with Next.js, TypeScript, and OpenAI API.',
      demoUrl: 'https://taskmanager-demo.vercel.app',
      repoUrl: 'https://github.com/demo/ai-task-manager',
      techStack: ['Next.js', 'TypeScript', 'OpenAI', 'Tailwind CSS', 'Prisma'],
      category: 'web',
      ctaType: CTAType.DEMO,
      ctaText: 'Try Live Demo',
      status: ProjectStatus.LIVE,
      featured: true,
      position: 1,
    },
    {
      title: 'DevTools Chrome Extension',
      description: 'A powerful Chrome extension for developers that enhances the DevTools experience with custom themes and productivity features.',
      demoUrl: 'https://chrome.google.com/webstore',
      repoUrl: 'https://github.com/demo/devtools-extension',
      techStack: ['JavaScript', 'Chrome APIs', 'CSS', 'Webpack'],
      category: 'tool',
      ctaType: CTAType.GITHUB,
      ctaText: 'View Source',
      status: ProjectStatus.LIVE,
      featured: true,
      position: 2,
    },
    {
      title: 'Real-time Chat Platform',
      description: 'Modern chat application with real-time messaging, file sharing, and video calls. Currently in development with exciting features coming soon.',
      repoUrl: 'https://github.com/demo/chat-platform',
      techStack: ['React', 'Node.js', 'Socket.io', 'WebRTC', 'MongoDB'],
      category: 'web',
      ctaType: CTAType.WAITLIST,
      ctaText: 'Join Waitlist',
      status: ProjectStatus.COMING_SOON,
      featured: false,
      position: 3,
    },
    {
      title: 'Mobile Fitness Tracker',
      description: 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with beautiful data visualizations.',
      demoUrl: 'https://apps.apple.com/app/fitness-tracker',
      techStack: ['React Native', 'TypeScript', 'Firebase', 'D3.js'],
      category: 'mobile',
      ctaType: CTAType.DEMO,
      ctaText: 'Download App',
      status: ProjectStatus.LIVE,
      featured: false,
      position: 4,
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        userId: demoUser.id,
      },
    })
    console.log(`📱 Created project: ${project.title}`)
  }

  // Create some demo analytics data
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Create demo profile views
  for (let i = 0; i < 50; i++) {
    await prisma.profileView.create({
      data: {
        userId: demoUser.id,
        visitorId: `visitor_${i}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        referer: Math.random() > 0.5 ? 'https://twitter.com' : 'https://github.com',
        country: Math.random() > 0.5 ? 'US' : 'CA',
        device: Math.random() > 0.7 ? 'mobile' : 'desktop',
        browser: Math.random() > 0.5 ? 'Chrome' : 'Safari',
        createdAt: new Date(lastWeek.getTime() + Math.random() * (now.getTime() - lastWeek.getTime())),
      },
    })
  }

  // Create demo email captures
  const emails = [
    'john@example.com',
    'sarah@example.com',
    'alex@example.com',
    'emma@example.com',
    'mike@example.com',
  ]

  for (const email of emails) {
    await prisma.emailCapture.create({
      data: {
        email,
        userId: demoUser.id,
        source: 'profile',
        createdAt: new Date(yesterday.getTime() + Math.random() * (now.getTime() - yesterday.getTime())),
      },
    })
  }

  console.log('📊 Created demo analytics data')
  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })