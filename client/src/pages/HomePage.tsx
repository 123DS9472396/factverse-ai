import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, RefreshCw, TrendingUp } from 'lucide-react';
import FactCard from '../components/FactCard';
import CategorySelector from '../components/CategorySelector';
import LoadingSpinner, { PulseLoader } from '../components/LoadingSpinner';
import { FactsLoading } from '../components/ui/loading';
import FloatingActionButton from '../components/ui/floating-action-button';
import { factAPI } from '../utils/api';
import toast from 'react-hot-toast';

interface Fact {
  id: string;
  text: string;
  category: string;
  confidence: number;
  timestamp: Date;
  likes: number;
  verified: boolean;
  source?: string;
  metadata?: {
    confidence: number;
    readingTime: number;
    complexity: string;
    aiGenerated?: boolean;
  };
}

export default function HomePage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [stats, setStats] = useState({
    totalGenerated: 0,
    dailyFacts: 0,
    categories: 6,
    apiConnected: false
  });

  // Load initial facts on component mount
  const loadInitialFacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await factAPI.generateFactsBatch('general', 'medium', 25);
      if (response.facts) {
        setFacts(response.facts.map((fact) => ({
          ...fact,
          timestamp: new Date(fact.createdAt || Date.now()),
          confidence: fact.metadata?.confidence || 0.8
        })));
        setStats(prev => ({ ...prev, apiConnected: true }));
        toast.success(`Generated ${response.facts.length} fascinating facts!`);
      }
    } catch (error) {
      console.error('Failed to load initial facts:', error);
      setStats(prev => ({ ...prev, apiConnected: false }));
      loadFallbackFacts();
      toast.error('Using offline facts. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load facts when category changes
  const loadFactsByCategory = useCallback(async () => {
    try {
      setIsLoading(true);
      const category = selectedCategory === 'all' ? 'general' : selectedCategory;
      const response = await factAPI.generateFactsBatch(category, 'medium', 25);
      
      if (response.facts) {
        setFacts(response.facts.map((fact) => ({
          ...fact,
          timestamp: new Date(fact.createdAt || Date.now()),
          confidence: fact.metadata?.confidence || 0.8
        })));
        toast.success(`Loaded ${response.facts.length} ${category} facts!`);
      }
    } catch (error) {
      console.error('Failed to load category facts:', error);
      loadFallbackFacts();
      toast.error('Failed to load new facts. Showing cached content.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadInitialFacts();
    loadStats();
  }, [loadInitialFacts]);

  useEffect(() => {
    if (selectedCategory) {
      loadFactsByCategory();
    }
  }, [selectedCategory, loadFactsByCategory]);

  const loadStats = async () => {
    try {
      const statsData = await factAPI.getFactStats();
      setStats(prev => ({
        ...prev,
        totalGenerated: statsData.totalFacts || 0,
        dailyFacts: statsData.generatedToday || 0,
        categories: Object.keys(statsData.categoryCounts || {}).length || 6
      }));
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleGenerateNew = async () => {
    try {
      setIsGenerating(true);
      const category = selectedCategory === 'all' ? 'general' : selectedCategory;
      const response = await factAPI.generateFactsBatch(category, 'medium', 25);
      
      if (response.facts) {
        const newFacts = response.facts.map((fact) => ({
          ...fact,
          timestamp: new Date(fact.createdAt || Date.now()),
          confidence: fact.metadata?.confidence || 0.8
        }));
        
        setFacts(newFacts);
        setStats(prev => ({ 
          ...prev, 
          totalGenerated: prev.totalGenerated + newFacts.length,
          dailyFacts: prev.dailyFacts + newFacts.length 
        }));
        
        toast.success(`Generated ${newFacts.length} new facts!`, {
          icon: '🎉',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Failed to generate new facts:', error);
      toast.error('Failed to generate new facts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadMoreFacts = async () => {
    try {
      setIsLoadingMore(true);
      const category = selectedCategory === 'all' ? 'general' : selectedCategory;
      const response = await factAPI.generateFactsBatch(category, 'medium', 15);
      
      if (response.facts) {
        const newFacts = response.facts.map((fact) => ({
          ...fact,
          timestamp: new Date(fact.createdAt || Date.now()),
          confidence: fact.metadata?.confidence || 0.8
        }));
        
        // Add new facts to the existing ones
        setFacts(prevFacts => [...prevFacts, ...newFacts]);
        setStats(prev => ({ 
          ...prev, 
          totalGenerated: prev.totalGenerated + newFacts.length,
          dailyFacts: prev.dailyFacts + newFacts.length 
        }));
        
        toast.success(`Loaded ${newFacts.length} more facts!`, {
          icon: '📚',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Failed to load more facts:', error);
      toast.error('Failed to load more facts. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Fallback facts when API is not available
  const loadFallbackFacts = () => {
    const fallbackFacts = [
      {
        id: 'fallback-1',
        text: 'The human brain contains approximately 86 billion neurons, each connected to thousands of others through synapses.',
        category: 'science',
        confidence: 0.95,
        timestamp: new Date(),
        likes: 42,
        verified: true,
        source: 'Neuroscience Research'
      },
      {
        id: 'fallback-2',
        text: 'Octopuses have three hearts and blue blood, with two hearts pumping blood to their gills and one to the rest of their body.',
        category: 'nature',
        confidence: 0.92,
        timestamp: new Date(),
        likes: 38,
        verified: true
      },
      {
        id: 'fallback-3',
        text: 'The shortest war in history lasted only 38-45 minutes between Britain and Zanzibar in 1896.',
        category: 'history',
        confidence: 0.89,
        timestamp: new Date(),
        likes: 35,
        verified: true
      }
    ];
    
    // Create 25 facts by repeating and modifying
    const extendedFacts = [];
    for (let i = 0; i < 25; i++) {
      const baseFact = fallbackFacts[i % fallbackFacts.length];
      extendedFacts.push({
        ...baseFact,
        id: `fallback-${i + 1}`,
        timestamp: new Date(Date.now() - i * 60000) // Different timestamps
      });
    }
    
    setFacts(extendedFacts);
  };

  const filteredFacts = selectedCategory === 'all' 
    ? facts 
    : facts.filter(fact => fact.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                FactVerse AI
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover fascinating facts powered by AI • {filteredFacts.length} facts loaded
            </p>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalGenerated}</div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Total Generated</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.dailyFacts}</div>
                <div className="text-sm text-green-600 dark:text-green-300">Today's Facts</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.categories}</div>
                <div className="text-sm text-purple-600 dark:text-purple-300">Categories</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
                <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${stats.apiConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">AI</div>
                <div className="text-sm text-orange-600 dark:text-orange-300">
                  {stats.apiConnected ? 'Connected' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateNew}
                disabled={isGenerating}
                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <PulseLoader className="h-5 w-5 mr-2" />
                ) : (
                  <RefreshCw className="h-5 w-5 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate New Facts'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FactsLoading text="Loading amazing facts..." />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredFacts.map((fact, index) => (
              <motion.div
                key={fact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <FactCard fact={fact} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Facts Button */}
        {!isLoading && filteredFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <FloatingActionButton
              onClick={handleLoadMoreFacts}
              isLoading={isLoadingMore}
              variant="loadMore"
              disabled={isLoadingMore}
            />
          </motion.div>
        )}

        {!isLoading && filteredFacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No facts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try selecting a different category or generate new facts.
            </p>
            <button
              onClick={handleGenerateNew}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Generate Facts
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
