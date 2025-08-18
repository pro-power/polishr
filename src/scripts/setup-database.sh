#!/bin/bash
# src/scripts/setup-database.sh

set -e

echo "🗄️  Setting up DevStack Link database with email verification..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found!${NC}"
    echo "Please copy .env.example to .env.local and configure your environment variables"
    echo ""
    echo "Required variables:"
    echo "  - DATABASE_URL"
    echo "  - NEXTAUTH_SECRET"
    echo "  - NEXTAUTH_URL"
    echo "  - RESEND_API_KEY"
    echo "  - FROM_EMAIL"
    exit 1
fi

# Load environment variables and export them
set -a  # automatically export all variables
source .env.local
set +a  # stop automatically exporting

# Check required environment variables
check_env_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name not set in .env.local${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $var_name is configured${NC}"
        return 0
    fi
}

echo -e "${BLUE}📋 Checking environment variables...${NC}"
all_vars_set=true

check_env_var "DATABASE_URL" || all_vars_set=false
check_env_var "NEXTAUTH_SECRET" || all_vars_set=false
check_env_var "NEXTAUTH_URL" || all_vars_set=false
check_env_var "RESEND_API_KEY" || all_vars_set=false
check_env_var "FROM_EMAIL" || all_vars_set=false

if [ "$all_vars_set" = false ]; then
    echo -e "${RED}❌ Please configure all required environment variables${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Generating Prisma client...${NC}"
npx prisma generate

echo ""
echo -e "${BLUE}🔄 Running database migrations...${NC}"
npx prisma db push

echo ""
echo -e "${BLUE}🧹 Cleaning up old data (if any)...${NC}"
# Optional: Reset database for clean setup
# npx prisma migrate reset --force

echo ""
echo -e "${BLUE}🌱 Seeding database with demo data...${NC}"
npm run db:seed

echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo -e "${YELLOW}🎉 Your database is ready with email verification system:${NC}"
echo "   - Email verification tokens are generated for new users"
echo "   - Password reset tokens with 1-hour expiration"
echo "   - Demo user: demo@devstack.link (password: demo123456)"
echo "   - Demo user is pre-verified for testing"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo "   npm run db:studio  - Open Prisma Studio"
echo "   npm run db:reset   - Reset database"
echo "   npm run dev        - Start development server"
echo ""
echo -e "${BLUE}📧 Email System:${NC}"
echo "   - Resend API configured for sending emails"
echo "   - Verification emails sent on registration"
echo "   - Password reset emails with secure tokens"
echo "   - Rate limiting prevents email spam"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "   1. Make sure your Resend API key is valid"
echo "   2. Update FROM_EMAIL to match your verified domain"
echo "   3. Test email delivery in development"
echo "   4. Users must verify email before they can sign in"

# Test database connection
echo ""
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "Please check your DATABASE_URL configuration"
fi

echo ""
echo -e "${GREEN}🚀 Setup complete! Ready for Phase 2 development.${NC}"