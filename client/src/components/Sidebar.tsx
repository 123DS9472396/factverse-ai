import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bookmark, History, TrendingUp, Settings, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { id: 'home', name: 'Home', icon: Home, path: '/' },
  { id: 'trending', name: 'Trending', icon: TrendingUp, path: '/trending' },
  { id: 'bookmarks', name: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
  { id: 'history', name: 'History', icon: History, path: '/history' },
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', name: 'Help', icon: HelpCircle, path: '/help' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute?: string;
}

export default function Sidebar({ isOpen, onClose, activeRoute = '/' }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
            className="fixed left-0 top-0 h-full w-80 z-50 backdrop-blur-xl bg-black/20 border-r border-white/20"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">FactVerse AI</h2>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeRoute === item.path;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <motion.a
                          href={item.path}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          whileHover={{ x: 4 }}
                          className={`group relative flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-white/10 group-hover:bg-white/20'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <span className="font-medium">{item.name}</span>
                          
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="sidebarActiveIndicator"
                              className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          
                          {/* Hover glow effect */}
                          {hoveredItem === item.id && !isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                            />
                          )}
                        </motion.a>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-white/20">
                <div className="glass-card p-4">
                  <h3 className="text-white font-semibold mb-2">Daily Facts</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Discover amazing facts every day with AI-powered insights.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Today's facts: 12</span>
                    <span>Streak: 5 days</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glassmorphism gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
