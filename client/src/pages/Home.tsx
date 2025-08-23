import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Brain, Rocket } from 'lucide-react'
import FactGenerator from '../components/facts/FactGenerator'
import FactCard from '../components/FactCard'
import CategorySelector from '../components/CategorySelector'
import StatsCard from '../components/StatsCard'
import { useApp } from '../context/AppContext'
import { ANIMATION_VARIANTS } from '../utils/constants'

const Home: React.FC = () => {
  const { user, factHistory, savedFacts } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const stats = [
    {
      title: 'Facts Discovered',
      value: factHistory.length,
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      description: 'Amazing facts you\'ve explored'
    },
    {
      title: 'Facts Saved',
      value: savedFacts.length,
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      description: 'Your favorite discoveries'
    },
    {
      title: 'Streak Days',
      value: user?.stats.streakDays || 0,
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      description: 'Days of continuous learning'
    },
    {
      title: 'Categories Explored',
      value: new Set(factHistory.map(f => f.category)).size,
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      description: 'Different knowledge areas'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="initial"
        animate="animate"
        className="text-center py-20"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6 glow-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          FactVerse AI
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Discover the universe of knowledge with AI-powered fact generation.
          <br />
          <span className="holographic">Explore • Learn • Wonder</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <FactGenerator 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      {user && (
        <motion.section 
          className="py-16"
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 glow-text">
              Your Learning Journey
            </h2>
            <p className="text-gray-400 text-lg">
              Track your progress and celebrate your achievements
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={ANIMATION_VARIANTS.stagger}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={ANIMATION_VARIANTS.fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Category Explorer */}
      <motion.section 
        className="py-16"
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 glow-text">
            Explore Categories
          </h2>
          <p className="text-gray-400 text-lg">
            Dive deep into your favorite subjects
          </p>
        </div>

        <CategorySelector 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </motion.section>

      {/* Recent Facts */}
      {factHistory.length > 0 && (
        <motion.section 
          className="py-16"
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 glow-text">
              Recent Discoveries
            </h2>
            <p className="text-gray-400 text-lg">
              Your latest fact explorations
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={ANIMATION_VARIANTS.stagger}
            initial="initial"
            animate="animate"
          >
            {factHistory.slice(0, 6).map((fact, index) => (
              <motion.div
                key={fact.id}
                variants={ANIMATION_VARIANTS.fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <FactCard 
                  fact={fact}
                  showActions={true}
                  className="interactive-hover"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Welcome Message for New Users */}
      {!user && (
        <motion.section 
          className="py-20 text-center"
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="glass-card max-w-2xl mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h3 className="text-3xl font-bold mb-4 glow-text">
              Welcome to FactVerse AI
            </h3>
            <p className="text-gray-300 text-lg mb-8">
              Start your journey of discovery! Generate your first fact above and explore 
              the vast universe of knowledge powered by artificial intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI-Powered Facts
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Instant Learning
              </span>
              <span className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Personalized Experience
              </span>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default Home
