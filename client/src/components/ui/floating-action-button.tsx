import React from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from './button';

interface FloatingActionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  variant?: 'loadMore' | 'refresh' | 'generate';
  text?: string;
  disabled?: boolean;
}

const variants = {
  loadMore: {
    icon: Plus,
    defaultText: 'Load More Facts',
    loadingText: 'Loading More...',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    hoverGradient: 'from-indigo-600 via-purple-600 to-pink-600'
  },
  refresh: {
    icon: RefreshCw,
    defaultText: 'Refresh Facts',
    loadingText: 'Refreshing...',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    hoverGradient: 'from-emerald-600 via-teal-600 to-cyan-600'
  },
  generate: {
    icon: Sparkles,
    defaultText: 'Generate New',
    loadingText: 'Generating...',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    hoverGradient: 'from-orange-600 via-red-600 to-pink-600'
  }
};

export default function FloatingActionButton({
  onClick,
  isLoading = false,
  variant = 'loadMore',
  text,
  disabled = false
}: FloatingActionButtonProps) {
  const config = variants[variant];
  const Icon = config.icon;
  
  const displayText = text || (isLoading ? config.loadingText : config.defaultText);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-xl opacity-75 blur-lg`}
        animate={{
          opacity: isLoading ? [0.4, 0.8, 0.4] : 0.75,
          scale: isLoading ? [1, 1.1, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: isLoading ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      {/* Main Button */}
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          relative px-8 py-4 bg-gradient-to-r ${config.gradient} 
          hover:bg-gradient-to-r hover:${config.hoverGradient}
          text-white font-semibold rounded-xl shadow-2xl
          border-0 transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          overflow-hidden group
        `}
      >
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: isLoading ? ["-100%", "200%"] : "-100%"
          }}
          transition={{
            duration: 1.5,
            repeat: isLoading ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Content */}
        <div className="relative flex items-center space-x-3">
          <motion.div
            animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
            transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          
          <span className="text-lg font-medium">
            {displayText}
          </span>
        </div>
        
        {/* Particle Effects */}
        {isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </Button>
      
      {/* Floating Rings */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-xl border border-white/20`}
            animate={isLoading ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            } : {}}
            transition={{
              duration: 2,
              repeat: isLoading ? Infinity : 0,
              delay: i * 1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
