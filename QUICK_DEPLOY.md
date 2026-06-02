# ⚡ Quick Deploy Guide

## 1️⃣ Setup (2 minutes)
```bash
# Copy environment template
cp .env.example .env

# Edit with your values (open with your editor)
nano .env  # or use VSCode
```

**Required values in .env**:
- `DATABASE_URL` → PostgreSQL connection string
- `OPENAI_API_KEY` → From OpenAI dashboard (sk-...)
- `BETTER_AUTH_SECRET` → Random 32+ char string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NEXT_PUBLIC_STREAM_API_KEY` → From Stream.io console
- `STREAM_SECRET` → From Stream.io console
- `POLAR_ACCESS_TOKEN` → From Polar dashboard
- `NEXT_PUBLIC_APP_URL` → Your deployment URL

## 2️⃣ Test Locally (1 minute)
```bash
npm install
npm run build      # Should take ~25 seconds
npm run start      # Open http://localhost:3000
```

## 3️⃣ Deploy (Choose One)

### 🎯 **Vercel** (Easiest - 2 clicks)
```bash
npm i -g vercel
vercel --prod
```
✅ Auto-detected as Next.js, env vars set in dashboard

### 🚂 **Railway** (Developer-friendly)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect repo → Add env vars → Done!

### 🐳 **Docker** (Any host)
```bash
docker build -t meetai .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e OPENAI_API_KEY="..." \
  -e NEXT_PUBLIC_STREAM_API_KEY="..." \
  -e STREAM_SECRET="..." \
  -e BETTER_AUTH_SECRET="..." \
  -e POLAR_ACCESS_TOKEN="..." \
  -e NEXT_PUBLIC_APP_URL="https://yourdomain.com" \
  meetai
```

### 🤖 **Automated** (All platforms)
```bash
# Windows
scripts/deploy.bat

# Mac/Linux
bash scripts/deploy.sh
```

## ❌ If Deployment Fails

| Error | Solution |
|-------|----------|
| `DATABASE_URL not set` | Add it to .env or platform's env vars |
| `Build fails` | Run `npm install` then `npm run build` locally first |
| `Can't connect to database` | Check DATABASE_URL format, ensure DB is running |
| `Auth errors` | Generate new BETTER_AUTH_SECRET (32+ random chars) |
| `Slow startup` | Normal (1.5s) or check DB connection pooling |

## 📊 Optimization Changes

✅ **22% faster builds** (33s → 25.8s)  
✅ **Lazy-loaded AI** (no startup delay)  
✅ **Optimized config** (Turbopack, package imports)  

## 🆘 Help

- Build/deploy issues? Check DEPLOYMENT_GUIDE.md
- Performance questions? See OPTIMIZATION_SUMMARY.md
- Code errors? Run `npm run lint`

---

**Ready?** Start with step 1️⃣ above!
