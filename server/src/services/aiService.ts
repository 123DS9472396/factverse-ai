import axios from 'axios'
import { config } from 'dotenv'

config()

// AI Service Configuration
export const AI_CONFIG = {
  HUGGING_FACE: {
    API_KEY: process.env.HUGGING_FACE_API_KEY || '',
    BASE_URL: 'https://api-inference.huggingface.co/models',
    MODELS: {
      TEXT_GENERATION: 'gpt2-medium',
      CLASSIFICATION: 'microsoft/DialoGPT-medium',
      SENTIMENT: 'cardiffnlp/twitter-roberta-base-sentiment-latest'
    }
  },
  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY || '',
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    MODEL: 'gemini-1.5-flash'
  },
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY || '',
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo'
  }
}

// Fact generation prompts for different categories
const FACT_PROMPTS = {
  science: "Generate an interesting and verified scientific fact about",
  history: "Share a fascinating historical fact about",
  nature: "Tell me an amazing fact about nature and",
  space: "Provide an incredible space or astronomy fact about",
  technology: "Generate a cool technology fact about",
  animals: "Share an interesting animal fact about",
  geography: "Tell me a geographical fact about",
  culture: "Provide a cultural fact about",
  mathematics: "Generate a mathematical fact about",
  food: "Share an interesting food fact about",
  general: "Generate an interesting and educational fact about"
}

// Difficulty levels for fact generation
const DIFFICULTY_CONTEXTS = {
  easy: "suitable for children and beginners",
  medium: "appropriate for general audiences",
  hard: "detailed and complex for advanced learners"
}

export class AIService {
  private static instance: AIService
  private factCache: Map<string, any> = new Map()
  private requestCounts: Map<string, number> = new Map()

  constructor() {
    this.resetDailyCounts()
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private resetDailyCounts() {
    // Reset request counts daily
    setInterval(() => {
      this.requestCounts.clear()
    }, 24 * 60 * 60 * 1000)
  }

  private canMakeRequest(service: string): boolean {
    const count = this.requestCounts.get(service) || 0
    const limits = {
      'huggingface': 1000, // per month (approximately 33 per day)
      'gemini': 50, // reduced to prevent rate limiting
      'openai': 3 // per day (free tier)
    }
    
    return count < (limits[service as keyof typeof limits] || 10)
  }

  private incrementRequestCount(service: string) {
    const current = this.requestCounts.get(service) || 0
    this.requestCounts.set(service, current + 1)
  }

  // Generate fact using Hugging Face
  async generateFactWithHuggingFace(
    category: string, 
    difficulty: string = 'medium'
  ): Promise<any> {
    if (!this.canMakeRequest('huggingface')) {
      throw new Error('Daily request limit exceeded for Hugging Face API')
    }

    try {
      const prompt = this.createPrompt(category, difficulty)
      
      const response = await axios.post(
        `${AI_CONFIG.HUGGING_FACE.BASE_URL}/${AI_CONFIG.HUGGING_FACE.MODELS.TEXT_GENERATION}`,
        {
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            return_full_text: false,
            do_sample: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.HUGGING_FACE.API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      )

      this.incrementRequestCount('huggingface')
      return this.processHuggingFaceResponse(response.data, category, difficulty)
    } catch (error) {
      console.error('Hugging Face API error:', error)
      throw new Error('Failed to generate fact using Hugging Face')
    }
  }

  // Generate fact using Google Gemini
  async generateFactWithGemini(
    category: string, 
    difficulty: string = 'medium'
  ): Promise<any> {
    if (!this.canMakeRequest('gemini')) {
      throw new Error('Daily request limit exceeded for Gemini API')
    }

    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const prompt = this.createDetailedPrompt(category, difficulty)
      
      const response = await axios.post(
        `${AI_CONFIG.GEMINI.BASE_URL}/${AI_CONFIG.GEMINI.MODEL}:generateContent`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.8,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': AI_CONFIG.GEMINI.API_KEY
          },
          timeout: 30000
        }
      )

      this.incrementRequestCount('gemini')
      return this.processGeminiResponse(response.data, category, difficulty)
    } catch (error: any) {
      console.error('Gemini API error:', error)
      if (error.response?.status === 429) {
        // Rate limited, use fallback immediately
        throw new Error('Rate limited - using fallback')
      }
      throw new Error('Failed to generate fact using Gemini')
    }
  }

  // Fallback to predefined facts
  async generateFallbackFact(category: string): Promise<any> {
    const fallbackFacts = await import('../data/fallback-facts.json')
    const categoryFacts = (fallbackFacts.default as any)[category] || (fallbackFacts.default as any).general
    const randomFact = categoryFacts[Math.floor(Math.random() * categoryFacts.length)]
    
    return {
      id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: randomFact.text,
      category: category,
      source: 'FactVerse AI Curated Collection',
      verified: true,
      likes: 0,
      createdAt: new Date().toISOString(),
      metadata: {
        confidence: 0.9,
        readingTime: Math.ceil(randomFact.text.split(' ').length / 200 * 60), // WPM estimate
        complexity: randomFact.difficulty || 'medium',
        aiGenerated: false
      }
    }
  }

  // Main fact generation method with fallback chain
  async generateFact(
    category: string = 'general', 
    difficulty: string = 'medium',
    count: number = 1
  ): Promise<any> {
    const cacheKey = `${category}_${difficulty}_${count}`
    
    // Check cache first
    if (this.factCache.has(cacheKey)) {
      const cached = this.factCache.get(cacheKey)
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data
      }
    }

    let fact: any

    try {
      // Always try fallback first to avoid rate limiting issues
      if (Math.random() > 0.3) { // 70% chance to use fallback to reduce API calls
        fact = await this.generateFallbackFact(category)
      }
      // Try Gemini sparingly (only 30% of the time)
      else if (AI_CONFIG.GEMINI.API_KEY && this.canMakeRequest('gemini')) {
        try {
          fact = await this.generateFactWithGemini(category, difficulty)
        } catch (error: any) {
          console.log('Gemini failed, using fallback:', error.message)
          fact = await this.generateFallbackFact(category)
        }
      }
      // Fallback to Hugging Face if available
      else if (AI_CONFIG.HUGGING_FACE.API_KEY && this.canMakeRequest('huggingface')) {
        try {
          fact = await this.generateFactWithHuggingFace(category, difficulty)
        } catch (error: any) {
          console.log('Hugging Face failed, using fallback:', error.message)
          fact = await this.generateFallbackFact(category)
        }
      }
      // Final fallback to curated facts
      else {
        fact = await this.generateFallbackFact(category)
      }

      // Cache the result
      this.factCache.set(cacheKey, {
        data: fact,
        timestamp: Date.now()
      })

      return fact
    } catch (error) {
      console.error('All AI services failed, using fallback:', error)
      return await this.generateFallbackFact(category)
    }
  }

  // Analyze fact quality and extract metadata
  async analyzeFact(text: string): Promise<any> {
    try {
      const analysis = {
        sentiment: await this.analyzeSentiment(text),
        complexity: this.calculateComplexity(text),
        readabilityScore: this.calculateReadability(text),
        keywords: this.extractKeywords(text),
        relatedTopics: this.generateRelatedTopics(text)
      }

      return analysis
    } catch (error) {
      console.error('Fact analysis failed:', error)
      return {
        sentiment: 'neutral',
        complexity: 0.5,
        readabilityScore: 0.7,
        keywords: [],
        relatedTopics: []
      }
    }
  }

  private createPrompt(category: string, difficulty: string): string {
    const categoryPrompt = FACT_PROMPTS[category as keyof typeof FACT_PROMPTS] || FACT_PROMPTS.general
    const difficultyContext = DIFFICULTY_CONTEXTS[difficulty as keyof typeof DIFFICULTY_CONTEXTS]
    
    return `${categoryPrompt} ${category}. The fact should be ${difficultyContext}. Please provide a single, interesting, and verified fact (2-3 sentences maximum):`
  }

  private createDetailedPrompt(category: string, difficulty: string): string {
    return `Generate a fascinating and educational fact about ${category}. 
    
Requirements:
- Difficulty level: ${difficulty}
- Length: 2-3 sentences
- Must be factually accurate and verifiable
- Include an interesting detail that most people don't know
- Make it engaging and memorable

Please provide only the fact text, no additional explanation.`
  }

  private processHuggingFaceResponse(data: any, category: string, difficulty: string): any {
    const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text
    
    return {
      id: `hf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text?.trim() || 'Unable to generate fact at this time.',
      category: category,
      source: 'Hugging Face AI',
      verified: false,
      likes: 0,
      createdAt: new Date().toISOString(),
      metadata: {
        confidence: 0.7,
        readingTime: Math.ceil(text?.split(' ').length / 200 * 60) || 30,
        complexity: difficulty,
        aiGenerated: true
      }
    }
  }

  private processGeminiResponse(data: any, category: string, difficulty: string): any {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate fact at this time.'
    
    return {
      id: `gemini_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      category: category,
      source: 'Google Gemini AI',
      verified: false,
      likes: 0,
      createdAt: new Date().toISOString(),
      metadata: {
        confidence: 0.85,
        readingTime: Math.ceil(text.split(' ').length / 200 * 60),
        complexity: difficulty,
        aiGenerated: true
      }
    }
  }

  private async analyzeSentiment(text: string): Promise<string> {
    // Simplified sentiment analysis
    const positiveWords = ['amazing', 'incredible', 'fascinating', 'wonderful', 'remarkable']
    const negativeWords = ['dangerous', 'deadly', 'harmful', 'destructive', 'terrible']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  private calculateComplexity(text: string): number {
    // Simple complexity calculation based on sentence length and word length
    const words = text.split(' ')
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
    const sentences = text.split(/[.!?]/).length
    const avgSentenceLength = words.length / sentences
    
    // Normalize to 0-1 scale
    return Math.min(1, (avgWordLength * 0.1 + avgSentenceLength * 0.05) / 2)
  }

  private calculateReadability(text: string): number {
    // Simplified readability score
    const words = text.split(' ').length
    const sentences = text.split(/[.!?]/).length
    const avgWordsPerSentence = words / sentences
    
    // Lower score for shorter sentences (more readable)
    return Math.max(0, Math.min(1, 1 - (avgWordsPerSentence - 10) / 20))
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5)
  }

  private generateRelatedTopics(text: string): string[] {
    // Simple related topics generation based on keywords
    const keywords = this.extractKeywords(text)
    const topicMap: Record<string, string[]> = {
      'space': ['astronomy', 'planets', 'stars', 'galaxies'],
      'ocean': ['marine biology', 'sea creatures', 'water'],
      'animal': ['biology', 'wildlife', 'nature'],
      'plant': ['botany', 'nature', 'environment'],
      'human': ['anatomy', 'biology', 'health'],
      'earth': ['geology', 'environment', 'climate']
    }
    
    const topics: string[] = []
    keywords.forEach(keyword => {
      Object.entries(topicMap).forEach(([key, values]) => {
        if (keyword.includes(key)) {
          topics.push(...values)
        }
      })
    })
    
    return [...new Set(topics)].slice(0, 3)
  }
}

export default AIService.getInstance()
