# FactVerse AI - Render Backend Deployment Guide

## 🚀 Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up using your GitHub account
3. Connect your GitHub repository

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub: `123DS9472396/factverse-ai`
3. Fill in these details:

**Basic Settings:**
- **Name:** `factverse-ai-backend`
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Pricing:**
- **Instance Type:** Free (sufficient for development)

### Step 3: Environment Variables
Add these in Render Dashboard → Environment:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://factverse-ai.vercel.app
JWT_SECRET=your_super_secure_jwt_secret_here_2024
JWT_EXPIRES_IN=7d

# Supabase (Get from your Supabase dashboard)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI APIs (Optional - for AI features)
HUGGING_FACE_API_KEY=your_hugging_face_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
COHERE_API_KEY=your_cohere_key

# Developer Info
DEVELOPER_NAME=Your Name
DEVELOPER_LINKEDIN=https://www.linkedin.com/in/your-profile
DEVELOPER_GITHUB=https://github.com/123DS9472396
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (~3-5 minutes)
3. Your backend will be available at: `https://factverse-ai-backend.onrender.com`

## ⚡ Important Notes:
- **Free tier sleeps after 15 minutes of inactivity**
- **First request after sleep takes ~30 seconds to wake up**
- **Build time: 3-5 minutes**
- **Logs available in Render dashboard**

## 🔗 After Deployment:
1. Copy your Render backend URL
2. Update client environment variables to point to Render
3. Test API endpoints: `https://your-backend-url.onrender.com/health`
