import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RAMAYANA_SCENES } from '../../data/ramayanaStoryData'

export default function CinematicSceneBackdrop({
  currentSceneIndex = 0,
  mode = 'STORY',
  useDashrathFarewell = false
}) {
  if (mode !== 'STORY') return null

  const activeScene = RAMAYANA_SCENES[currentSceneIndex] || RAMAYANA_SCENES[0]

  let imageSrc = activeScene.image
  if (currentSceneIndex === 0 && useDashrathFarewell && activeScene.alternateImage) {
    imageSrc = activeScene.alternateImage
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 0,
      background: '#040714',
      pointerEvents: 'none'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeScene.id}-${imageSrc}`}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Continuous Cinematic Ken Burns Drift */}
          <motion.img
            src={imageSrc}
            alt={activeScene.titleHindi}
            animate={{
              scale: [1.0, 1.05, 1.02],
              x: [0, -8, 6, 0],
              y: [0, -4, 2, 0]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'blur(22px) brightness(0.36) saturate(1.3)',
              transform: 'scale(1.1)'
            }}
          />

          {/* Vignette & Cinematic Shadow Overlay (allows UI/subtitles to pop while artwork shines) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 45%, transparent 40%, rgba(3, 5, 15, 0.45) 80%, rgba(2, 4, 12, 0.85) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Bottom Gradient for Subtitles & Controls */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '55%',
            background: 'linear-gradient(to top, rgba(2, 4, 12, 0.92) 0%, rgba(2, 4, 12, 0.6) 45%, transparent 100%)',
            pointerEvents: 'none'
          }} />

          {/* Top Subtle Gradient for Header */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '25%',
            background: 'linear-gradient(to bottom, rgba(2, 4, 12, 0.85) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
