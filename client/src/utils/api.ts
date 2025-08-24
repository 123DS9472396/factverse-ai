import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { API_CONFIG, ERROR_MESSAGES } from './constants'
import { supabase } from '../config/supabase'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add Supabase auth token if available
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - sign out from Supabase
      supabase.auth.signOut()
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      throw new Error(ERROR_MESSAGES.API_LIMIT_EXCEEDED)
    } else if (!error.response) {
      // Handle network errors
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    return Promise.reject(error)
  }
)

// API Types
export interface Fact {
  id: string
  text: string
  category: string
  source?: string
  verified: boolean
  likes: number
  createdAt: string
  metadata?: {
    confidence: number
    readingTime: number
    complexity: 'easy' | 'medium' | 'hard'
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    categories: string[]
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
    dailyFactCount: number
  }
  stats: {
    factsViewed: number
    factsSaved: number
    streakDays: number
    joinedAt: string
  }
}

export interface FactGenerationRequest {
  category: string
  difficulty?: 'easy' | 'medium' | 'hard'
  count?: number
  excludeIds?: string[]
}

export interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  complexity: number
  keywords: string[]
  relatedTopics: string[]
  readabilityScore: number
}

// API Functions
export const factAPI = {
  // Get random fact
  getRandomFact: async (category?: string): Promise<Fact> => {
    const response = await apiClient.get('/facts/random', {
      params: { category }
    })
    return response.data
  },

  // Generate AI fact
  generateFact: async (request: FactGenerationRequest): Promise<Fact> => {
    const response = await apiClient.post('/facts/generate', request)
    return response.data
  },

  // Generate multiple facts in batch
  generateFactsBatch: async (
    category: string = 'general', 
    complexity: string = 'medium', 
    count: number = 25
  ): Promise<{ facts: Fact[], metadata: any }> => {
    const response = await apiClient.post('/facts/generate/batch', {
      category,
      complexity,
      count,
      provider: 'huggingface' // Default provider
    })
    return response.data
  },

  // Get fact statistics
  getFactStats: async (): Promise<{
    totalFacts: number;
    generatedToday: number;
    categoryCounts: Record<string, number>;
    topCategories: string[];
  }> => {
    const response = await apiClient.get('/facts/stats')
    return response.data
  },

  // Get facts by category
  getFactsByCategory: async (category: string, limit = 10): Promise<Fact[]> => {
    const response = await apiClient.get(`/facts/category/${category}`, {
      params: { limit }
    })
    return response.data
  },

  // Search facts
  searchFacts: async (query: string, filters?: any): Promise<Fact[]> => {
    const response = await apiClient.get('/facts/search', {
      params: { q: query, ...filters }
    })
    return response.data
  },

  // Save fact
  saveFact: async (factId: string): Promise<void> => {
    await apiClient.post(`/facts/${factId}/save`)
  },

  // Remove saved fact
  removeSavedFact: async (factId: string): Promise<void> => {
    await apiClient.delete(`/facts/${factId}/save`)
  },

  // Get saved facts
  getSavedFacts: async (): Promise<Fact[]> => {
    const response = await apiClient.get('/facts/saved')
    return response.data
  },

  // Like fact
  likeFact: async (factId: string): Promise<void> => {
    await apiClient.post(`/facts/${factId}/like`)
  },

  // Report fact
  reportFact: async (factId: string, reason: string): Promise<void> => {
    await apiClient.post(`/facts/${factId}/report`, { reason })
  }
}

export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/profile')
    return response.data
  },

  // Update user preferences
  updatePreferences: async (preferences: Partial<User['preferences']>): Promise<void> => {
    await apiClient.patch('/users/preferences', preferences)
  },

  // Get user stats
  getStats: async (): Promise<User['stats']> => {
    const response = await apiClient.get('/users/stats')
    return response.data
  },

  // Get user activity
  getActivity: async (limit = 20): Promise<any[]> => {
    const response = await apiClient.get('/users/activity', {
      params: { limit }
    })
    return response.data
  }
}

export const aiAPI = {
  // Analyze fact
  analyzeFact: async (text: string): Promise<AIAnalysis> => {
    const response = await apiClient.post('/ai/analyze', { text })
    return response.data
  },

  // Get recommendations
  getRecommendations: async (userId: string): Promise<Fact[]> => {
    const response = await apiClient.get(`/ai/recommendations/${userId}`)
    return response.data
  },

  // Get insights
  getInsights: async (): Promise<any> => {
    const response = await apiClient.get('/ai/insights')
    return response.data
  }
}

export const analyticsAPI = {
  // Track event
  trackEvent: async (event: string, properties?: any): Promise<void> => {
    await apiClient.post('/analytics/track', { event, properties })
  },

  // Get analytics data
  getAnalytics: async (timeRange = '7d'): Promise<any> => {
    const response = await apiClient.get('/analytics', {
      params: { timeRange }
    })
    return response.data
  }
}

export default apiClient
