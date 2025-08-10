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

### Backend Deployment - Render (Free Tier - Best Long-term Option)

1. **Sign up at [Render](https://render.com)**
   - Use your GitHub account
   - **Free tier: 750 hours/month (enough for full uptime)**
   - **Completely free for 1+ years, just requires card verification**
   - No charges unless you upgrade manually

2. **Deploy Backend**
   - Click "New Web Service"
   - Connect your GitHub repository
   - Root directory: `./` (contains server code)
   - Build command: `npm install`
   - Start command: `npm start`
   - Render auto-detects Node.js

3. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLIENT_URL=https://your-vercel-app.vercel.app
   HUGGING_FACE_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

   **Note**: Render automatically provides PORT environment variable, but your app defaults to 5000.

**Result**: Your backend will be live at `https://your-app-name.onrender.com`

### Alternative Backend Options (100% Free for 1+ Years)

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
