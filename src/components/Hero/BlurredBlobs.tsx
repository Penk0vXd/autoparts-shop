'use client'

import { motion } from 'framer-motion'

const blobs = [
  { size: 540, hue: 'bg-primary/20', start: -600, end: 100, delay: 0 },
  { size: 420, hue: 'bg-muted/30', start: 700, end: -200, delay: 5 },
  { size: 480, hue: 'bg-accent/25', start: -300, end: 800, delay: 10 },
]

export default function BlurredBlobs() {
  return (
    <>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          initial={{ x: b.start, y: -120, scale: 1, opacity: 0.7 }}
          animate={{ x: b.end, y: 120, scale: 1.15, opacity: 1 }}
          transition={{
            duration: 40,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
            delay: b.delay,
          }}
          className={`pointer-events-none absolute rounded-full blur-3xl scale-90 sm:scale-100 ${b.hue}`}
          style={{ width: b.size, height: b.size }}
        />
      ))}
    </>
  )
} 