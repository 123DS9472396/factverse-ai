import React, { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

type Theme = 'dark' | 'light' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme
    if (savedTheme) {
      setThemeState(savedTheme)
    } else {
      // Default to user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    const updateTheme = () => {
      let isDarkMode = theme === 'dark'
      
      if (theme === 'auto') {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      setIsDark(isDarkMode)
      
      // Update document class
      const root = document.documentElement
      if (isDarkMode) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDarkMode ? '#0F0F23' : '#FFFFFF')
      }
    }

    updateTheme()

    // Listen for system theme changes if auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateTheme)
      
      return () => {
        mediaQuery.removeEventListener('change', updateTheme)
      }
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
  }

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
