import { Router } from 'express'
import aiService from '../services/aiService'
import Fact from '../models/Fact'
import { logger } from '../utils/logger'

const router = Router()

// Generate multiple facts in batch
router.post('/generate/batch', async (req, res) => {
  try {
    const { category = 'general', difficulty = 'medium', count = 25 } = req.body

    if (count > 50) {
      return res.status(400).json({
        error: 'Maximum 50 facts can be generated at once'
      })
    }

    logger.info(`Generating ${count} facts - Category: ${category}, Difficulty: ${difficulty}`)

    const facts: any[] = []
    const errors: string[] = []

    // Generate facts in smaller batches to avoid API rate limits
    const batchSize = 5
    const batches = Math.ceil(count / batchSize)

    for (let i = 0; i < batches; i++) {
      const currentBatchSize = Math.min(batchSize, count - i * batchSize)
      const batchPromises: Promise<any>[] = []

      for (let j = 0; j < currentBatchSize; j++) {
        batchPromises.push(
          aiService.generateFact(category, difficulty)
            .catch(error => {
              errors.push(error.message)
              return aiService.generateFallbackFact(category)
            })
        )
      }

      const batchResults = await Promise.all(batchPromises)
      facts.push(...batchResults)

      // Add delay between batches
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Save facts to database
    const savedFacts: any[] = []
    for (const fact of facts) {
      try {
        if (fact.metadata?.aiGenerated !== false) {
          const savedFact = new Fact(fact)
          await savedFact.save()
          fact.id = savedFact._id
        }
        savedFacts.push(fact)
      } catch (dbError) {
        logger.warn('Failed to save fact to database:', dbError)
        savedFacts.push(fact) // Include even if save fails
      }
    }

    res.status(200).json({
      facts: savedFacts,
      generated: facts.length,
      requested: count,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    logger.error('Batch fact generation error:', error)
    res.status(500).json({
      error: 'Failed to generate facts batch',
      message: error.message
    })
  }
})

// Generate a new fact using AI
router.post('/generate', async (req, res) => {
  try {
    const { category = 'general', difficulty = 'medium', count = 1 } = req.body

    logger.info(`Generating fact - Category: ${category}, Difficulty: ${difficulty}`)

    // Generate fact using AI service
    const fact = await aiService.generateFact(category, difficulty, count)

    // Save to database if it's not a fallback fact
    if (fact.metadata?.aiGenerated !== false) {
      try {
        const savedFact = new Fact(fact)
        await savedFact.save()
        fact.id = savedFact._id
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

    let query = {}
    if (category && category !== 'all') {
      query = { category }
    }

    // Try to get from database first
    const facts = await Fact.find(query).limit(100)
    
    if (facts.length > 0) {
      const randomFact = facts[Math.floor(Math.random() * facts.length)]
      res.status(200).json(randomFact)
    } else {
      // Generate new fact if none in database
      const fact = await aiService.generateFact(category as string || 'general')
      res.status(200).json(fact)
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
    const { limit = 10, page = 1 } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    
    const facts = await Fact.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Fact.countDocuments({ category })

    res.status(200).json({
      facts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: facts.length,
        totalFacts: total
      }
    })
  } catch (error) {
    logger.error('Category facts error:', error)
    res.status(500).json({
      error: 'Failed to get category facts',
      message: error.message
    })
  }
})

// Search facts
router.get('/search', async (req, res) => {
  try {
    const { q: query, category, difficulty, limit = 10, page = 1 } = req.query

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    let searchQuery: any = {
      $text: { $search: query as string }
    }

    if (category && category !== 'all') {
      searchQuery.category = category
    }

    if (difficulty) {
      searchQuery['metadata.complexity'] = difficulty
    }

    const skip = (Number(page) - 1) * Number(limit)

    const facts = await Fact.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit))

    const total = await Fact.countDocuments(searchQuery)

    res.status(200).json({
      facts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: facts.length,
        totalFacts: total
      },
      query
    })
  } catch (error) {
    logger.error('Search facts error:', error)
    res.status(500).json({
      error: 'Failed to search facts',
      message: error.message
    })
  }
})

// Get fact by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const fact = await Fact.findById(id)
    
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

    const fact = await Fact.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    )

    if (!fact) {
      return res.status(404).json({
        error: 'Fact not found'
      })
    }

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

// Report a fact
router.post('/:id/report', async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    if (!reason) {
      return res.status(400).json({
        error: 'Report reason is required'
      })
    }

    // In a real app, this would create a report record
    logger.info(`Fact reported - ID: ${id}, Reason: ${reason}`)

    res.status(200).json({
      message: 'Fact reported successfully'
    })
  } catch (error) {
    logger.error('Report fact error:', error)
    res.status(500).json({
      error: 'Failed to report fact',
      message: error.message
    })
  }
})

// Save fact (placeholder for user-specific functionality)
router.post('/:id/save', async (req, res) => {
  try {
    const { id } = req.params
    
    // In a real app, this would save to user's saved facts
    logger.info(`Fact saved - ID: ${id}`)

    res.status(200).json({
      message: 'Fact saved successfully'
    })
  } catch (error) {
    logger.error('Save fact error:', error)
    res.status(500).json({
      error: 'Failed to save fact',
      message: error.message
    })
  }
})

// Remove saved fact
router.delete('/:id/save', async (req, res) => {
  try {
    const { id } = req.params
    
    // In a real app, this would remove from user's saved facts
    logger.info(`Fact unsaved - ID: ${id}`)

    res.status(200).json({
      message: 'Fact removed from saved successfully'
    })
  } catch (error) {
    logger.error('Unsave fact error:', error)
    res.status(500).json({
      error: 'Failed to remove saved fact',
      message: error.message
    })
  }
})

// Get saved facts (placeholder)
router.get('/saved', async (req, res) => {
  try {
    // In a real app, this would get user's saved facts
    res.status(200).json([])
  } catch (error) {
    logger.error('Get saved facts error:', error)
    res.status(500).json({
      error: 'Failed to get saved facts',
      message: error.message
    })
  }
})

// Get trending facts
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const facts = await Fact.find()
      .sort({ likes: -1, createdAt: -1 })
      .limit(Number(limit))

    res.status(200).json(facts)
  } catch (error) {
    logger.error('Trending facts error:', error)
    res.status(500).json({
      error: 'Failed to get trending facts',
      message: error.message
    })
  }
})

// Get fact statistics
router.get('/stats', async (req, res) => {
  try {
    logger.info('Getting fact statistics')
    
    const totalFacts = await Fact.countDocuments()
    const categoryCounts = await Fact.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const generatedToday = await Fact.countDocuments({
      createdAt: { $gte: today }
    })

    const stats = {
      totalFacts,
      categoryCounts: categoryCounts.reduce((acc: any, item: any) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      generatedToday,
      categories: [
        'science',
        'technology', 
        'history',
        'nature',
        'space',
        'animals',
        'geography',
        'culture',
        'sports',
        'entertainment',
        'general'
      ]
    }

    logger.info('Stats generated successfully:', stats)
    res.status(200).json(stats)
  } catch (error) {
    logger.error('Fact stats error:', error)
    res.status(500).json({
      error: 'Failed to get fact statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
