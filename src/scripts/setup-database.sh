#!/bin/bash
# scripts/setup-database.sh

set -e

echo "🗄️  Setting up DevStack Link database..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy .env.example to .env.local and configure your database URL"
    exit 1
fi

# Load environment variables
source .env.local

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env.local"
    echo "Please configure your database connection string"
    exit 1
fi

echo "📋 Generating Prisma client..."
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma db push

echo "🌱 Seeding database with demo data..."
npm run db:seed

echo "✅ Database setup complete!"
echo ""
echo "🎉 Your database is ready with demo data:"
echo "   - Demo user: demo@devstack.link (password: demo123456)"
echo "   - Sample projects and analytics data"
echo ""
echo "🔧 Useful commands:"
echo "   npm run db:studio  - Open Prisma Studio"
echo "   npm run db:reset   - Reset database"
echo "   npm run dev        - Start development server"

# PROD: Production database setup commands
# echo "🚀 For production deployment:"
# echo "   1. Set DATABASE_URL in your production environment"
# echo "   2. Run: npx prisma migrate deploy"
# echo "   3. Run: npm run db:seed (optional for demo data)"