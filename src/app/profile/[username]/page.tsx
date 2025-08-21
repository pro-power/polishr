// src/app/profile/[username]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicProfile } from '@/components/profile/public-profile'

interface PublicProfilePageProps {
  params: { username: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile/${params.username}`,
      { 
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      return {
        title: 'Profile Not Found | DevStack Link'
      }
    }

    const profile = await response.json()

    return {
      title: `${profile.displayName || profile.username} | DevStack Link`,
      description: profile.bio || `Check out ${profile.displayName || profile.username}'s developer portfolio on DevStack Link`,
      openGraph: {
        title: `${profile.displayName || profile.username} | DevStack Link`,
        description: profile.bio || `Check out ${profile.displayName || profile.username}'s developer portfolio`,
        type: 'profile',
        url: `${process.env.NEXTAUTH_URL}/profile/${params.username}`,
        images: profile.avatarUrl ? [
          {
            url: profile.avatarUrl,
            width: 400,
            height: 400,
            alt: `${profile.displayName || profile.username}'s avatar`
          }
        ] : []
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profile.displayName || profile.username} | DevStack Link`,
        description: profile.bio || `Check out ${profile.displayName || profile.username}'s developer portfolio`,
        images: profile.avatarUrl ? [profile.avatarUrl] : []
      },
      alternates: {
        canonical: `${process.env.NEXTAUTH_URL}/profile/${params.username}`
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return {
      title: 'DevStack Link'
    }
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile/${params.username}`,
      { 
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error('Failed to fetch profile')
    }

    const profile = await response.json()

    return <PublicProfile profile={profile} />
  } catch (error) {
    console.error('Profile page error:', error)
    notFound()
  }
}