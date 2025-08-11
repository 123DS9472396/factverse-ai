import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase environment variables')
  process.exit(1)
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('facts').select('count', { count: 'exact', head: true })
    if (error) throw error
    logger.info('✅ Supabase connected successfully')
    return true
  } catch (error) {
    logger.error('❌ Supabase connection failed:', error)
    return false
  }
}
