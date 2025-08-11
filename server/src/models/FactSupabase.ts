import { supabase } from '../config/supabase'
import { logger } from '../utils/logger'

export interface IFact {
  id?: string
  text: string
  category: string
  source?: string
  verified: boolean
  likes: number
  created_at?: string
  updated_at?: string
  metadata?: {
    confidence: number
    reading_time: number
    complexity: 'easy' | 'medium' | 'hard'
    ai_generated?: boolean
    keywords?: string[]
    related_topics?: string[]
  }
  reports?: Array<{
    reason: string
    reported_at: string
    resolved: boolean
  }>
}

export class FactModel {
  // Create a new fact
  static async create(factData: Omit<IFact, 'id' | 'created_at' | 'updated_at'>): Promise<IFact> {
    const fact = {
      ...factData,
      source: factData.source || 'FactVerse AI',
      likes: factData.likes || 0,
      verified: factData.verified || false,
      metadata: {
        confidence: 0.8,
        reading_time: 30,
        complexity: 'medium' as const,
        ai_generated: true,
        ...factData.metadata
      }
    }

    // Calculate reading time
    if (fact.text) {
      const wordsPerMinute = 200
      const words = fact.text.split(' ').length
      fact.metadata.reading_time = Math.ceil((words / wordsPerMinute) * 60)
    }

    const { data, error } = await supabase
      .from('facts')
      .insert(fact)
      .select()
      .single()

    if (error) {
      logger.error('Error creating fact:', error)
      throw new Error(`Failed to create fact: ${error.message}`)
    }

    return data
  }

  // Find all facts
  static async findAll(limit = 50, offset = 0): Promise<IFact[]> {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      logger.error('Error fetching facts:', error)
      throw new Error(`Failed to fetch facts: ${error.message}`)
    }

    return data || []
  }

  // Find by ID
  static async findById(id: string): Promise<IFact | null> {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      logger.error('Error fetching fact by ID:', error)
      throw new Error(`Failed to fetch fact: ${error.message}`)
    }

    return data
  }

  // Find by category
  static async findByCategory(category: string, limit = 20): Promise<IFact[]> {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Error fetching facts by category:', error)
      throw new Error(`Failed to fetch facts by category: ${error.message}`)
    }

    return data || []
  }

  // Find trending facts (most liked)
  static async findTrending(limit = 10): Promise<IFact[]> {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .eq('verified', true)
      .order('likes', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Error fetching trending facts:', error)
      throw new Error(`Failed to fetch trending facts: ${error.message}`)
    }

    return data || []
  }

  // Get random fact
  static async getRandomFact(category?: string): Promise<IFact | null> {
    let query = supabase.from('facts').select('*')
    
    if (category) {
      query = query.eq('category', category)
    }

    // Get total count first
    const { count } = await supabase
      .from('facts')
      .select('*', { count: 'exact', head: true })
    
    if (!count || count === 0) return null

    // Get random offset
    const randomOffset = Math.floor(Math.random() * count)
    
    const { data, error } = await query
      .range(randomOffset, randomOffset)
      .single()

    if (error) {
      logger.error('Error fetching random fact:', error)
      return null
    }

    return data
  }

  // Update fact (increment likes)
  static async incrementLikes(id: string): Promise<IFact> {
    // First get current likes
    const current = await this.findById(id)
    if (!current) throw new Error('Fact not found')

    const { data, error } = await supabase
      .from('facts')
      .update({ likes: (current.likes || 0) + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Error incrementing likes:', error)
      throw new Error(`Failed to increment likes: ${error.message}`)
    }

    return data
  }

  // Get category statistics
  static async getCategoryStats(): Promise<any[]> {
    const { data, error } = await supabase.rpc('get_category_stats')

    if (error) {
      // Fallback: manual aggregation
      logger.warn('RPC function not available, using fallback')
      const { data: allFacts, error: fetchError } = await supabase
        .from('facts')
        .select('category, verified, likes')

      if (fetchError) {
        throw new Error(`Failed to get category stats: ${fetchError.message}`)
      }

      // Manual aggregation
      const stats = (allFacts || []).reduce((acc: any, fact: any) => {
        if (!acc[fact.category]) {
          acc[fact.category] = { count: 0, verified: 0, totalLikes: 0 }
        }
        acc[fact.category].count++
        if (fact.verified) acc[fact.category].verified++
        acc[fact.category].totalLikes += fact.likes || 0
        return acc
      }, {})

      return Object.entries(stats).map(([category, data]: [string, any]) => ({
        category,
        count: data.count,
        verified: data.verified,
        avg_likes: data.totalLikes / data.count
      }))
    }

    return data || []
  }

  // Search facts
  static async search(query: string, limit = 20): Promise<IFact[]> {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .textSearch('text', query)
      .limit(limit)

    if (error) {
      logger.error('Error searching facts:', error)
      throw new Error(`Failed to search facts: ${error.message}`)
    }

    return data || []
  }
}

export default FactModel
