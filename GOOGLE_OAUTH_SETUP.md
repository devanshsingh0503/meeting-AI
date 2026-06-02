# 🔐 Google OAuth Setup Guide

## ❌ What's the Error?

**"Error 400: redirect_uri_mismatch"** means your app's redirect URL doesn't match what's configured in Google Cloud Console.

---

## ✅ Fix: Follow These Steps

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "MeetAI" → Create
4. Wait for project to load (~1 min)

### Step 2: Enable Google OAuth API
1. Search for "OAuth 2.0" in search bar
2. Click "Google+ API" → Enable
3. Click "Credentials" in left menu
4. Click "Create Credentials" → "OAuth 2.0 Client ID"

### Step 3: Configure OAuth Consent
1. If prompted, click "Configure OAuth Consent Screen"
2. Choose "External" user type → Create
3. Fill in:
   - **App name**: MeetAI
   - **User support email**: your email
   - **Developer contact**: your email
4. Click "Save and Continue"
5. Skip scopes → "Save and Continue"
6. Add test user → Save

### Step 4: Create OAuth Credentials
1. Go back to "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. **Name**: MeetAI OAuth
5. Under "Authorized redirect URIs", add **BOTH**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
   *(Replace `yourdomain.com` with your actual domain)*

6. Click "Create"

### Step 5: Copy Credentials
1. You'll see a popup with your credentials
2. Copy:
   - **Client ID** → `GOOGLE_CLIENT_ID` in .env
   - **Client Secret** → `GOOGLE_CLIENT_SECRET` in .env

---

## 🔧 Add to .env

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-32-char-random-secret
```

### Generate Random Secret:
```bash
# On Mac/Linux:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# On Windows PowerShell:
[System.BitConverter]::ToString([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32)).Replace("-","")
```

---

## ✅ Test It

```bash
npm run dev
# Go to http://localhost:3000/sign-in
# Click "Sign in with Google" - should work now!
```

---

## 🚀 For Production

Update Google Cloud Console redirect URIs:
```
https://yourdomain.com/api/auth/callback/google
```

And in `.env.production`:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

---

## 🐛 Still Not Working?

1. **Check NEXT_PUBLIC_APP_URL**
   ```bash
   echo $NEXT_PUBLIC_APP_URL
   # Should output: http://localhost:3000
   ```

2. **Verify .env is loaded**
   - Delete `.next` folder
   - Restart dev server: `npm run dev`

3. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R`)

4. **Check Google Cloud Console**
   - Make sure redirect URIs exactly match (including trailing slash)

---

## 📝 Setting Up GitHub OAuth (Optional)

### Step 1: GitHub Settings
1. Go to [GitHub Settings → Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: MeetAI
   - **Homepage URL**: http://localhost:3000 (or your domain)
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github

4. Generate client secret → copy both ID and secret

### Step 2: Add to .env
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "redirect_uri_mismatch" | Make sure redirect URI matches EXACTLY in Google Console |
| "Invalid client" | Check CLIENT_ID and CLIENT_SECRET are correct |
| Sign-in still fails | Hard refresh browser, clear .next cache, restart server |
| Works locally but not production | Update NEXT_PUBLIC_APP_URL and add production redirect URI in Google |

---

Need more help? Check [Better Auth Docs](https://www.better-auth.com/docs/installation/nextjs)
