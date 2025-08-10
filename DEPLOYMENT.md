# 🚀 Deployment Guide

## GitHub Repository Setup

### 1. Initialize Git Repository
```bash
cd c:\Users\admin\Desktop\fact-verse-ai_complete
git init
git add .
git commit -m "Initial commit: FactVerse platform"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com/123DS9472396)
2. Click "New repository"
3. Name: `factverse-ai`
4. Description: "Modern fact discovery platform with glassmorphism design"
5. Keep it Public
6. Don't initialize with README (we already have one)

### 3. Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/123DS9472396/factverse-ai.git
git push -u origin main
```

## 🌐 Free Deployment (100% Free - No Card Required)

### Frontend Deployment - Vercel (Free Forever)

1. **Sign up at [Vercel](https://vercel.com)**
   - Use your GitHub account for easy integration
   - **No credit card required!**

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Framework: "Vite" (auto-detected)
   - **Root Directory**: `client` ✅ (NOT client/public or client/src)
   - **Build Command**: `npm run build` (NOT npm run dev)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables** (Optional)
   - Add any client-side environment variables if needed

**Important**: Use `npm run build` for production deployment, not `npm run dev`

**Result**: Your frontend will be live at `https://your-app-name.vercel.app`

### Backend Deployment - Railway (Free Tier - No Card Required Initially)

1. **Sign up at [Railway](https://railway.app)**
   - Use your GitHub account
   - **Free $5 credit monthly (enough for small apps)**
   - No credit card required for signup

2. **Deploy Backend**
   - Click "Deploy from GitHub repo"
   - Connect your GitHub repository
   - Select the root directory (contains server code)
   - Railway auto-detects Node.js

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=$PORT
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLIENT_URL=https://your-vercel-app.vercel.app
   HUGGING_FACE_API_KEY=your_key_here (optional)
   GEMINI_API_KEY=your_key_here (optional)
   ```

**Result**: Your backend will be live at `https://your-app-name.up.railway.app`

### Alternative Backend Options (All Safe & Working):

#### Option 1: Render (Free Tier - Most Reliable)
1. **Sign up at [Render](https://render.com)**
   - **Free tier: 750 hours/month (always-on apps)**
   - More reliable than most alternatives
   - Requires credit card for verification but free tier is generous

2. **Deploy Steps:**
   - Click "New Web Service"
   - Connect GitHub repository
   - Root directory: `./` (for backend)
   - Build command: `npm install`
   - Start command: `npm start`

#### Option 2: Koyeb (Free Tier - No Card Required)
1. **Sign up at [Koyeb](https://www.koyeb.com)**
   - Free tier available
   - No credit card required for signup
   - 512MB RAM, 2.5GB storage

2. **Deploy Steps:**
   - Import from GitHub
   - Select Node.js
   - Configure environment variables

#### Option 3: Netlify Functions (Serverless - Free)
1. **Sign up at [Netlify](https://netlify.com)**
   - Convert your backend to serverless functions
   - Free tier: 125k requests/month
   - No credit card required

#### Option 4: Glitch (100% Free Forever)
1. **Sign up at [Glitch](https://glitch.com)**
   - Import from GitHub
   - Always free
   - No credit card required
   - App sleeps after 5 minutes of inactivity

#### Option 5: Back4App (Backend-as-a-Service)
1. **Sign up at [Back4App](https://www.back4app.com)**
   - Free tier: 25k requests/month
   - No credit card required
   - Managed database included

4. **Database Setup - MongoDB Atlas (Free 512MB)**
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

## 💡 Free Services Summary (No Credit Card Required)

- **Vercel**: Frontend hosting (Free forever, no card needed)
- **Railway**: Backend hosting (Free $5 credit monthly, no card for signup)
- **Render**: Backend hosting (Free 750hrs/month, card for verification only)
- **Koyeb**: Backend hosting (Free tier, no card needed)
- **Glitch**: Backend hosting (Free forever, no card needed)
- **MongoDB Atlas**: Database (Free 512MB, no card needed)
- **GitHub**: Code repository (Free, no card needed)

## 🔧 Maintenance

- **Vercel**: Automatic deployments on git push
- **Railway/Render**: Automatic deployments on git push  
- **MongoDB Atlas**: Monitor usage in dashboard
- **Domain**: Use free `.vercel.app` and deployment platform domains

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and API working
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] SSL certificates active (automatic)
- [ ] Repository public on GitHub
- [ ] README updated with live URLs
