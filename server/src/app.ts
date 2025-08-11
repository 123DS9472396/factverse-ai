import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Routes
import factRoutes from './routes/facts'

// Middleware
import { errorHandler } from './middleware/errorHandler'
import { logger } from './utils/logger'

// Supabase connection
import { testConnection } from './config/supabase'

// Load environment variables
config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))

// Rate limiting - More generous limits for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Much higher limit for development
  message: {
    error: 'API limit exceeded. Please try again later.'
  }
})
app.use('/api/', limiter)

// Fact generation specific rate limit - More generous
const factLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Allow 50 generations per minute
  message: {
    error: 'Too many fact generation requests, please try again later.'
  }
})
app.use('/api/facts/generate', factLimiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/facts', factRoutes)

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)
  
  socket.on('join-room', (room) => {
    socket.join(room)
    logger.info(`User ${socket.id} joined room: ${room}`)
  })
  
  socket.on('fact-generated', (factData) => {
    // Broadcast new fact to all connected users
    socket.broadcast.emit('new-fact-available', factData)
  })
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`
  })
})

// Database connection
const connectDB = async () => {
  try {
    const connected = await testConnection()
    if (connected) {
      logger.info('✅ Supabase connected successfully')
    } else {
      throw new Error('Supabase connection test failed')
    }
  } catch (error) {
    logger.error('❌ Supabase connection failed:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

// Start server
const startServer = async () => {
  try {
    await connectDB()
    
    server.listen(PORT, () => {
      logger.info(`🚀 FactVerse AI Server running on port ${PORT}`)
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export { io }
export default app
