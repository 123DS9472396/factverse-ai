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
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables** (Optional)
   - Add any client-side environment variables if needed

**Result**: Your frontend will be live at `https://your-app-name.vercel.app`

### Backend Deployment - Cyclic (100% Free - No Card Required)

1. **Sign up at [Cyclic](https://www.cyclic.sh)**
   - Use your GitHub account
   - **Completely free, no credit card needed!**

2. **Deploy Backend**
   - Click "Deploy"
   - Connect your GitHub repository
   - Select "server" folder as the app directory
   - Cyclic will auto-detect Node.js

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLIENT_URL=https://your-vercel-app.vercel.app
   HUGGING_FACE_API_KEY=your_key_here (optional)
   GEMINI_API_KEY=your_key_here (optional)
   ```

### Alternative Backend Options (All 100% Free):

#### Option 2: Render (Free Tier)
- **Note**: Requires credit card for verification but has generous free tier
- Sign up at [Render](https://render.com)
- Deploy from GitHub
- 750 hours/month free (enough for full-time hosting)

#### Option 3: Glitch (100% Free)
1. Sign up at [Glitch](https://glitch.com)
2. Import from GitHub
3. Automatically deployed
4. No credit card required

#### Option 4: Heroku Alternative - Fly.io
1. Sign up at [Fly.io](https://fly.io)
2. Free tier: 3 shared-cpu-1x VMs
3. Deploy with `flyctl deploy`

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
- **Cyclic**: Backend hosting (Free forever, no card needed)  
- **MongoDB Atlas**: Database (Free 512MB, no card needed)
- **GitHub**: Code repository (Free, no card needed)

## 🔧 Maintenance

- **Vercel**: Automatic deployments on git push
- **Cyclic**: Automatic deployments on git push  
- **MongoDB Atlas**: Monitor usage in dashboard
- **Domain**: Use free `.vercel.app` and `.cyclic.app` domains

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and API working
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] SSL certificates active (automatic)
- [ ] Repository public on GitHub
- [ ] README updated with live URLs
