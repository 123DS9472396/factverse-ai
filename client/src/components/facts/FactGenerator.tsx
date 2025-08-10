import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Wand2, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { factAPI } from '../../utils/api'
import { FACT_CATEGORIES, ANIMATION_VARIANTS } from '../../utils/constants'
import toast from 'react-hot-toast'

interface FactGeneratorProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const FactGenerator: React.FC<FactGeneratorProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const { addToHistory, setLoading } = useApp()
  const [currentFact, setCurrentFact] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  const generateFact = async () => {
    setIsGenerating(true)
    setLoading(true)
    
    try {
      const fact = await factAPI.generateFact({
        category: selectedCategory === 'all' ? '' : selectedCategory,
        difficulty,
        count: 1
      })
      
      setCurrentFact(fact)
      addToHistory(fact)
      toast.success('New fact discovered! ✨')
    } catch (error) {
      toast.error('Failed to generate fact. Please try again.')
      console.error('Error generating fact:', error)
    } finally {
      setIsGenerating(false)
      setLoading(false)
    }
  }

  const handleRandomCategory = () => {
    const categories = FACT_CATEGORIES.map(c => c.id)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    onCategoryChange(randomCategory)
    setTimeout(generateFact, 300) // Small delay for better UX
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <motion.div 
        className="glass-card mb-8"
        variants={ANIMATION_VARIANTS.fadeIn}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Category Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="all">🎲 Random Category</option>
              {FACT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty Level
            </label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    difficulty === level
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={generateFact}
              disabled={isGenerating}
              className="glow-button px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              Generate Fact
            </motion.button>

            <motion.button
              onClick={handleRandomCategory}
              disabled={isGenerating}
              className="glass-card px-4 py-3 rounded-lg hover:bg-white/15 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Random Category & Fact"
            >
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Fact Display */}
      <AnimatePresence mode="wait">
        {currentFact && (
          <motion.div
            key={currentFact.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="fact-card">
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm">
                  {FACT_CATEGORIES.find(c => c.id === currentFact.category)?.icon}
                  {FACT_CATEGORIES.find(c => c.id === currentFact.category)?.name || 'General'}
                </span>
                
                {currentFact.metadata?.confidence && (
                  <span className="text-xs text-gray-400">
                    Confidence: {Math.round(currentFact.metadata.confidence * 100)}%
                  </span>
                )}
              </div>

              {/* Fact Text */}
              <motion.p 
                className="text-lg md:text-xl leading-relaxed text-gray-200 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentFact.text}
              </motion.p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {currentFact.metadata?.readingTime && (
                  <span className="flex items-center gap-1">
                    📖 {currentFact.metadata.readingTime}s read
                  </span>
                )}
                {currentFact.metadata?.complexity && (
                  <span className="flex items-center gap-1">
                    🎯 {currentFact.metadata.complexity} level
                  </span>
                )}
                {currentFact.verified && (
                  <span className="flex items-center gap-1 text-green-400">
                    ✅ Verified
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3 mt-6 pt-6 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button className="flex-1 glow-button py-2 px-4 rounded-lg text-sm font-medium">
                  Save Fact
                </button>
                <button className="flex-1 glass-card py-2 px-4 rounded-lg text-sm font-medium hover:bg-white/15 transition-all">
                  Share
                </button>
                <button 
                  onClick={generateFact}
                  className="px-4 py-2 glass-card rounded-lg hover:bg-white/15 transition-all"
                  title="Generate Another"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Floating Particles Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
                  initial={{
                    x: Math.random() * 400,
                    y: Math.random() * 300,
                    scale: 0
                  }}
                  animate={{
                    y: [null, -50, -100],
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Getting Started Message */}
      {!currentFact && !isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Wand2 className="w-16 h-16 mx-auto mb-6 text-purple-400 opacity-50" />
          <h3 className="text-2xl font-bold text-gray-300 mb-4">
            Ready to Discover?
          </h3>
          <p className="text-gray-500 text-lg">
            Click "Generate Fact" to begin your journey into the amazing world of knowledge!
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default FactGenerator
