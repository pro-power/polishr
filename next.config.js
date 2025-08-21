// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for production optimization
  experimental: {
    // Remove serverExternalPackages - not needed in Next.js 15
  },
  
  // Image optimization configuration
  images: {
    // PROD: Update domains for your production image storage
    domains: [
      'localhost', // Development
      // Add your MinIO/S3 domain for production
      // 'your-domain.com',
      // 'minio.your-domain.com',
      // 's3.amazonaws.com',
      // 'your-bucket.s3.amazonaws.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for security - PROD: Review and enhance for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Allow uploads directory to be served
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Rewrites for subdomain routing and API
  async rewrites() {
    return {
      beforeFiles: [
        // Handle subdomain routing for user profiles
        // Format: username.devstack.link -> /profile/username
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?<username>.*)\\.devstack\\.link',
            },
          ],
          destination: '/profile/:username',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<username>.*)\\.devstack\\.link',
            },
          ],
          destination: '/profile/:username/:path*',
        },
      ],
    }
  },

  // PROD: Enable standalone output for Docker deployment
  // output: 'standalone',

  // Webpack configuration for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Development-specific webpack config
      config.devtool = 'cheap-module-source-map'
    }

    // Handle sharp module for image processing
    if (isServer) {
      config.externals.push('sharp')
    }

    return config
  },

  // Static file serving configuration
  async redirects() {
    return [
      // Redirect common routes
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig