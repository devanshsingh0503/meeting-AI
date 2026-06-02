#!/bin/bash
# scripts/deploy.sh - Deployment helper script

set -e

echo "🚀 Starting deployment process..."

# Check environment
if [ ! -f .env ]; then
  echo "❌ .env file not found!"
  echo "Copy .env.example and fill in your values:"
  echo "  cp .env.example .env"
  exit 1
fi

# Validate key environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set in .env"
  exit 1
fi

if [ -z "$BETTER_AUTH_SECRET" ]; then
  echo "❌ BETTER_AUTH_SECRET not set in .env"
  exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Database migration
echo "🗄️ Running database migrations..."
npm run db:push

# Build
echo "🔨 Building application..."
npm run build

# Size analysis
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm start' to test locally"
echo "2. Deploy to your platform:"
echo "   - Vercel: vercel --prod"
echo "   - Railway: railway up"
echo "   - Docker: docker build -t app . && docker run -p 3000:3000 app"
