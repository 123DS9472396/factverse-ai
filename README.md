# 🌟 FactVerse - Knowledge Discovery Platform

![FactVerse](https://img.shields.io/badge/FactVerse-Knowledge%20Platform-blueviolet?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen?style=for-the-badge&logo=node.js)

A modern fact discovery platform featuring glassmorphism design, intelligent content generation, and beautiful animations. Built by **Dipesh Sharma**.

## ✨ Features

- **🎨 Glassmorphism Design** - Beautiful glass effects with backdrop blur
- **✨ Glowing Text Effects** - Animated gradient text with smooth animations  
- **🌈 Dynamic Backgrounds** - Particle systems and gradient animations
- **🌓 Theme Switching** - Dark/Light modes with smooth transitions
- **📱 Responsive Design** - Mobile-first design with touch support
- **🤖 AI Integration** - Multiple AI providers for fact generation
- **📊 Smart Categories** - Intelligent content classification
- **⚡ Fast Loading** - Optimized performance and caching
- **🔄 Real-time Updates** - Live content updates
- **💾 Save Favorites** - Bookmark interesting facts

## 📸 Screenshots

*Modern glassmorphism design with smooth animations*
<img width="1911" height="812" alt="image" src="https://github.com/user-attachments/assets/7192a168-8eea-4488-8c36-67dc2f4d3f85" />
<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/4e8d3f19-cfa7-459a-9b2c-940e358055af" />
<img width="1918" height="926" alt="image" src="https://github.com/user-attachments/assets/550179b8-4be4-430a-8e52-f22b8f6ba904" />


## 🚀 How to Start Your Application

### Prerequisites
- Node.js 16+ 
- Git
- Supabase account (for database)

### Environment Setup:
1. **Copy environment files:**
   ```bash
   cp server/.env.example server/.env
   ```

2. **Update server/.env with your credentials:**
   ```env
   # Database (Supabase PostgreSQL)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI API Keys (Optional)
   HUGGING_FACE_API_KEY=your_key
   GEMINI_API_KEY=your_key
   
   # Security
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   ```

### Start the Server:
```bash
cd fact-verse-ai\server
npm install
npm run build
npm run dev
```

### Start the Client:
```bash
cd fact-verse-ai\client
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5000 (Express server)

## 🌐 Live Demo

🔗 **[Visit FactVerse Live](https://factverse-ai-git-main-dipeshs-projects-055d8d01.vercel.app/)**

**Live URLs:**
- **Frontend**: [https://factverse-ai.vercel.app]((https://factverse-ai-git-main-dipeshs-projects-055d8d01.vercel.app/))
- **Backend API**: [https://factverse-ai.onrender.com](https://factverse-ai.onrender.com)
- **Database**: Supabase PostgreSQL (Cloud)

## 🚀 Quick Deployment

### Complete Deployment Guide

1. **Repository Setup**: Code is already on GitHub at [github.com/123DS9472396/factverse-ai](https://github.com/123DS9472396/factverse-ai)
2. **Database Setup**: Create Supabase project and run the provided SQL scripts
3. **Follow instructions in `DEPLOYMENT.md`** for step-by-step deployment
4. **Deploy Frontend to Vercel** - Free hosting with automatic deployments
5. **Deploy Backend to Render** - Free tier with 750 hours/month
6. **Update environment variables** with production URLs and API keys

### Deployment Platforms
- **Frontend**: Vercel (Free forever)
- **Backend**: Render (Free 750hrs/month)
- **Database**: Supabase PostgreSQL (Free 500MB)
- **Total Cost**: $0/month for development and testing 

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Beautiful, accessible UI components

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Fast, minimalist web framework
- **TypeScript** - Full-stack type safety
- **Supabase** - PostgreSQL database with real-time features
- **JWT** - Secure authentication and authorization

### AI & APIs
- **Hugging Face** - AI model inference
- **Google Gemini** - Advanced language models
- **OpenAI** - GPT integration for content generation

### Deployment & DevOps
- **Vercel** - Frontend hosting and deployment
- **Render** - Backend hosting and API deployment
- **Supabase** - Database hosting and management
- **GitHub** - Version control and CI/CD

## 🗄️ Database Setup

### Supabase PostgreSQL Database

The application uses **Supabase** as the database provider, offering a modern PostgreSQL database with real-time features, built-in authentication, and edge functions.

### Database Schema
- **facts** - Main table storing all generated facts
- **categories** - Fact categories with metadata
- **users** - User accounts and profiles (future feature)
- **user_saved_facts** - User's saved/bookmarked facts
- **user_fact_likes** - Tracking fact likes and engagement

### Quick Database Setup
1. **Create Supabase Project**: Visit [supabase.com](https://supabase.com)
2. **Run SQL Scripts**: Use the provided `supabase_complete_setup.sql`
3. **Get Credentials**: Copy your project URL and anon key
4. **Update Environment**: Add credentials to your `.env` file

### Database Features
- **Row Level Security (RLS)** - Fine-grained access control
- **Real-time subscriptions** - Live updates
- **Full-text search** - Advanced search capabilities
- **JSONB support** - Flexible metadata storage
- **Automated backups** - Data protection

## 👨‍💻 Developer

**Dipesh Sharma** - Full Stack Developer

- **GitHub**: [123DS9472396](https://github.com/123DS9472396)
- **LinkedIn**: [dipesh-sharma-Thane0704](https://www.linkedin.com/in/dipesh-sharma-Thane0704)

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**🌟 If you like this project, please give it a star! 🌟**

**Built with ❤️ by [Dipesh Sharma](https://github.com/123DS9472396)**

</div>
