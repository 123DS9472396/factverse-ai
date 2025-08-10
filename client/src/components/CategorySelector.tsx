import { motion } from 'framer-motion';
import { Microscope, Clock, Cpu, Leaf, Rocket, Globe, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Facts', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'science', name: 'Science', icon: Microscope, color: 'from-blue-500 to-cyan-500' },
  { id: 'history', name: 'History', icon: Clock, color: 'from-amber-500 to-orange-500' },
  { id: 'technology', name: 'Technology', icon: Cpu, color: 'from-purple-500 to-violet-500' },
  { id: 'nature', name: 'Nature', icon: Leaf, color: 'from-green-500 to-emerald-500' },
  { id: 'space', name: 'Space', icon: Rocket, color: 'from-indigo-500 to-blue-500' },
  { id: 'general', name: 'General', icon: Globe, color: 'from-gray-500 to-slate-500' },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Explore Categories</h2>
      
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={`group relative overflow-hidden rounded-xl p-4 min-w-[140px] transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-white/50 shadow-lg shadow-white/20'
                  : 'hover:shadow-lg hover:shadow-white/10'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
              
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10 border border-white/20" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-full bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <span className="text-white font-medium text-sm group-hover:text-blue-100 transition-colors duration-200">
                  {category.name}
                </span>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="categorySelector"
                  className="absolute inset-0 rounded-xl bg-white/5 border-2 border-white/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
