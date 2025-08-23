import { motion } from 'framer-motion';
import { TrendingUp, Flame, Eye, Clock } from 'lucide-react';
import FactCard from '../components/FactCard';
import { FactsLoading } from '../components/ui/loading';
import { factAPI } from '../utils/api';
import { useQuery } from '@tanstack/react-query';

interface TrendingFact {
  id: string;
  text: string;
  category: string;
  source?: string;
  verification_status?: string;
  views: number;
  trending_score: number;
  time_trending: number;
}

export default function TrendingPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['facts', 'trending'],
    queryFn: () => factAPI.generateFactsBatch('general', 'medium', 15),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const facts = Array.isArray(response) ? response : response?.facts || [];

  // Simulate trending metrics for demonstration
  const trendingFacts: TrendingFact[] = facts.map((fact) => ({
    ...fact,
    views: Math.floor(Math.random() * 5000) + 1000,
    trending_score: Math.floor(Math.random() * 100) + 50,
    time_trending: Math.floor(Math.random() * 24) + 1
  })).sort((a: TrendingFact, b: TrendingFact) => b.trending_score - a.trending_score);

  const stats = [
    {
      icon: TrendingUp,
      label: 'Trending Facts',
      value: trendingFacts.length,
      color: 'text-green-500'
    },
    {
      icon: Flame,
      label: 'Hot Topics',
      value: 8,
      color: 'text-orange-500'
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: trendingFacts.reduce((sum: number, fact: TrendingFact) => sum + fact.views, 0).toLocaleString(),
      color: 'text-blue-500'
    },
    {
      icon: Clock,
      label: 'Updated',
      value: 'Just now',
      color: 'text-purple-500'
    }
  ];

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
            <TrendingUp className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-6xl font-bold glow-text">
              Trending Facts
            </h1>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular and engaging facts that are captivating minds right now
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="glass p-6 rounded-xl text-center"
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trending Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 glow-text-subtle">🔥 Hot Categories</h2>
          <div className="flex flex-wrap gap-3">
            {['Science', 'Technology', 'History', 'Nature', 'Space'].map((category, index) => (
              <motion.span
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-4 py-2 glass rounded-full text-sm font-medium hover:bg-primary/10 transition-all cursor-pointer"
              >
                #{category}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Trending Facts */}
        {isLoading ? (
          <FactsLoading />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 glow-text-subtle">📈 Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingFacts.map((fact: TrendingFact, index: number) => (
                <motion.div
                  key={fact.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative"
                >
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <FactCard fact={fact} index={index} />
                    
                    {/* Trending overlay */}
                    <div className="absolute bottom-4 left-4 right-4 glass p-3 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-green-500">
                          <TrendingUp className="w-3 h-3" />
                          <span>Score: {fact.trending_score}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-blue-500">
                          <Eye className="w-3 h-3" />
                          <span>{fact.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
