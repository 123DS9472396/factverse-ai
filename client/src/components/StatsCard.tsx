import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  description?: string
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description
}) => {
  return (
    <motion.div
      className="glassmorphism p-6 rounded-xl hover:scale-105 transition-transform duration-300"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${color} bg-opacity-20 border border-opacity-30`}
        >
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-300 opacity-80">{description}</p>
      )}
    </motion.div>
  )
}

export default StatsCard
