@echo off
echo.
echo 🎉 FACTVERSE - GIT SETUP AFTER INSTALLATION
echo ==========================================
echo.
echo ⚠️ IMPORTANT: After Git installation completes:
echo 1. Close this PowerShell window
echo 2. Open a NEW PowerShell window
echo 3. Navigate back to the project folder
echo 4. Run this script again
echo.

echo 🔍 Testing if Git is installed...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git is installed!
    echo.
    echo 🔧 Configuring Git...
    git config --global user.name "Dipesh Sharma"
    git config --global user.email "dipesh.sharma@example.com"
    
    echo.
    echo 📁 Initializing repository...
    git init
    git add .
    git commit -m "Initial commit: FactVerse platform with glassmorphism design"
    git branch -M main
    
    echo.
    echo ✅ Repository initialized successfully!
    echo.
    echo 🌐 Next steps:
    echo 1. Create repository at: https://github.com/123DS9472396
    echo 2. Name it: factverse-ai
    echo 3. Make it PUBLIC
    echo 4. DON'T initialize with README
    echo.
    echo 🔗 Then run these commands:
    echo git remote add origin https://github.com/123DS9472396/factverse-ai.git
    echo git push -u origin main
    echo.
) else (
    echo ❌ Git is not installed yet or PowerShell needs restart
    echo.
    echo 📋 Manual Installation Steps:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download Git for Windows
    echo 3. Install with default settings
    echo 4. Restart PowerShell
    echo 5. Run this script again
    echo.
)

echo 🚀 After Git setup, deploy for FREE:
echo.
echo 📱 Frontend (Vercel - FREE):
echo   https://vercel.com
echo   - Sign in with GitHub
echo   - Import repository
echo   - Root directory: client
echo.
echo ⚙️ Backend (Cyclic - FREE):
echo   https://cyclic.sh
echo   - Sign in with GitHub
echo   - Deploy from repository
echo   - Choose server folder
echo.
echo 💾 Database (MongoDB Atlas - FREE):
echo   https://mongodb.com/atlas
echo   - Create free cluster
echo   - No credit card needed
echo.
pause
