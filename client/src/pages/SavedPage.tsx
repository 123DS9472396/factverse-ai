import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Search, Filter, Trash2, Download, Share2 } from 'lucide-react';
import FactCard from '../components/FactCard';

interface SavedFact {
  id: string;
  text: string;
  category: string;
  source?: string;
  confidence: number;
  timestamp: Date;
  likes?: number;
  verified?: boolean;
  savedAt: Date;
  tags?: string[];
}

export default function SavedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock saved facts for demonstration
  const [savedFacts] = useState<SavedFact[]>([
    {
      id: '1',
      text: 'The human brain contains approximately 86 billion neurons, each connected to thousands of others, creating a network more complex than any computer ever built.',
      category: 'science',
      confidence: 0.95,
      timestamp: new Date('2024-01-15'),
      savedAt: new Date('2024-01-15'),
      likes: 142,
      verified: true,
      tags: ['neuroscience', 'brain', 'biology']
    },
    {
      id: '2',
      text: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.',
      category: 'food',
      confidence: 0.92,
      timestamp: new Date('2024-01-14'),
      savedAt: new Date('2024-01-14'),
      likes: 98,
      verified: true,
      tags: ['food', 'preservation', 'history']
    },
    {
      id: '3',
      text: 'A day on Venus is longer than its year. Venus rotates so slowly that one day (243 Earth days) is longer than one year (225 Earth days).',
      category: 'space',
      confidence: 0.98,
      timestamp: new Date('2024-01-13'),
      savedAt: new Date('2024-01-13'),
      likes: 76,
      verified: true,
      tags: ['venus', 'planets', 'astronomy']
    }
  ]);

  const categories = ['all', ...Array.from(new Set(savedFacts.map(fact => fact.category)))];

  const filteredFacts = savedFacts
    .filter(fact => 
      (selectedCategory === 'all' || fact.category === selectedCategory) &&
      (searchTerm === '' || 
       fact.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
       fact.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'oldest':
          return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleExport = () => {
    const data = JSON.stringify(savedFacts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-facts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bookmark className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl md:text-6xl font-bold glow-text">
              Saved Facts
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal collection of fascinating facts saved for later
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {savedFacts.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Saved
            </div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {categories.length - 1}
            </div>
            <div className="text-sm text-muted-foreground">
              Categories
            </div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {savedFacts.reduce((sum, fact) => sum + (fact.likes || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Likes
            </div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {Math.round(savedFacts.reduce((sum, fact) => sum + fact.confidence, 0) / savedFacts.length * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Accuracy
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search saved facts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-3 glass rounded-xl hover:bg-primary/10 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-3 glass rounded-xl hover:bg-primary/10 transition-all">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-primary/50"
                title="Filter by category"
                aria-label="Filter facts by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-primary/50"
              title="Sort saved facts"
              aria-label="Sort saved facts by different criteria"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="likes">Most Liked</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </motion.div>

        {/* Facts Grid */}
        {filteredFacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-semibold text-muted-foreground mb-2">
              No saved facts yet
            </h3>
            <p className="text-muted-foreground">
              Start saving interesting facts to build your personal collection
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFacts.map((fact, index) => (
              <motion.div
                key={fact.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative group"
              >
                <FactCard fact={fact} index={index} />
                
                {/* Saved overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 glass rounded-lg hover:bg-primary/10 transition-all"
                      title="Share this fact"
                      aria-label="Share this fact"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 glass rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                      title="Remove from saved facts"
                      aria-label="Remove from saved facts"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Saved date */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass p-2 rounded text-xs text-muted-foreground">
                    Saved {fact.savedAt.toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
