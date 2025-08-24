export interface FactMetadata {
  confidence: number;
  readingTime: number;
  complexity: 'easy' | 'medium' | 'hard';
}

export interface UserActivity {
  type: 'view' | 'save' | 'like' | 'report';
  factId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsProperties {
  userId?: string;
  source?: string;
  category?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  factViews: number;
  topCategories: Array<{ category: string; count: number }>;
  userRetention: number;
  timeRange: string;
}

export interface AIInsights {
  popularTopics: string[];
  trendingCategories: Array<{ category: string; growth: number }>;
  userPreferences: Record<string, number>;
  contentQuality: {
    accuracy: number;
    engagement: number;
    diversity: number;
  };
}
