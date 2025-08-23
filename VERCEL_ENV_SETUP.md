# Vercel Environment Variables Setup

## Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your `factverse-ai` project
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

## Step 2: Add These Environment Variables

Add the following environment variables for your Vercel deployment:

### Variable 1: VITE_SUPABASE_URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://hdvyajfhudpzujjbpivj.supabase.co`
- **Environment**: Production, Preview, Development (select all)

### Variable 2: VITE_SUPABASE_ANON_KEY
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkdnlhamZodWRwenVqamJwaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4ODA2NDgsImV4cCI6MjA3MDQ1NjY0OH0.tRwf3i9s9u3WtWgv-x9QiJYCFnIGKUb3ftSzz31dirk`
- **Environment**: Production, Preview, Development (select all)

## Step 3: Redeploy
After adding these variables:
1. Go to **Deployments** tab
2. Click the three dots (...) on your latest deployment
3. Click **Redeploy**
4. This will rebuild your app with the new environment variables

## Your Frontend Will Now Connect to Supabase! 🎉

Your Vercel frontend at: https://factverse-ai-git-main-dipeshs-projects-055d8d01.vercel.app/
Will now be able to:
- Authenticate users with Supabase Auth
- Read and write data to your database
- Use all the features you've built
