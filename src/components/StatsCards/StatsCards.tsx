'use client'


import { motion } from 'framer-motion'
import { TrendingUp, Users, Package } from 'lucide-react'

/**
 * Enhanced StatsCards component displaying key business metrics
 * Modern design with animations, icons, and red theme integration
 */
export function StatsCards() {
  const stats = [
    {
      value: '10+',
      label: 'Години опит',
      icon: TrendingUp,
      delay: 0,
      gradient: 'from-primary/10 to-primary/5'
    },
    {
      value: '50k+',
      label: 'Доволни клиенти',
      icon: Users,
      delay: 0.1,
      gradient: 'from-secondary/10 to-secondary/5'
    },
    {
      value: '100k+',
      label: 'Части на склад',
      icon: Package,
      delay: 0.2,
      gradient: 'from-accent/10 to-accent/5'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  }
  
  return (
    <motion.section 
      className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        
        return (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2 }
            }}
            className={`group relative overflow-hidden rounded-2xl bg-surface backdrop-blur-sm border border-border p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 sm:p-10`}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="relative mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            {/* Value */}
            <motion.p 
              className="relative text-5xl font-black text-primary mb-3 tracking-tight"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: stat.delay + 0.3, duration: 0.4 }}
            >
              {stat.value}
            </motion.p>
            
            {/* Label */}
            <p className="relative text-sm font-medium text-muted-foreground uppercase tracking-wide leading-relaxed">
              {stat.label}
            </p>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        )
      })}
    </motion.section>
  )
} 