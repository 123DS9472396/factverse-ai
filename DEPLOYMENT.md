# 🚀 FactVerse AI - Complete Deployment Guide

## 📋 **Step-by-Step Deployment Process**

### Phase 1: GitHub Repository Setup ✅ (Already Done)

Your code is already on GitHub at: `https://github.com/123DS9472396/factverse-ai`

---

### Phase 2: Frontend Deployment on Vercel ✅ (Already Done)

Your frontend is live at: `https://factverse-ai.vercel.app/`

---

### Phase 3: Backend Deployment on Render

#### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign in with your GitHub account
4. Verify your email if prompted

#### Step 2: Create New Web Service
1. Click "New +" button in top right
2. Select "Web Service"
3. Click "Connect" next to your `factverse-ai` repository

#### Step 3: Configure Render Settings
**Basic Settings:**
- **Name**: `factverse-ai` (or any unique name)
- **Region**: `Oregon (US West)` (or closest to you)
- **Branch**: `main`
- **Root Directory**: `./` (leave as default)

**Build & Deploy:**
- **Runtime**: `Node` (auto-detected)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- **Select**: `Free` ($0/month)

#### Step 4: Add Environment Variables
Click "Add Environment Variable" for each of these:

| Variable Name | Value |
|---------------|-------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://factverse-ai.vercel.app` |
| `SUPABASE_URL` | `your_supabase_project_url` |
| `SUPABASE_ANON_KEY` | `your_supabase_anon_key` |
| `JWT_SECRET` | `your_jwt_secret_from_env_file` |
| `JWT_EXPIRES_IN` | `7d` |
| `HUGGING_FACE_API_KEY` | `your_hugging_face_api_key` *(optional)* |
| `GEMINI_API_KEY` | `your_gemini_api_key` *(optional)* |

**📝 Note**: Get the actual values from your `server/.env` file

**🔐 Security Important**: 
- **NEVER** put real API keys in documentation
- Get your **Supabase URL** and **anon key** from your Supabase project dashboard
- Use your own **JWT_SECRET** from your local `.env` file
- AI API keys are optional for basic functionality

**📝 Note**: Get the actual API key values from your `server/.env` file

**⚠️ Important**: Do NOT add PORT - Render provides this automatically

#### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Your backend will be live at: `https://your-service-name.onrender.com`

---

### Phase 4: Database Setup (Supabase PostgreSQL)

#### Step 1: Sign up for Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with your GitHub account

#### Step 2: Create New Project
1. Click "New Project"
2. **Project name**: `factverse-ai`
3. **Database password**: Generate strong password (save it!)
4. **Region**: West US (Oregon) - same as your Render backend
5. Click "Create new project"
6. Wait 30-60 seconds for setup

#### Step 3: Get Project Details
1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxx.supabase.co`)
3. Copy your **anon public** API key

#### Step 4: Create Database Table
1. Go to **SQL Editor** in left sidebar
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Create the facts table
CREATE TABLE facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL CHECK (char_length(text) >= 10 AND char_length(text) <= 1000),
  category TEXT NOT NULL CHECK (category IN ('science', 'history', 'nature', 'space', 'technology', 'animals', 'geography', 'culture', 'mathematics', 'food', 'general')),
  source TEXT DEFAULT 'FactVerse AI',
  verified BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  metadata JSONB DEFAULT '{"confidence": 0.8, "reading_time": 30, "complexity": "medium", "ai_generated": true}',
  reports JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_facts_category ON facts(category);
CREATE INDEX idx_facts_verified ON facts(verified);
CREATE INDEX idx_facts_likes ON facts(likes DESC);
CREATE INDEX idx_facts_created_at ON facts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access" ON facts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON facts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON facts FOR UPDATE USING (true);
```

#### Step 5: Add Database URL to Render
1. Go back to your Render service
2. Go to "Environment" tab  
3. Add these environment variables:
   - **Name**: `SUPABASE_URL`
   - **Value**: Your Supabase Project URL
   - **Name**: `SUPABASE_ANON_KEY` 
   - **Value**: Your Supabase anon key
4. Click "Save Changes"

---

### Phase 5: Connect Frontend to Backend

#### Step 1: Update Frontend API URL
1. Go to your GitHub repository
2. Edit `client/src/utils/api.ts` or similar file
3. Change the API base URL to your Render backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-service-name.onrender.com/api'
   ```

#### Step 2: Redeploy Frontend
1. Commit the change to GitHub
2. Vercel will automatically redeploy
3. Wait 2-3 minutes for deployment

---

### Phase 6: Testing & Verification

#### Step 1: Test Backend
1. Visit your Render backend URL
2. Should show: "FactVerse AI Server is running"
3. Test API endpoint: `https://your-backend.onrender.com/api/facts`

#### Step 2: Test Frontend
1. Visit: `https://factverse-ai.vercel.app`
2. Try generating facts
3. Check if facts load and display properly

#### Step 3: Monitor Logs
1. **Render**: Go to your service → "Logs" tab
2. **Vercel**: Go to your project → "Functions" tab
3. Check for any error messages

---

## 🎯 **Quick Reference - What You Need to Do Now:**

1. **✅ Done**: GitHub repository
2. **✅ Done**: Frontend on Vercel
3. **🔄 In Progress**: Backend on Render (fix build settings)
4. **📝 To Do**: Set up MongoDB Atlas
5. **📝 To Do**: Connect frontend to backend
6. **📝 To Do**: Test everything

---

## 🆘 **Troubleshooting Common Issues:**

### Backend Build Fails
- **Fix**: Use build command `npm install` (not yarn)
- **Fix**: Use start command `npm start`

### Database Connection Error
- **Fix**: Check MongoDB connection string format
- **Fix**: Ensure IP whitelist includes 0.0.0.0/0

### CORS Errors
- **Fix**: Add your Vercel URL to `CLIENT_URL` environment variable

### App Sleeps (Free Tier)
- **Expected**: Render free tier sleeps after 15 minutes
- **Fix**: First request after sleep takes 30-60 seconds

---

## 📱 **Final URLs:**

- **Frontend**: https://factverse-ai.vercel.app
- **Backend**: https://your-service-name.onrender.com
- **Database**: MongoDB Atlas (private)
- **GitHub**: https://github.com/123DS9472396/factverse-ai

## 🎯 **Current Status - What You Need to Do Right Now:**

### ✅ **Already Completed:**
- GitHub repository setup
- Frontend deployed on Vercel
- Code fixes pushed to GitHub

### 🔧 **Fix Your Current Render Deployment:**

**Go to your Render service settings and update:**

1. **Build Command**: Change from `npm run build:server` to `npm install`
2. **Start Command**: Keep as `npm start`
3. **Add Missing Environment Variable**: `MONGODB_URI` (you'll get this from MongoDB Atlas)
4. **Click "Manual Deploy"** to redeploy with correct settings

### 📋 **Next Steps to Complete:**

1. **Set up MongoDB Atlas** (10 minutes)
2. **Add database URL to Render** (2 minutes)  
3. **Update frontend API URL** (5 minutes)
4. **Test everything** (5 minutes)

**Total time to complete: ~25 minutes**

---

#### Option 1: Glitch (Best for No Card Required)
1. **Sign up at [Glitch](https://glitch.com)**
   - **100% Free Forever** - No expiration, no card needed
   - Import from GitHub
   - Always free, Google-backed
   - **Limitation**: App sleeps after 5 minutes of inactivity

#### Option 2: Vercel Serverless Functions (Most Reliable Free)
1. **Use your existing Vercel account**
   - Convert backend to serverless API routes
   - **100% Free Forever** - 100GB bandwidth, 100GB-hrs
   - No credit card required
   - **Best option for long-term stability**

#### Option 3: InfinityFree + 000webhost
1. **Sign up at [000webhost](https://www.000webhost.com)**
   - **Completely free hosting**
   - No expiration date
   - 1GB storage, 10GB bandwidth
   - PHP/MySQL support (can host Node.js apps)

#### Option 4: Netlify Functions (Serverless Alternative)
1. **Sign up at [Netlify](https://netlify.com)**
   - Convert backend to serverless functions  
   - **Free tier**: 125k requests/month
   - No credit card required
   - **Perfect for API-only backends**

#### Option 5: GitHub Codespaces (Development Environment as Backend)
1. **Use GitHub Codespaces**
   - 60 hours/month free
   - Keep your app running in codespace
   - Access via forwarded ports
   - **Creative workaround for free hosting**

## 🎯 **Platform-Specific Environment Variables:**

### For Render:
```env
NODE_ENV=production
# PORT is automatically provided by Render (usually 10000)
# Your app uses: process.env.PORT || 5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=https://your-vercel-app.vercel.app
```

### For Glitch:
```env
NODE_ENV=production
PORT=3000
# Glitch uses PORT=3000 by default
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=https://your-vercel-app.vercel.app
```

### For all platforms, also add:
```env
HUGGING_FACE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster
   - Get connection string
   - Add to Railway environment variables

**Result**: Your backend will be live at `https://your-app-name.up.railway.app`

### Update Frontend with Backend URL

After deploying backend, update your frontend to use the production API:

1. In `client/src/utils/api.ts` or similar file
2. Update the API base URL to your Railway deployment URL

### Final Steps

1. **Update README** with your live URLs
2. **Test both deployments**
3. **Verify all features work**

## 💡 Free Services Summary (Guaranteed Free for 1+ Years)

- **Vercel**: Frontend hosting (Free forever, no card needed)
- **Render**: Backend hosting (Free 750hrs/month, card verification only - never charged)
- **Glitch**: Backend hosting (Free forever, no card needed, sleeps after 5min)
- **Vercel Serverless**: Backend as API routes (Free forever, no card needed)
- **Netlify Functions**: Serverless backend (Free 125k requests/month, no card)
- **MongoDB Atlas**: Database (Free 512MB forever, no card needed)
- **GitHub**: Code repository (Free forever, no card needed)

## 🔧 Maintenance

- **Vercel**: Automatic deployments on git push
- **Render**: Automatic deployments on git push (free 750hrs/month)
- **Glitch**: Auto-import from GitHub, always free
- **MongoDB Atlas**: Monitor usage in dashboard (512MB free forever)
- **Domain**: Use free `.vercel.app`, `.onrender.com`, `.glitch.me` domains

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and API working
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] SSL certificates active (automatic)
- [ ] Repository public on GitHub
- [ ] README updated with live URLs
