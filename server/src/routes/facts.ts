import { Router } from 'express'
import aiService from '../services/aiService'
import FactModel from '../models/FactSupabase'
import { logger } from '../utils/logger'

const router = Router()

// Generate a new fact using AI
router.post('/generate', async (req, res) => {
  try {
    const { category = 'general', difficulty = 'medium' } = req.body

    logger.info(`Generating fact - Category: ${category}, Difficulty: ${difficulty}`)

    // Generate fact using AI service
    const fact = await aiService.generateFact(category, difficulty)

    // Save to database if it's not a fallback fact
    if (fact.metadata?.aiGenerated !== false) {
      try {
        const savedFact = await FactModel.create(fact)
        fact.id = savedFact.id
      } catch (dbError) {
        logger.error('Database save failed:', dbError)
        // Continue with response even if DB save fails
      }
    }

    res.status(200).json(fact)
  } catch (error) {
    logger.error('Fact generation error:', error)
    res.status(500).json({
      error: 'Failed to generate fact',
      message: error.message
    })
  }
})

// Get random fact
router.get('/random', async (req, res) => {
  try {
    const { category } = req.query

    // Try to get from database first
    const fact = await FactModel.getRandomFact(category as string)
    
    if (fact) {
      res.status(200).json(fact)
    } else {
      // Generate new fact if none in database
      const newFact = await aiService.generateFact(category as string || 'general')
      res.status(200).json(newFact)
    }
  } catch (error) {
    logger.error('Random fact error:', error)
    res.status(500).json({
      error: 'Failed to get random fact',
      message: error.message
    })
  }
})

// Get facts by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params
    const { limit = 10 } = req.query

    const facts = await FactModel.findByCategory(category, Number(limit))

    res.status(200).json({
      facts,
      count: facts.length
    })
  } catch (error) {
    logger.error('Category facts error:', error)
    res.status(500).json({
      error: 'Failed to get category facts',
      message: error.message
    })
  }
})

// Get fact by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const fact = await FactModel.findById(id)
    
    if (!fact) {
      return res.status(404).json({
        error: 'Fact not found'
      })
    }

    res.status(200).json(fact)
  } catch (error) {
    logger.error('Get fact error:', error)
    res.status(500).json({
      error: 'Failed to get fact',
      message: error.message
    })
  }
})

// Like a fact
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params

    const fact = await FactModel.incrementLikes(id)

    res.status(200).json({
      message: 'Fact liked successfully',
      likes: fact.likes
    })
  } catch (error) {
    logger.error('Like fact error:', error)
    res.status(500).json({
      error: 'Failed to like fact',
      message: error.message
    })
  }
})

export default router
