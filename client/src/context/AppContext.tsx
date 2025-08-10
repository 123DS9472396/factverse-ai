import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Fact, User } from '../utils/api'
import { userAPI, factAPI } from '../utils/api'
import { STORAGE_KEYS } from '../utils/constants'

interface AppState {
  user: User | null
  savedFacts: Fact[]
  factHistory: Fact[]
  isLoading: boolean
  error: string | null
}

interface AppContextType extends AppState {
  // User actions
  setUser: (user: User | null) => void
  updateUserPreferences: (preferences: Partial<User['preferences']>) => Promise<void>
  
  // Fact actions
  saveFact: (fact: Fact) => Promise<void>
  removeFact: (factId: string) => Promise<void>
  addToHistory: (fact: Fact) => void
  clearHistory: () => void
  
  // Loading states
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Utility
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    savedFacts: [],
    factHistory: [],
    isLoading: false,
    error: null,
  })

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load from localStorage first for offline capability
      const savedFactsLocal = localStorage.getItem(STORAGE_KEYS.SAVED_FACTS)
      const factHistoryLocal = localStorage.getItem(STORAGE_KEYS.FACT_HISTORY)
      
      if (savedFactsLocal) {
        setState(prev => ({ ...prev, savedFacts: JSON.parse(savedFactsLocal) }))
      }
      
      if (factHistoryLocal) {
        setState(prev => ({ ...prev, factHistory: JSON.parse(factHistoryLocal) }))
      }

      // Try to load user profile
      try {
        const user = await userAPI.getProfile()
        setUser(user)
        
        // Load saved facts from server
        const savedFacts = await factAPI.getSavedFacts()
        setState(prev => ({ ...prev, savedFacts }))
        
        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.SAVED_FACTS, JSON.stringify(savedFacts))
      } catch (error) {
        // User not logged in or network error - continue with local data
        console.log('User not authenticated or network error')
      }
    } catch (error) {
      setError('Failed to load initial data')
    } finally {
      setLoading(false)
    }
  }

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }))
  }

  const updateUserPreferences = async (preferences: Partial<User['preferences']>) => {
    if (!state.user) throw new Error('User not authenticated')
    
    try {
      await userAPI.updatePreferences(preferences)
      setState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          preferences: { ...prev.user.preferences, ...preferences }
        } : null
      }))
    } catch (error) {
      throw new Error('Failed to update preferences')
    }
  }

  const saveFact = async (fact: Fact) => {
    try {
      // Optimistic update
      const newSavedFacts = [...state.savedFacts, fact]
      setState(prev => ({ ...prev, savedFacts: newSavedFacts }))
      localStorage.setItem(STORAGE_KEYS.SAVED_FACTS, JSON.stringify(newSavedFacts))
      
      // Sync with server if user is authenticated
      if (state.user) {
        await factAPI.saveFact(fact.id)
      }
    } catch (error) {
      // Rollback on error
      setState(prev => ({
        ...prev,
        savedFacts: prev.savedFacts.filter(f => f.id !== fact.id)
      }))
      throw new Error('Failed to save fact')
    }
  }

  const removeFact = async (factId: string) => {
    try {
      // Optimistic update
      const newSavedFacts = state.savedFacts.filter(f => f.id !== factId)
      setState(prev => ({ ...prev, savedFacts: newSavedFacts }))
      localStorage.setItem(STORAGE_KEYS.SAVED_FACTS, JSON.stringify(newSavedFacts))
      
      // Sync with server if user is authenticated
      if (state.user) {
        await factAPI.removeSavedFact(factId)
      }
    } catch (error) {
      // Rollback on error
      loadInitialData()
      throw new Error('Failed to remove fact')
    }
  }

  const addToHistory = (fact: Fact) => {
    const newHistory = [fact, ...state.factHistory.filter(f => f.id !== fact.id)].slice(0, 50)
    setState(prev => ({ ...prev, factHistory: newHistory }))
    localStorage.setItem(STORAGE_KEYS.FACT_HISTORY, JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setState(prev => ({ ...prev, factHistory: [] }))
    localStorage.removeItem(STORAGE_KEYS.FACT_HISTORY)
  }

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }

  const refreshData = async () => {
    await loadInitialData()
  }

  const contextValue: AppContextType = {
    ...state,
    setUser,
    updateUserPreferences,
    saveFact,
    removeFact,
    addToHistory,
    clearHistory,
    setLoading,
    setError,
    refreshData,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
