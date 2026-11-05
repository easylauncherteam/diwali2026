import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { soundEngine } from '../../audio/soundEngine'

export default function GrandDiwaliCelebrationModal({
  isOpen,
  onClose,
  onExplorePatakas,
  onReplayStory
}) {
  useEffect(() => {
    if (isOpen) {
      // Play powerful sacred shankhnaad sound
      soundEngine.init()
      soundEngine.playShankh()

      // Followed by grand English greeting voiceover
      setTimeout(() => {
        soundEngine.speakEnglish('Wishing you all a very Happy and Prosperous Diwali! Victory of light over darkness! Jai Shri Ram!')
      }, 1600)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(30, 8, 4, 0.88) 0%, rgba(5, 2, 8, 0.96) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '1.0rem',
        pointerEvents: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel ornate-border"
          style={{
            maxWidth: '820px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.0rem, 3vw, 2.0rem)',
            textAlign: 'center',
            position: 'relative',
            border: '2px solid rgba(255, 215, 0, 0.6)',
            boxShadow: '0 0 80px rgba(255, 160, 0, 0.4), inset 0 0 40px rgba(255, 215, 0, 0.15)'
          }}
        >
          {/* Close / Minimize button in top corner */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.4rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: '#FFD700',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close"
          >
            ✕
          </button>

          {/* Glowing Holy Diya Icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ fontSize: '3.8rem', marginBottom: '0.6rem' }}
          >
            🪔
          </motion.div>

          {/* Huge Golden 3D Text: "HAPPY DIWALI" */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-cinzel gold-gradient-text"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.8rem)',
              lineHeight: 1.05,
              margin: '0.2rem 0',
              fontWeight: 900,
              letterSpacing: '2px',
              filter: 'drop-shadow(0 0 35px rgba(255, 215, 0, 0.8))'
            }}
          >
            HAPPY DIWALI
          </motion.h1>

          {/* Sacred Victory Inscription */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="gold-glow-text"
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              color: '#FFF2A1',
              margin: '0.6rem 0',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            "Victory of Truth over Falsehood • Triumph of Light over Darkness"
          </motion.p>

          {/* Saffron Jai Shri Ram Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 2.0rem',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, rgba(230,81,0,0.5), rgba(255,145,0,0.5))',
              border: '2px solid rgba(255, 152, 0, 0.8)',
              boxShadow: '0 0 35px rgba(230, 81, 0, 0.6)',
              margin: '0.6rem 0 1.4rem'
            }}
          >
            <span
              className="saffron-glow-text"
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)',
                fontWeight: 800,
                letterSpacing: '1px'
              }}
            >
              JAI SHRI RAM 🚩
            </span>
          </motion.div>

          {/* Spoken Greeting Quote */}
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
            color: '#FFE082',
            fontWeight: 500,
            marginBottom: '1.8rem',
            lineHeight: 1.5
          }}>
            "Wishing you all a very Happy and Prosperous Diwali! May the divine light of Lord Ram bring peace, prosperity, and joy into your life!"
          </p>

          {/* Celebration Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.0rem',
            marginTop: '0.5rem'
          }}>
            <button
              onClick={() => {
                onExplorePatakas()
                onClose()
              }}
              className="gold-btn ornate-border"
              style={{
                padding: '0.85rem 1.8rem',
                borderRadius: '50px',
                fontSize: '1.0rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 700
              }}
            >
              <span>💥</span>
              <span>3D Crackers Arena (Burn Patakas)</span>
              <span>🔥</span>
            </button>

            <button
              onClick={() => {
                onReplayStory()
                onClose()
              }}
              className="glass-panel"
              style={{
                padding: '0.85rem 1.8rem',
                borderRadius: '50px',
                fontSize: '0.98rem',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600
              }}
            >
              <span>🎬</span>
              <span>Replay Ramayana Story</span>
            </button>

            <button
              onClick={onClose}
              className="glass-panel"
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: '50px',
                fontSize: '0.98rem',
                color: '#FFF2A1',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>✨</span>
              <span>Explore Ayodhya</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
