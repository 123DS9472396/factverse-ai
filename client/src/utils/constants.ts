// API Configuration
const isDevelopment = import.meta.env.DEV
const productionAPIURL = 'https://factverse-ai.onrender.com/api'
const developmentAPIURL = 'http://localhost:5000/api'

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || (isDevelopment ? developmentAPIURL : productionAPIURL),
  TIMEOUT: 15000, // Increased for better reliability
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
}

// AI Service URLs
export const AI_SERVICES = {
  HUGGING_FACE: 'https://api-inference.huggingface.co/models',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models',
  OPENAI: 'https://api.openai.com/v1',
}

// Fact Categories
export const FACT_CATEGORIES = [
  { id: 'science', name: 'Science', icon: '🔬', color: '#00D4FF' },
  { id: 'history', name: 'History', icon: '📚', color: '#8B5CF6' },
  { id: 'nature', name: 'Nature', icon: '🌿', color: '#00FF94' },
  { id: 'space', name: 'Space', icon: '🚀', color: '#EC4899' },
  { id: 'technology', name: 'Technology', icon: '💻', color: '#F59E0B' },
  { id: 'animals', name: 'Animals', icon: '🦁', color: '#10B981' },
  { id: 'geography', name: 'Geography', icon: '🌍', color: '#3B82F6' },
  { id: 'culture', name: 'Culture', icon: '🎭', color: '#EF4444' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: '#6366F1' },
  { id: 'food', name: 'Food', icon: '🍕', color: '#F97316' },
] as const

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideIn: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
}

// Glass morphism styles
export const GLASS_STYLES = {
  primary: 'backdrop-blur-xl bg-white/10 border border-white/20',
  secondary: 'backdrop-blur-lg bg-white/5 border border-white/10',
  tertiary: 'backdrop-blur-md bg-white/[0.02] border border-white/5',
}

// Glow effects
export const GLOW_EFFECTS = {
  blue: 'shadow-[0_0_20px_rgba(0,212,255,0.3)]',
  purple: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  green: 'shadow-[0_0_20px_rgba(0,255,148,0.3)]',
  pink: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
}

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'factverse_user_preferences',
  SAVED_FACTS: 'factverse_saved_facts',
  FACT_HISTORY: 'factverse_fact_history',
  THEME: 'factverse_theme',
} as const

// API Rate Limits
export const RATE_LIMITS = {
  HUGGING_FACE: 1000, // per month
  GEMINI: 1500, // per day
  FACT_GENERATION: 10, // per minute
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_LIMIT_EXCEEDED: 'API limit exceeded. Please try again later.',
  FACT_GENERATION_FAILED: 'Failed to generate fact. Please try again.',
  SAVE_FAILED: 'Failed to save fact. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please refresh the page.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  FACT_SAVED: 'Fact saved successfully!',
  FACT_REMOVED: 'Fact removed successfully!',
  SETTINGS_UPDATED: 'Settings updated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const
