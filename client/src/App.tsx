import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Context Providers
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

// Pages
import HomePage from './pages/HomePage'

// Components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen relative theme-transition ${isDark ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Layout */}
      <div className="relative z-10">
        <Header />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="flex-1 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </motion.div>
        </main>
        
        <Footer />
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(255, 255, 255, 0.2)' 
              : '1px solid rgba(0, 0, 0, 0.2)',
            color: isDark ? '#fff' : '#000',
            borderRadius: '12px',
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)'
          },
          success: {
            style: {
              background: 'rgba(34, 197, 94, 0.9)',
              color: '#fff',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.9)',
              color: '#fff',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }
          }
        }}
      />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
