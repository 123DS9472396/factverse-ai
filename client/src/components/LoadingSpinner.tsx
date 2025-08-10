import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Animated spinner */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`${getSizeClasses()} border-2 border-blue-500/30 border-t-blue-500 rounded-full`}
        />
        
        {/* Inner sparkle */}
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} text-blue-400`} />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`text-white/80 font-medium ${getTextSize()}`}
      >
        {text}
      </motion.p>

      {/* Animated dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

// Alternative simple loader
export function SimpleLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-block ${className}`}
    >
      <Loader2 className="w-5 h-5 text-blue-400" />
    </motion.div>
  );
}

// Pulse loader for cards
export function PulseLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-white/20 rounded-full w-20"></div>
          <div className="h-4 bg-white/20 rounded w-24"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-white/20 rounded w-full"></div>
          <div className="h-4 bg-white/20 rounded w-5/6"></div>
          <div className="h-4 bg-white/20 rounded w-4/6"></div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="h-4 bg-white/20 rounded w-20"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
