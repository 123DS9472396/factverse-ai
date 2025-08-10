import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail, ExternalLink, Code, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: Github, 
      url: 'https://github.com/123DS9472396', 
      color: 'hover:text-gray-300',
      description: 'Source code & projects'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://www.linkedin.com/in/dipesh-sharma-Thane0704', 
      color: 'hover:text-blue-400',
      description: 'Professional profile'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      url: 'mailto:dipesh.sharma.dev@gmail.com', 
      color: 'hover:text-green-400',
      description: 'Get in touch'
    },
  ];

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { name: 'Categories', url: '/categories' },
        { name: 'Random Facts', url: '/random' },
        { name: 'Trending', url: '/trending' },
        { name: 'Saved Facts', url: '/saved' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { name: 'About FactVerse', url: '/about' },
        { name: 'How it Works', url: '/how-it-works' },
        { name: 'Fact Sources', url: '/sources' },
        { name: 'Quality Standards', url: '/quality' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Developer Profile', url: 'https://www.linkedin.com/in/dipesh-sharma-Thane0704' },
        { name: 'Project Repository', url: 'https://github.com/123DS9472396' },
        { name: 'Report Issues', url: '/feedback' },
        { name: 'Feature Requests', url: '/suggestions' },
      ],
    },
  ];

  return (
    <footer className="relative mt-20 glass theme-transition">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="relative container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <span className="text-white font-bold text-lg relative z-10">F</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold glow-text">FactVerse</h3>
                <span className="text-xs text-muted-foreground -mt-1">Knowledge Discovery Platform</span>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground mb-6 max-w-md leading-relaxed"
            >
              Discover fascinating facts from across the universe of knowledge. Built with modern technology 
              to bring you accurate, engaging, and educational content that sparks curiosity.
            </motion.p>

            {/* Developer credit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass p-4 rounded-lg mb-6"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Developed by</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Dipesh Sharma</span> - Full Stack Developer
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Passionate about creating innovative web applications with modern technologies
              </p>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`group relative p-3 rounded-lg glass hover:glow-button transition-all duration-200`}
                    title={social.description}
                  >
                    <Icon className={`w-5 h-5 text-muted-foreground ${social.color} transition-colors duration-200`} />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-foreground bg-background/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {social.name}
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 3) }}
            >
              <h4 className="text-foreground font-semibold mb-4 glow-text-subtle">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : '_self'}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      whileHover={{ x: 4 }}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group text-sm"
                    >
                      <span>{link.name}</span>
                      {link.url.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-6 mb-8 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h4 className="text-foreground font-semibold mb-2 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Stay Curious</span>
              </h4>
              <p className="text-muted-foreground text-sm">Get fascinating facts and updates delivered to your inbox.</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 theme-transition"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute top-2 right-2 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
            />
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>© {currentYear} FactVerse. Created with</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>by</span>
            <a 
              href="https://www.linkedin.com/in/dipesh-sharma-Thane0704" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Dipesh Sharma
            </a>
            <span>for curious minds.</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/accessibility" className="hover:text-foreground transition-colors duration-200">
              Accessibility
            </a>
          </div>
        </motion.div>
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </footer>
  );
}
