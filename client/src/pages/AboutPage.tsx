import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code, Coffee, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 glow-text">
            About FactVerse
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Knowledge Discovery Platform - Discover fascinating facts from across the universe of knowledge. 
            Built with modern technology to bring you accurate, engaging, and educational content that sparks curiosity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* About FactVerse */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 glow-text-subtle">
                🌟 Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                FactVerse is designed to make learning fun and accessible. We believe that knowledge should be 
                engaging, verified, and easy to discover. Our platform combines cutting-edge AI technology with 
                carefully curated content to bring you the most fascinating facts from every corner of human knowledge.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 glow-text-subtle">
                🔬 How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-muted-foreground">
                    Advanced AI algorithms generate and curate facts from multiple reliable sources
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-muted-foreground">
                    Each fact is verified for accuracy and tagged with confidence levels
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p className="text-muted-foreground">
                    Beautiful, interactive UI makes exploring knowledge engaging and memorable
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6 glow-text-subtle">
                👨‍💻 Developer
              </h2>
              
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Code className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Dipesh Sharma
                </h3>
                <p className="text-primary font-medium">Full Stack Developer</p>
              </div>

              <p className="text-muted-foreground text-center mb-6">
                Passionate about creating innovative web applications with modern technologies. 
                Dedicated to building tools that make learning and discovery more engaging.
              </p>

              <div className="flex justify-center space-x-4">
                <motion.a
                  href="https://github.com/dipesh-sharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 glass rounded-xl hover:bg-primary/10 transition-all"
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/dipesh-sharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 glass rounded-xl hover:bg-primary/10 transition-all"
                >
                  <Linkedin className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="mailto:dipesh.sharma@email.com"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 glass rounded-xl hover:bg-primary/10 transition-all"
                >
                  <Mail className="w-6 h-6" />
                </motion.a>
              </div>
            </div>

            <div className="glass p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 glow-text-subtle">
                🛠️ Built With
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-1">Frontend</h4>
                  <p className="text-sm text-muted-foreground">React, TypeScript, Tailwind CSS</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-1">Backend</h4>
                  <p className="text-sm text-muted-foreground">Node.js, Express, AI APIs</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-1">Animation</h4>
                  <p className="text-sm text-muted-foreground">Framer Motion</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-1">UI</h4>
                  <p className="text-sm text-muted-foreground">Shadcn/ui, Lucide Icons</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center glass p-8 rounded-2xl"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-lg">Made with</span>
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-lg">and</span>
            <Coffee className="w-5 h-5 text-amber-500" />
            <span className="text-lg">by Dipesh Sharma</span>
          </div>
          <p className="text-muted-foreground">
            Explore, Learn, Discover - One fact at a time
          </p>
        </motion.div>
      </div>
    </div>
  );
}
