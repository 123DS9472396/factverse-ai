@echo off
echo.
echo 🎉 FACTVERSE COMPLETE SETUP GUIDE
echo ================================
echo.

echo 📋 STEP 1: GITHUB REPOSITORY
echo.
echo 1. Go to: https://github.com/123DS9472396
echo 2. Click "New repository"
echo 3. Repository name: factverse-ai
echo 4. Description: Modern fact discovery platform with glassmorphism design
echo 5. Make it PUBLIC
echo 6. DON'T initialize with README
echo.
pause

echo.
echo 🔧 STEP 2: INITIALIZE GIT
echo.
git init
git add .
git commit -m "Initial commit: FactVerse platform"
git branch -M main

echo.
echo 🔗 STEP 3: CONNECT TO GITHUB
echo.
echo Run this command after creating the repository:
echo git remote add origin https://github.com/123DS9472396/factverse-ai.git
echo git push -u origin main
echo.

echo.
echo 🚀 STEP 4: FREE DEPLOYMENT SETUP
echo.
echo FRONTEND (Vercel - Free Forever):
echo 1. Go to: https://vercel.com
echo 2. Sign in with GitHub
echo 3. Import your repository
echo 4. Root Directory: client
echo 5. Framework: Vite (auto-detected)
echo.

echo BACKEND (Cyclic - 100% Free, No Card Required):
echo 1. Go to: https://www.cyclic.sh
echo 2. Sign in with GitHub
echo 3. Click "Deploy" 
echo 4. Connect your GitHub repository
echo 5. Select "server" folder as app directory
echo.

echo DATABASE (MongoDB Atlas - Free 512MB):
echo 1. Go to: https://www.mongodb.com/atlas
echo 2. Create free account
echo 3. Create free cluster
echo 4. Get connection string
echo 5. Add to Railway environment variables
echo.

echo 🔑 ENVIRONMENT VARIABLES FOR CYCLIC:
echo NODE_ENV=production
echo PORT=3000
echo MONGODB_URI=your_mongodb_atlas_connection_string
echo CLIENT_URL=https://your-vercel-app.vercel.app
echo HUGGING_FACE_API_KEY=optional
echo GEMINI_API_KEY=optional
echo.

echo ✅ RESULT:
echo - Frontend: https://your-app.vercel.app
echo - Backend: https://your-app.cyclic.app
echo - 100%% FREE hosting forever! No credit card needed!
echo.

echo 📖 For detailed instructions, see DEPLOYMENT.md
echo.
pause
