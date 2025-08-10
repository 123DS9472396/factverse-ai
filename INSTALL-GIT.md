# 🔧 Git Installation & Setup Guide

## 📥 Install Git (Choose One Method)

### Method 1: Download Git for Windows (Recommended)
1. Go to: https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run the installer with default settings
4. Restart PowerShell after installation

### Method 2: Install via Winget (Windows Package Manager)
```powershell
winget install --id Git.Git -e --source winget
```

### Method 3: Install via Chocolatey (if you have it)
```powershell
choco install git
```

## 🔄 After Installation - Restart PowerShell and Run:

### 1. Configure Git (First Time Setup)
```bash
git config --global user.name "Dipesh Sharma"
git config --global user.email "your-email@example.com"
```

### 2. Initialize Repository
```bash
cd c:\Users\admin\Desktop\fact-verse-ai_complete
git init
git add .
git commit -m "Initial commit: FactVerse platform"
git branch -M main
```

### 3. Connect to GitHub
```bash
git remote add origin https://github.com/123DS9472396/factverse-ai.git
git push -u origin main
```

## 🌐 Alternative: Use GitHub Desktop (No Command Line)

If you prefer a GUI instead of command line:

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install and sign in** with your GitHub account
3. **Add existing repository**: 
   - File → Add Local Repository
   - Choose: `c:\Users\admin\Desktop\fact-verse-ai_complete`
4. **Publish to GitHub**:
   - Click "Publish repository"
   - Name: `factverse-ai`
   - Make sure it's public
   - Click "Publish repository"

## ✅ Verification

After installation, test Git:
```bash
git --version
```

You should see something like: `git version 2.x.x.windows.x`

## 🚀 Next Steps After Git Setup

1. **Push your code to GitHub** (using commands above)
2. **Deploy Frontend to Vercel**: https://vercel.com
3. **Deploy Backend to Cyclic**: https://cyclic.sh
4. **Setup MongoDB Atlas**: https://mongodb.com/atlas

All deployment services are 100% free and don't require credit cards!
