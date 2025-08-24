# Render Environment Variables Setup

## 🚀 **URGENT: Add These Environment Variables to Render**

After restoring your Supabase database, you need to add these environment variables to your Render backend:

### **1. Go to Render Dashboard**

- Visit: https://dashboard.render.com
- Find your `factverse-ai` service
- Click on it → Go to "Environment" tab

### **2. Add These Environment Variables:**

```env
# 🔑 AI API Keys (Replace with your actual keys)
HUGGING_FACE_API_KEY=your_huggingface_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here  
OPENAI_API_KEY=your_openai_api_key_here
COHERE_API_KEY=your_cohere_api_key_here

# 📊 Database (Replace with your Supabase credentials)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 🌐 URLs
CLIENT_URL=https://factverse-ai-git-main-dipeshs-projects-055d8d01.vercel.app

# 🔒 Security
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d

# ⚙️ Server
NODE_ENV=production
PORT=10000

# 📈 Analytics
GOOGLE_ANALYTICS_ID=your_analytics_id

# 🚦 Rate Limiting - More generous for production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
FACT_GENERATION_LIMIT=50

# 🤖 Features
AI_TEMPERATURE=0.8
AI_MAX_TOKENS=250
AI_TOP_P=0.9
FACT_BATCH_SIZE=25
ENABLE_FACT_VERIFICATION=true
ENABLE_SENTIMENT_ANALYSIS=true
ENABLE_TOPIC_CLASSIFICATION=true
```

### **3. Copy Values from Local .env**

Use the actual values from your local `server/.env` file for:
- All API keys
- Supabase credentials  
- JWT secret

### **4. Save and Deploy**

After adding all variables, click "Save" and Render will automatically redeploy your service.

### **5. Verify Deployment**

After deployment (2-3 minutes), test these endpoints:
- https://factverse-ai.onrender.com/api/facts/stats
- https://factverse-ai.onrender.com/api/facts/generate/batch

## ⚠️ **Critical Notes:**

1. **Supabase Database**: Must be restored first before adding these variables
2. **NODE_ENV**: Set to `production` (not `development`)
3. **PORT**: Render requires `10000` or the PORT environment variable
4. **CLIENT_URL**: Must match your exact Vercel deployment URL

## 🔧 **After Setup:**

1. Test the website: https://factverse-ai-git-main-dipeshs-projects-055d8d01.vercel.app
2. Check that stats load properly (should show "0 Total Generated", etc.)
3. Try generating new facts
4. Verify search functionality works

## 🚨 **Security Reminder:**

- Never commit real API keys to GitHub
- Keep your local `.env` file secure
- Use environment variables for all sensitive data
