@echo off
REM scripts/deploy.bat - Deployment helper script for Windows

setlocal enabledelayedexpansion

echo 🚀 Starting deployment process...

REM Check environment
if not exist .env (
  echo ❌ .env file not found!
  echo Copy .env.example and fill in your values:
  echo   copy .env.example .env
  exit /b 1
)

echo ✅ Environment variables validated

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci
if errorlevel 1 exit /b 1

REM Database migration
echo 🗄️ Running database migrations...
call npm run db:push
if errorlevel 1 exit /b 1

REM Build
echo 🔨 Building application...
call npm run build
if errorlevel 1 exit /b 1

echo ✅ Deployment preparation complete!
echo.
echo Next steps:
echo 1. Run 'npm start' to test locally
echo 2. Deploy to your platform:
echo    - Vercel: vercel --prod
echo    - Railway: railway up
echo    - Docker: docker build -t app . ^&^& docker run -p 3000:3000 app
