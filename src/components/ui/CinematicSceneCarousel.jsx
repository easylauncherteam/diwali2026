import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RAMAYANA_SCENES } from '../../data/ramayanaStoryData'
import { soundEngine } from '../../audio/soundEngine'

export default function CinematicSceneCarousel({
  currentSceneIndex = 0,
  onSelectScene,
  onNextScene,
  onPrevScene,
  onSkipToFinale,
  useDashrathFarewell = false,
  setUseDashrathFarewell
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Responsive Screen Dimensions Hook
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = dimensions.width < 768
  const isSmallMobile = dimensions.width < 420
  const isShortScreen = dimensions.height < 680

  const totalScenes = RAMAYANA_SCENES.length
  const activeScene = RAMAYANA_SCENES[currentSceneIndex] || RAMAYANA_SCENES[0]

  // Play Hindi narration & audio theme when active scene changes
  useEffect(() => {
    setIsSpeaking(true)
    soundEngine.playSceneTheme(currentSceneIndex)
    soundEngine.speakHindi(activeScene.narration, () => {
      setIsSpeaking(false)
    })

    return () => {
      soundEngine.stopSpeech()
    }
  }, [currentSceneIndex])

  // Keyboard navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        onNext()
      } else if (e.key === 'ArrowLeft') {
        onPrev()
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSceneIndex, isLightboxOpen])

  const onNext = useCallback(() => {
    soundEngine.init()
    soundEngine.playTempleBell(1.15)
    if (currentSceneIndex < totalScenes - 1) {
      onSelectScene(currentSceneIndex + 1)
    } else {
      onSkipToFinale()
    }
  }, [currentSceneIndex, totalScenes, onSelectScene, onSkipToFinale])

  const onPrev = useCallback(() => {
    soundEngine.init()
    soundEngine.playTempleBell(0.95)
    if (currentSceneIndex > 0) {
      onSelectScene(currentSceneIndex - 1)
    }
  }, [currentSceneIndex, onSelectScene])

  // Responsive swipe drag threshold
  const handleDragEnd = (e, info) => {
    const threshold = isMobile ? 35 : 55
    if (info.offset.x < -threshold) {
      onNext()
    } else if (info.offset.x > threshold) {
      onPrev()
    }
  }

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute()
    setIsMuted(muted)
  }

  const handleReplayNarration = () => {
    soundEngine.speakHindi(activeScene.narration, () => {
      setIsSpeaking(false)
    })
    setIsSpeaking(true)
  }

  // Active scene image helper
  const getSceneImage = (idx) => {
    const scene = RAMAYANA_SCENES[idx]
    if (!scene) return ''
    if (idx === 0 && useDashrathFarewell && scene.alternateImage) {
      return scene.alternateImage
    }
    return scene.image
  }

  const activeImageSrc = getSceneImage(currentSceneIndex)

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
      padding: isMobile ? '0.6rem 0.6rem 0.8rem 0.6rem' : '1.0rem 1.4rem',
      zIndex: 20,
      pointerEvents: 'none',
      userSelect: 'none',
      overflow: 'hidden'
    }}>
      {/* ======================================================== */}
      {/* 3D COVERFLOW CAROUSEL STAGE (RESPONSIVE 16:9 VIEW)       */}
      {/* ======================================================== */}
      <div style={{
        position: 'relative',
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: isMobile ? '900px' : '1400px',
        pointerEvents: 'auto',
        margin: isMobile ? '0.4rem 0' : '0.6rem 0',
        overflow: 'visible'
      }}>
        {/* Floating Left Arrow Button (Move Back) */}
        <button
          onClick={onPrev}
          disabled={currentSceneIndex === 0}
          style={{
            position: 'absolute',
            left: isMobile ? '4px' : 'clamp(1rem, 3.5vw, 2.8rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 45,
            background: 'radial-gradient(circle, rgba(25, 30, 60, 0.9) 0%, rgba(5, 8, 22, 0.95) 100%)',
            border: isMobile ? '1.5px solid rgba(255, 215, 0, 0.6)' : '2px solid rgba(255, 215, 0, 0.55)',
            color: currentSceneIndex === 0 ? 'rgba(255,255,255,0.2)' : '#FFD700',
            width: isMobile ? '38px' : 'clamp(46px, 4.8vw, 62px)',
            height: isMobile ? '38px' : 'clamp(46px, 4.8vw, 62px)',
            borderRadius: '50%',
            cursor: currentSceneIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: isMobile ? '1.1rem' : 'clamp(1.3rem, 2vw, 1.8rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85), 0 0 20px rgba(255, 215, 0, 0.3)',
            transition: 'all 0.2s',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          title="Previous Scene (Left Arrow)"
          aria-label="Previous Scene"
        >
          ❮
        </button>

        {/* Floating Right Arrow Button (Move Front) */}
        <button
          onClick={onNext}
          style={{
            position: 'absolute',
            right: isMobile ? '4px' : 'clamp(1rem, 3.5vw, 2.8rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 45,
            background: 'radial-gradient(circle, rgba(25, 30, 60, 0.9) 0%, rgba(5, 8, 22, 0.95) 100%)',
            border: isMobile ? '1.5px solid rgba(255, 215, 0, 0.6)' : '2px solid rgba(255, 215, 0, 0.55)',
            color: '#FFD700',
            width: isMobile ? '38px' : 'clamp(46px, 4.8vw, 62px)',
            height: isMobile ? '38px' : 'clamp(46px, 4.8vw, 62px)',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: isMobile ? '1.1rem' : 'clamp(1.3rem, 2vw, 1.8rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85), 0 0 20px rgba(255, 215, 0, 0.3)',
            transition: 'all 0.2s',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          title="Next Scene (Right Arrow)"
          aria-label="Next Scene"
        >
          ❯
        </button>

        {/* 3D Carousel Cards Stage - Locked to 16:9 Aspect Ratio */}
        <div style={{
          position: 'relative',
          width: isMobile
            ? (isSmallMobile ? 'calc(100vw - 20px)' : 'min(93vw, 440px)')
            : 'clamp(560px, 62vw, 920px)',
          aspectRatio: '16 / 9',
          maxHeight: isMobile
            ? (isShortScreen ? '220px' : '260px')
            : (isShortScreen ? '380px' : '520px'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {RAMAYANA_SCENES.map((scene, idx) => {
            const offset = idx - currentSceneIndex
            const isCenter = offset === 0
            const absOffset = Math.abs(offset)

            // Hide cards that are far away for optimal rendering
            if (absOffset > 2) return null

            // CoverFlow 3D Transformation Math adapted for Mobile vs Laptop
            const xPercent = isMobile ? offset * 26 : offset * 48
            const zDistance = isMobile ? -absOffset * 90 : -absOffset * 160
            const scale = isMobile ? (1 - absOffset * 0.14) : (1 - absOffset * 0.18)
            const rotateY = isMobile ? offset * -15 : offset * -25
            const opacity = isCenter ? 1 : (isMobile ? 0.32 : 0.48)

            const imgSrc = getSceneImage(idx)

            return (
              <motion.div
                key={scene.id}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.22}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!isCenter) {
                    onSelectScene(idx)
                  }
                }}
                initial={false}
                animate={{
                  x: `${xPercent}%`,
                  z: zDistance,
                  scale: scale,
                  rotateY: rotateY,
                  opacity: opacity
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 28
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: isMobile ? '16px' : '22px',
                  overflow: 'hidden',
                  cursor: isCenter ? 'grab' : 'pointer',
                  zIndex: 30 - absOffset * 10,
                  border: isCenter
                    ? '2.5px solid #FFD700'
                    : '1px solid rgba(255, 215, 0, 0.35)',
                  boxShadow: isCenter
                    ? '0 18px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 179, 0, 0.35)'
                    : '0 8px 25px rgba(0, 0, 0, 0.7)',
                  background: '#040714',
                  transformStyle: 'preserve-3d'
                }}
                whileHover={!isCenter ? { opacity: 0.75, scale: scale * 1.03 } : {}}
              >
                {/* Scene Artwork Image (16:9 Edge-to-Edge) */}
                <img
                  src={imgSrc}
                  alt={scene.titleEnglish}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    pointerEvents: 'none'
                  }}
                />

                {/* Subtle Cinematic Vignette */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: isCenter
                    ? 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.45) 100%)'
                    : 'rgba(4, 7, 20, 0.55)',
                  pointerEvents: 'none'
                }} />

                {/* Card Title Label (Bottom Overlay) */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: isMobile ? '0.6rem 0.8rem' : '1.0rem 1.4rem',
                  background: 'linear-gradient(to top, rgba(2, 4, 12, 0.95) 0%, rgba(2, 4, 12, 0.6) 60%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  pointerEvents: 'none'
                }}>
                  <div>
                    <span style={{
                      color: '#FFD54F',
                      fontSize: isMobile ? '0.66rem' : '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.4px',
                      textTransform: 'uppercase'
                    }}>
                      {scene.episode}
                    </span>
                    <h3 className="gold-gradient-text" style={{
                      fontSize: isCenter
                        ? (isMobile ? 'clamp(1.0rem, 3.8vw, 1.3rem)' : 'clamp(1.2rem, 2.2vw, 1.7rem)')
                        : (isMobile ? '0.85rem' : '1.05rem'),
                      margin: '0.15rem 0 0 0',
                      lineHeight: 1.2,
                      fontWeight: 700
                    }}>
                      {scene.titleEnglish}
                    </h3>
                  </div>

                  {!isCenter && (
                    <span style={{
                      background: 'rgba(255, 215, 0, 0.22)',
                      padding: isMobile ? '0.18rem 0.45rem' : '0.25rem 0.65rem',
                      borderRadius: '10px',
                      fontSize: isMobile ? '0.62rem' : '0.72rem',
                      color: '#FFE082',
                      border: '1px solid rgba(255, 215, 0, 0.4)'
                    }}>
                      Click to View 👆
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LOWER CINEMATIC SUBTITLE & STORY CONTROLS ROW         */}
      {/* ======================================================== */}
      <div style={{
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        pointerEvents: 'auto',
        zIndex: 35
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, rgba(12, 16, 32, 0.92) 0%, rgba(5, 8, 20, 0.96) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: isMobile ? '16px' : '20px',
              padding: isMobile
                ? (isShortScreen ? '0.5rem 0.75rem' : '0.65rem 0.95rem')
                : '0.9rem 1.5rem',
              border: '1.4px solid rgba(255, 215, 0, 0.42)',
              boxShadow: '0 10px 32px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 160, 0, 0.18)'
            }}
          >
            {/* Title & Controls Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.35rem',
              marginBottom: '0.2rem'
            }}>
              <div>
                <h2
                  className="font-devanagari-royal gold-gradient-text"
                  style={{
                    fontSize: isMobile ? 'clamp(1.15rem, 4.0vw, 1.45rem)' : 'clamp(1.35rem, 2.4vw, 1.9rem)',
                    lineHeight: 1.2,
                    margin: 0,
                    fontWeight: 800,
                    letterSpacing: '0.3px'
                  }}
                >
                  {activeScene.titleHindi}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <button
                  onClick={handleToggleMute}
                  style={{
                    background: 'rgba(255, 215, 0, 0.12)',
                    border: isMuted ? '1px solid rgba(239, 83, 80, 0.6)' : '1px solid rgba(255, 215, 0, 0.35)',
                    borderRadius: '16px',
                    color: isMuted ? '#EF5350' : '#FFD700',
                    padding: isMobile ? '0.2rem 0.55rem' : '0.22rem 0.75rem',
                    fontSize: isMobile ? '0.7rem' : '0.76rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer'
                  }}
                  title="Toggle Audio Sound"
                >
                  <span>{isMuted ? '🔇' : '🔊'}</span>
                  <span>{isMuted ? 'Muted' : 'Sound'}</span>
                </button>

                <button
                  onClick={handleReplayNarration}
                  style={{
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.45)',
                    borderRadius: '16px',
                    color: '#FFE082',
                    padding: isMobile ? '0.2rem 0.55rem' : '0.22rem 0.75rem',
                    fontSize: isMobile ? '0.7rem' : '0.76rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>🎙️</span>
                  <span>{isSpeaking ? 'Narrating...' : (isMobile ? 'Replay' : 'Replay Narration')}</span>
                </button>
              </div>
            </div>

            {/* Sacred Hindi Narration Quote */}
            <p
              className="font-devanagari-royal gold-glow-text"
              style={{
                fontSize: isMobile ? 'clamp(0.92rem, 3.4vw, 1.15rem)' : 'clamp(1.1rem, 2.0vw, 1.35rem)',
                lineHeight: 1.45,
                margin: '0.15rem 0',
                color: '#FFF9C4',
                fontWeight: 600,
                letterSpacing: '0.2px'
              }}
            >
              "{activeScene.narration}"
            </p>

            {/* English translation as clean secondary line */}
            {!isShortScreen && (
              <p style={{
                fontSize: isMobile ? '0.74rem' : '0.84rem',
                color: '#FFE082',
                opacity: 0.82,
                margin: '0 0 0.55rem 0',
                lineHeight: 1.28
              }}>
                {activeScene.narrationEnglish}
              </p>
            )}

            {/* Bottom Controls Row: Previous | 6 Stage Dots | Next */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.4rem',
              marginTop: isShortScreen ? '0.2rem' : '0'
            }}>
              <button
                onClick={onPrev}
                disabled={currentSceneIndex === 0}
                style={{
                  padding: isMobile ? '0.32rem 0.75rem' : '0.42rem 1.0rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: currentSceneIndex === 0 ? 'rgba(255,255,255,0.25)' : '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  cursor: currentSceneIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: isMobile ? '0.74rem' : '0.82rem',
                  fontWeight: 600
                }}
              >
                ◀ Previous
              </button>

              {/* 6 Stage Timeline Dots */}
              <div style={{ display: 'flex', gap: isMobile ? '0.28rem' : '0.4rem', alignItems: 'center' }}>
                {RAMAYANA_SCENES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectScene(idx)}
                    style={{
                      width: currentSceneIndex === idx ? (isMobile ? '20px' : '26px') : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: currentSceneIndex === idx ? '#FFD700' : 'rgba(255, 255, 255, 0.25)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s'
                    }}
                    title={`Scene ${idx + 1}`}
                    aria-label={`Jump to scene ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={onNext}
                className="gold-btn"
                style={{
                  padding: isMobile ? '0.34rem 0.95rem' : '0.42rem 1.3rem',
                  borderRadius: '12px',
                  fontSize: isMobile ? '0.76rem' : '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{currentSceneIndex === totalScenes - 1 ? 'शुभ दीपावली (Shubh Deepawali) 🪔' : 'Next Scene ▶'}</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* 4. FULLSCREEN HIGH-RESOLUTION LIGHTBOX MODAL             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100dvh',
              zIndex: 120,
              background: 'rgba(2, 4, 12, 0.96)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: isMobile ? '1.0rem 0.8rem' : '1.5rem 2.0rem',
              pointerEvents: 'auto'
            }}
          >
            {/* Lightbox Top Header */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: '#FFD700', fontWeight: 700, fontSize: isMobile ? '0.85rem' : '1.0rem' }}>
                🪔 {activeScene.episode} – {activeScene.titleEnglish}
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
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
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0.8rem 0'
            }}>
              {/* Previous Lightbox Arrow */}
              <button
                onClick={onPrev}
                disabled={currentSceneIndex === 0}
                style={{
                  position: 'absolute',
                  left: isMobile ? '0px' : '20px',
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.65)',
                  border: '1.5px solid rgba(255, 215, 0, 0.5)',
                  color: currentSceneIndex === 0 ? 'rgba(255,255,255,0.2)' : '#FFD700',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  fontSize: '1.4rem',
                  cursor: currentSceneIndex === 0 ? 'not-allowed' : 'pointer'
                }}
                aria-label="Previous Image"
              >
                ❮
              </button>

              <motion.img
                key={activeImageSrc}
                src={activeImageSrc}
                alt={activeScene.titleEnglish}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: '96vw',
                  maxHeight: '75vh',
                  aspectRatio: '16 / 9',
                  objectFit: 'contain',
                  borderRadius: isMobile ? '14px' : '20px',
                  border: '2px solid rgba(255, 215, 0, 0.55)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 179, 0, 0.3)'
                }}
              />

              {/* Next Lightbox Arrow */}
              <button
                onClick={onNext}
                style={{
                  position: 'absolute',
                  right: isMobile ? '0px' : '20px',
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.65)',
                  border: '1.5px solid rgba(255, 215, 0, 0.5)',
                  color: '#FFD700',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  fontSize: '1.4rem',
                  cursor: 'pointer'
                }}
                aria-label="Next Image"
              >
                ❯
              </button>
            </div>

            {/* Lightbox Caption */}
            <div style={{
              textAlign: 'center',
              maxWidth: '820px',
              padding: '0.4rem 1.0rem'
            }}>
              <p className="font-devanagari-royal gold-glow-text" style={{
                fontSize: isMobile ? '0.98rem' : '1.25rem',
                margin: '0 0 0.25rem 0',
                lineHeight: 1.45,
                fontWeight: 600,
                color: '#FFF9C4'
              }}>
                "{activeScene.narration}"
              </p>
              <p style={{
                fontSize: isMobile ? '0.74rem' : '0.86rem',
                color: '#FFE082',
                opacity: 0.85,
                margin: 0
              }}>
                {activeScene.narrationEnglish}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
