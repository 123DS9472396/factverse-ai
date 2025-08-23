import { motion } from 'framer-motion';
import { Clock, Heart, Share2, Bookmark, ExternalLink, Sparkles, Award } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface FactCardProps {
  fact: {
    id: string;
    text: string;
    category: string;
    source?: string;
    verified?: boolean;
    likes?: number;
    createdAt?: string;
    metadata?: {
      confidence?: number;
      readingTime?: number;
    };
  };
  index?: number;
  showActions?: boolean;
  className?: string;
}

export default function FactCard({ fact, index = 0 }: FactCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const confidence = fact.metadata?.confidence || 0.8;
  const timestamp = fact.createdAt ? new Date(fact.createdAt) : new Date();

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.9) return { level: 'Exceptional', color: 'text-emerald-400', icon: Award };
    if (confidence >= 0.8) return { level: 'High', color: 'text-green-400', icon: Sparkles };
    if (confidence >= 0.6) return { level: 'Good', color: 'text-yellow-400', icon: null };
    return { level: 'Moderate', color: 'text-orange-400', icon: null };
  };

  const getCategoryVariant = (category: string): 'glow' | 'neon' | 'default' => {
    const glowCategories = ['science', 'technology', 'space'];
    const neonCategories = ['nature', 'animals'];
    
    if (glowCategories.includes(category.toLowerCase())) return 'glow';
    if (neonCategories.includes(category.toLowerCase())) return 'neon';
    return 'default';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Amazing Fact from FactVerse',
          text: fact.text,
          url: window.location.href,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${fact.text} - Discovered on FactVerse`);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const confidenceInfo = getConfidenceLevel(confidence);
  const ConfidenceIcon = confidenceInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100 
      }}
      className="group h-full"
    >
      <Card variant="glass" className="fact-card h-full relative overflow-hidden">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant={getCategoryVariant(fact.category)}>
              {fact.category}
            </Badge>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{timestamp.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Fact Text */}
          <motion.p 
            className="text-foreground text-lg leading-relaxed mb-4 flex-grow glow-text-subtle group-hover:text-shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {fact.text}
          </motion.p>

          {/* Confidence & Verification */}
          <div className="space-y-3 mb-4">
            {/* Accuracy Section */}
            <div className="p-3 glass rounded-lg">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Accuracy:</span>
                <div className="flex items-center space-x-1">
                  {ConfidenceIcon && <ConfidenceIcon className={`w-4 h-4 ${confidenceInfo.color} flex-shrink-0`} />}
                  <span className={`font-semibold ${confidenceInfo.color} whitespace-nowrap`}>
                    {confidenceInfo.level}
                  </span>
                  <span className={`text-sm ${confidenceInfo.color} opacity-80`}>
                    ({Math.round(confidence * 100)}%)
                  </span>
                </div>
                {fact.verified && (
                  <Badge variant="glow" className="text-xs flex-shrink-0">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              
              {/* Source Section - moved inside accuracy section */}
              {fact.source && (
                <div className="pt-2 border-t border-border/30">
                  <motion.a
                    href={fact.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-1 text-sm px-2 py-1 hover:bg-primary/10 rounded-md w-fit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>View Source</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </motion.a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`hover:scale-110 transition-all duration-200 ${
                  isLiked ? 'text-red-500 hover:text-red-400' : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span>{(fact.likes || 0) + (isLiked ? 1 : 0)}</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className={`hover:scale-110 transition-all duration-200 ${
                  isShared ? 'text-green-500' : 'text-muted-foreground hover:text-blue-500'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`hover:scale-110 transition-all duration-200 ${
                  isBookmarked ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Floating elements for visual enhancement */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-sm"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
