import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { soundEngine } from '../../audio/soundEngine'

export default function SingleAnaarOverlay({ onBackToStory }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isBurning, setIsBurning] = useState(false)

  // Sync burning state with 3D canvas events
  useEffect(() => {
    const handleStarted = () => setIsBurning(true)
    const handleCompleted = () => setIsBurning(false)

    window.addEventListener('anaar-burn-started', handleStarted)
    window.addEventListener('anaar-burn-complete', handleCompleted)

    return () => {
      window.removeEventListener('anaar-burn-started', handleStarted)
      window.removeEventListener('anaar-burn-complete', handleCompleted)
    }
  }, [])

  const handleLightAnaar = () => {
    soundEngine.init()
    setIsBurning(true)
    window.dispatchEvent(new CustomEvent('reignite-anaar'))
  }

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute()
    setIsMuted(muted)
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.0rem 1.4rem',
      zIndex: 40,
      pointerEvents: 'none',
      userSelect: 'none'
    }}>
      {/* ======================================================== */}
      {/* TOP BAR: BACK BUTTON & TITLE                             */}
      {/* ======================================================== */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        pointerEvents: 'auto'
      }}>
        {/* Back to Story Button */}
        <button
          onClick={onBackToStory}
          style={{
            background: 'rgba(5, 10, 25, 0.82)',
            border: '1.5px solid rgba(255, 215, 0, 0.55)',
            color: '#FFD700',
            borderRadius: '24px',
            padding: '0.45rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            transition: 'all 0.2s'
          }}
          title="Return to the Ramayana 3D Story Mode"
        >
          <span>◀</span>
          <span>Back to Ramayana Story</span>
        </button>

        {/* Center Title Badge */}
        <div style={{
          background: 'rgba(5, 10, 25, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1.2px solid rgba(255, 215, 0, 0.45)',
          padding: '0.4rem 1.1rem',
          borderRadius: '24px',
          color: '#FFE082',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
        }}>
          <span>🌟</span>
          <span>Royal 3D Anaar • शाही अनार</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleMute}
          style={{
            background: 'rgba(5, 10, 25, 0.75)',
            border: isMuted ? '1.2px solid rgba(239, 83, 80, 0.6)' : '1.2px solid rgba(255, 215, 0, 0.45)',
            color: isMuted ? '#EF5350' : '#FFD700',
            borderRadius: '20px',
            padding: '0.38rem 0.95rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}
        >
          {isMuted ? '🔇 Muted' : '🔊 Sound ON'}
        </button>
      </header>

      {/* ======================================================== */}
      {/* BOTTOM CONTROLS: LIGHT ANAAR                             */}
      {/* ======================================================== */}
      <footer style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        width: '100%',
        pointerEvents: 'auto'
      }}>
        {/* Main Action Button - ONLY "Light Anaar" */}
        <motion.button
          onClick={handleLightAnaar}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="gold-btn ornate-border"
          style={{
            padding: '0.85rem 2.2rem',
            borderRadius: '50px',
            fontSize: '1.05rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.7rem',
            boxShadow: '0 8px 30px rgba(255, 152, 0, 0.5)'
          }}
        >
          <span>🔥</span>
          <span>{isBurning ? 'Burning Anaar... ✨' : 'Light Anaar'}</span>
          <span>✨</span>
        </motion.button>

        {/* Friendly Interaction Hint */}
        <p style={{
          margin: 0,
          fontSize: '0.82rem',
          color: '#FFE082',
          opacity: 0.9,
          textShadow: '0 2px 8px rgba(0,0,0,0.9)'
        }}>
          💡 Click on "Light Anaar" or tap the 3D flowerpot to light it!
        </p>
      </footer>
    </div>
  )
}
