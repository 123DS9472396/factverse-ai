import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain } from 'lucide-react';

interface LoadingProps {
  text?: string;
  variant?: 'default' | 'facts' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
}

const LoadingVariants = {
  default: {
    icon: Sparkles,
    colors: ['#00D4FF', '#8B5CF6', '#EC4899'],
    text: 'Loading...'
  },
  facts: {
    icon: Zap,
    colors: ['#10B981', '#3B82F6', '#F59E0B'],
    text: 'Generating Facts...'
  },
  thinking: {
    icon: Brain,
    colors: ['#8B5CF6', '#EC4899', '#00FF94'],
    text: 'AI Thinking...'
  }
};

export default function Loading({ 
  text, 
  variant = 'default', 
  size = 'md' 
}: LoadingProps) {
  const config = LoadingVariants[variant];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
      {/* Animated Background Glow */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-60"
          animate={{
            background: [
              `radial-gradient(circle, ${config.colors[0]}40, transparent)`,
              `radial-gradient(circle, ${config.colors[1]}40, transparent)`,
              `radial-gradient(circle, ${config.colors[2]}40, transparent)`,
              `radial-gradient(circle, ${config.colors[0]}40, transparent)`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ width: size === 'lg' ? '80px' : size === 'md' ? '60px' : '40px', height: size === 'lg' ? '80px' : size === 'md' ? '60px' : '40px' }}
        />
        
        {/* Main Icon */}
        <motion.div
          className={`relative ${sizeClasses[size]} text-white`}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Icon className="w-full h-full drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.colors[i] }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
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

      {/* Loading Text */}
      {(text || config.text) && (
        <motion.p
          className="mt-3 text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text || config.text}
        </motion.p>
      )}

      {/* Pulse Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut"
            }}
            style={{ 
              width: size === 'lg' ? '60px' : size === 'md' ? '40px' : '30px', 
              height: size === 'lg' ? '60px' : size === 'md' ? '40px' : '30px' 
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Specialized loading components
export const FactsLoading = ({ text }: { text?: string }) => (
  <Loading variant="facts" text={text} size="lg" />
);

export const ThinkingLoading = ({ text }: { text?: string }) => (
  <Loading variant="thinking" text={text} size="md" />
);

export const SmallLoading = ({ text }: { text?: string }) => (
  <Loading variant="default" text={text} size="sm" />
);
