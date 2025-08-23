import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, Moon, Sun, User, Settings, Github, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
}

export default function Header({ onSearch, onOpenSettings, onOpenProfile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme, theme } = useTheme();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass theme-transition"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
              <span className="text-white font-bold text-lg relative z-10">F</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 hover:opacity-30 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold glow-text">FactVerse</h1>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search facts..."
                className="w-full pl-10 pr-4 py-2 glass rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 theme-transition"
              />
            </form>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Developer Links */}
            <motion.a
              href="https://github.com/123DS9472396"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotateZ: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg glass hover:glow-button transition-all duration-200"
              title="GitHub - Dipesh Sharma"
            >
              <Github className="w-5 h-5 text-foreground" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/dipesh-sharma-Thane0704"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotateZ: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg glass hover:glow-button transition-all duration-200"
              title="LinkedIn - Dipesh Sharma"
            >
              <Linkedin className="w-5 h-5 text-blue-500" />
            </motion.a>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotateZ: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:glow-button transition-all duration-300"
              title={`Current: ${theme} mode`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onOpenSettings?.()}
              className="p-2 rounded-lg glass hover:glow-button transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onOpenProfile?.()}
              className="p-2 rounded-lg glass hover:glow-button transition-all duration-200"
              title="User Profile"
            >
              <User className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-border"
          >
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Discover amazing facts..."
                  className="w-full pl-10 pr-4 py-2 glass rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4 pt-2">
                <a
                  href="https://github.com/123DS9472396"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-foreground" />
                </a>
                <a
                  href="https://www.linkedin.com/in/dipesh-sharma-Thane0704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-blue-500" />
                </a>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg glass"
                  title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-400" />
                  )}
                </button>
                <button 
                  className="p-2 rounded-lg glass" 
                  title="Settings"
                  onClick={onOpenSettings}
                >
                  <Settings className="w-5 h-5 text-foreground" />
                </button>
                <button 
                  className="p-2 rounded-lg glass" 
                  title="User Profile"
                  onClick={onOpenProfile}
                >
                  <User className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
