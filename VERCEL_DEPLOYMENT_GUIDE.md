# FactVerse AI - Vercel Frontend Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com/
2. Sign up using your GitHub account  
3. Connect your GitHub repository

### Step 2: Import Project
1. Click **"New Project"**
2. Import from GitHub: `123DS9472396/factverse-ai`
3. Configure project:

**Framework Preset:** Vite
**Root Directory:** `client`
**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 3: Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
VITE_API_BASE_URL=https://factverse-ai-backend.onrender.com
VITE_APP_NAME=FactVerse AI
VITE_APP_DESCRIPTION=Discover fascinating facts powered by AI
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Your frontend will be available at: `https://factverse-ai.vercel.app`

### Step 5: Update Backend CORS
After Vercel deployment, update your Render backend environment:
```bash
CLIENT_URL=https://factverse-ai.vercel.app
```

## 🎯 Custom Domain (Optional)
1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. SSL certificate auto-generated

## ⚡ Performance Features
- **Edge Network:** Global CDN
- **Automatic HTTPS:** SSL included
- **Zero Config:** No server management
- **Preview Deployments:** Every Git push creates preview URL

## 🔗 After Deployment:
1. Test your live application
2. Update any hardcoded URLs
3. Verify all API connections work
4. Share your live URL! 🎉
