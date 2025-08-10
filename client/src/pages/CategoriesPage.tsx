import { useState } from '  const { data: response, isLoading } = useQuery({
    queryKey: ['facts', 'categories', selectedCategory],
    queryFn: () => factAPI.generateFactsBatch(selectedCategory, 'medium', 12),
    enabled: selectedCategory !== 'all'
  });

  const facts = Array.isArray(response) ? response : response?.facts || [];';
import { motion } from 'framer-motion';
import { Search, Grid, List } from 'lucide-react';
import FactCard from '../components/FactCard';
import { FactsLoading } from '../components/ui/loading';
import { factAPI } from '../utils/api';
import { useQuery } from '@tanstack/react-query';

const CATEGORIES = [
  { id: 'science', name: 'Science', emoji: '🔬', color: 'from-blue-500 to-cyan-500' },
  { id: 'technology', name: 'Technology', emoji: '💻', color: 'from-purple-500 to-pink-500' },
  { id: 'history', name: 'History', emoji: '📚', color: 'from-amber-500 to-orange-500' },
  { id: 'nature', name: 'Nature', emoji: '🌿', color: 'from-green-500 to-emerald-500' },
  { id: 'space', name: 'Space', emoji: '🚀', color: 'from-indigo-500 to-purple-500' },
  { id: 'animals', name: 'Animals', emoji: '🦁', color: 'from-yellow-500 to-red-500' },
  { id: 'geography', name: 'Geography', emoji: '🌍', color: 'from-teal-500 to-blue-500' },
  { id: 'culture', name: 'Culture', emoji: '🎭', color: 'from-rose-500 to-pink-500' },
  { id: 'mathematics', name: 'Mathematics', emoji: '📐', color: 'from-violet-500 to-purple-500' },
  { id: 'food', name: 'Food', emoji: '🍎', color: 'from-orange-500 to-red-500' },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: facts = [], isLoading } = useQuery({
    queryKey: ['facts', 'categories', selectedCategory],
    queryFn: () => factAPI.generateFactsBatch(selectedCategory, 'medium', 12),
    enabled: selectedCategory !== 'all'
  });

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 glow-text">
            Explore Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover fascinating facts organized by topics you love
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'glass hover:bg-primary/10'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'glass hover:bg-primary/10'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Categories Grid */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid gap-6 mb-12 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-2xl mx-auto'
            }`}
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className="group cursor-pointer"
              >
                <div className={`p-6 glass rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 bg-gradient-to-br ${category.color} bg-opacity-10 hover:bg-opacity-20`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {category.emoji}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:glow-text transition-all">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Explore {category.name.toLowerCase()} facts
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Selected Category Facts */}
        {selectedCategory !== 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold capitalize glow-text">
                {selectedCategory} Facts
              </h2>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-2 glass rounded-xl hover:bg-primary/10 transition-all"
              >
                ← Back to Categories
              </button>
            </div>

            {isLoading ? (
              <FactsLoading />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facts.map((fact, index) => (
                  <FactCard key={fact.id} fact={fact} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
