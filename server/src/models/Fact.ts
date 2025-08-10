import mongoose, { Schema, Document } from 'mongoose'

export interface IFact extends Document {
  text: string
  category: string
  source?: string
  verified: boolean
  likes: number
  createdAt: Date
  updatedAt: Date
  metadata?: {
    confidence: number
    readingTime: number
    complexity: 'easy' | 'medium' | 'hard'
    aiGenerated?: boolean
    keywords?: string[]
    relatedTopics?: string[]
  }
  reports?: Array<{
    reason: string
    reportedAt: Date
    resolved: boolean
  }>
}

const FactSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'science', 'history', 'nature', 'space', 'technology',
      'animals', 'geography', 'culture', 'mathematics', 'food', 'general'
    ],
    index: true
  },
  source: {
    type: String,
    default: 'FactVerse AI'
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  metadata: {
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    readingTime: {
      type: Number,
      min: 1,
      default: 30
    },
    complexity: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    aiGenerated: {
      type: Boolean,
      default: true
    },
    keywords: [{
      type: String,
      trim: true
    }],
    relatedTopics: [{
      type: String,
      trim: true
    }]
  },
  reports: [{
    reason: {
      type: String,
      required: true,
      trim: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  versionKey: false
})

// Create text index for search functionality
FactSchema.index({
  text: 'text',
  'metadata.keywords': 'text'
})

// Compound indexes for common queries
FactSchema.index({ category: 1, verified: 1 })
FactSchema.index({ category: 1, likes: -1 })
FactSchema.index({ createdAt: -1 })
FactSchema.index({ likes: -1, createdAt: -1 })

// Virtual for fact ID
FactSchema.virtual('id').get(function(this: IFact) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})

// Ensure virtual fields are serialized
FactSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id
    // Type assertion to fix TypeScript error
    delete (ret as any).__v
    return ret
  }
})

// Pre-save middleware
FactSchema.pre('save', function(this: IFact, next) {
  // Update reading time based on text length
  if (this.isModified('text')) {
    const wordsPerMinute = 200
    const words = this.text.split(' ').length
    if (!this.metadata) {
      this.metadata = {
        confidence: 0.8,
        readingTime: 30,
        complexity: 'medium'
      }
    }
    this.metadata.readingTime = Math.ceil((words / wordsPerMinute) * 60) // in seconds
  }
  next()
})

// Static methods
FactSchema.statics.findByCategory = function(category: string) {
  return this.find({ category }).sort({ createdAt: -1 })
}

FactSchema.statics.findTrending = function(limit: number = 10) {
  return this.find({ verified: true })
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit)
}

FactSchema.statics.getRandomFact = function(category?: string) {
  const match = category ? { category } : {}
  return this.aggregate([
    { $match: match },
    { $sample: { size: 1 } }
  ])
}

FactSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgLikes: { $avg: '$likes' },
        verified: { $sum: { $cond: ['$verified', 1, 0] } }
      }
    },
    {
      $sort: { count: -1 }
    }
  ])
}

// Instance methods
FactSchema.methods.incrementLikes = function() {
  this.likes += 1
  return this.save()
}

FactSchema.methods.addReport = function(reason: string) {
  this.reports = this.reports || []
  this.reports.push({
    reason,
    reportedAt: new Date(),
    resolved: false
  })
  return this.save()
}

FactSchema.methods.markReportResolved = function(reportIndex: number) {
  if (this.reports && this.reports[reportIndex]) {
    this.reports[reportIndex].resolved = true
    return this.save()
  }
  throw new Error('Report not found')
}

export default mongoose.model<IFact>('Fact', FactSchema)
