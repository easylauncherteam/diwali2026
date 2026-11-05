import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RAMAYANA_SCENES } from '../../data/ramayanaStoryData'
import { soundEngine } from '../../audio/soundEngine'

export default function RamayanaStoryOverlay({
  currentSceneIndex,
  onSelectScene,
  onNextScene,
  onPrevScene,
  onSkipToFinale,
  useDashrathFarewell = false,
  setUseDashrathFarewell
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [progressTime, setProgressTime] = useState(0)

  const activeScene = RAMAYANA_SCENES[currentSceneIndex] || RAMAYANA_SCENES[0]

  // Play voiceover & theme music on scene change
  useEffect(() => {
    setProgressTime(0)

    // Play scene procedural background music
    soundEngine.playSceneTheme(currentSceneIndex)

    // Speak Hindi narration
    soundEngine.speakHindi(activeScene.narration, () => {
      if (autoAdvance) {
        setTimeout(() => {
          if (currentSceneIndex < RAMAYANA_SCENES.length - 1) {
            onNextScene()
          } else {
            onSkipToFinale()
          }
        }, 1200)
      }
    })

    return () => {
      soundEngine.stopSpeech()
    }
  }, [currentSceneIndex])

  // Auto-advance visual timer bar
  useEffect(() => {
    if (!autoAdvance) return
    const durationSec = 10
    const stepMs = 100
    const interval = setInterval(() => {
      setProgressTime((prev) => {
        if (prev >= durationSec) return durationSec
        return prev + stepMs / 1000
      })
    }, stepMs)

    return () => clearInterval(interval)
  }, [currentSceneIndex, autoAdvance])

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute()
    setIsMuted(muted)
  }

  const handleReplayNarration = () => {
    soundEngine.speakHindi(activeScene.narration)
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.2rem',
      zIndex: 20
    }}>
      {/* ======================================================== */}
      {/* ULTRA-MINIMAL TOP BAR (ONLY DISCREET SOUND & SCENE BADGE) */}
      {/* ======================================================== */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        pointerEvents: 'auto'
      }}>
        {/* Subtle Scene Badge */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          padding: '0.35rem 0.95rem',
          borderRadius: '20px',
          color: '#FFE082',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🪔</span>
          <span>{activeScene.episode}</span>
        </div>

        {/* Minimal Audio & Scene 1 Switcher */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {currentSceneIndex === 0 && activeScene.alternateImage && (
            <button
              onClick={() => {
                if (setUseDashrathFarewell) {
                  setUseDashrathFarewell(!useDashrathFarewell)
                }
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: '#FFF2A1',
                borderRadius: '20px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
                backdropFilter: 'blur(8px)'
              }}
            >
              {useDashrathFarewell ? 'वनवास प्रस्थान दृश्य 🔄' : 'दशरथ विदाई दृश्य 🔄'}
            </button>
          )}

          {/* Discreet Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: isMuted ? '1px solid rgba(239, 83, 80, 0.5)' : '1px solid rgba(255, 215, 0, 0.5)',
              color: isMuted ? '#EF5350' : '#FFD700',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>{isMuted ? '🔇 Muted' : '🔊 Sound ON'}</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* SLEEK CINEMATIC SUBTITLE BAR (LOWER THIRD, FULL VIEW) */}
      {/* ======================================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScene.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            margin: 'auto auto 0.5rem auto',
            maxWidth: '920px',
            width: '100%',
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(12, 16, 32, 0.82) 0%, rgba(5, 8, 20, 0.92) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '22px',
              padding: '1.2rem 1.6rem',
              border: '1.5px solid rgba(255, 215, 0, 0.45)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 160, 0, 0.2)'
            }}
          >
            {/* Scene Golden Title & Voice Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.6rem'
            }}>
              <div>
                <h2
                  className="font-devanagari-royal gold-gradient-text"
                  style={{
                    fontSize: 'clamp(1.4rem, 3.0vw, 2.1rem)',
                    lineHeight: 1.15,
                    margin: 0,
                    filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.5))'
                  }}
                >
                  {activeScene.titleHindi}
                </h2>
                <p style={{
                  fontSize: '0.78rem',
                  color: '#FFB74D',
                  margin: '0.15rem 0 0',
                  fontWeight: 500
                }}>
                  {activeScene.titleEnglish} • {activeScene.environment}
                </p>
              </div>

              {/* Replay Narration Voice Button */}
              <button
                onClick={handleReplayNarration}
                style={{
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  borderRadius: '16px',
                  color: '#FFE082',
                  padding: '0.28rem 0.8rem',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <span>🎙️</span>
                <span>स्वर पुनः सुनें (Replay Voice)</span>
              </button>
            </div>

            {/* Main Scene Content: Cinematic Image Card + Sacred Narration */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '1.2rem',
              alignItems: 'center',
              margin: '0.6rem 0 0.8rem 0'
            }}>
              {/* Cinematic Scene Artwork Card */}
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '185px',
                border: '1.5px solid rgba(255, 215, 0, 0.45)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 215, 0, 0.15)',
                background: 'rgba(0, 0, 0, 0.6)'
              }}>
                <img
                  src={(currentSceneIndex === 0 && useDashrathFarewell && activeScene.alternateImage) ? activeScene.alternateImage : activeScene.image}
                  alt={activeScene.titleHindi}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'brightness(1.04) contrast(1.05)',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)' }}
                />

                {/* Cinematic Badge Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '10px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  color: '#FFE082',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span>🎬</span>
                  <span>{activeScene.episode}</span>
                </div>

                {/* Scene 1 Artwork Variation Switcher Pill */}
                {currentSceneIndex === 0 && activeScene.alternateImage && (
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '0.35rem'
                  }}>
                    <button
                      onClick={() => setUseDashrathFarewell && setUseDashrathFarewell(true)}
                      style={{
                        background: useDashrathFarewell ? 'linear-gradient(135deg, #FFD700, #FF9800)' : 'rgba(0, 0, 0, 0.75)',
                        color: useDashrathFarewell ? '#120800' : '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.5)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="दशरथ विदाई दृश्य"
                    >
                      विदाई
                    </button>
                    <button
                      onClick={() => setUseDashrathFarewell && setUseDashrathFarewell(false)}
                      style={{
                        background: !useDashrathFarewell ? 'linear-gradient(135deg, #FFD700, #FF9800)' : 'rgba(0, 0, 0, 0.75)',
                        color: !useDashrathFarewell ? '#120800' : '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.5)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="वनवास गमन दृश्य"
                    >
                      वनवास
                    </button>
                  </div>
                )}
              </div>

              {/* Sacred Narration & Subtitle */}
              <div>
                <p
                  className="font-devanagari-festive gold-glow-text"
                  style={{
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                    lineHeight: 1.4,
                    margin: '0 0 0.4rem 0',
                    color: '#FFF9C4'
                  }}
                >
                  "{activeScene.narration}"
                </p>

                <p style={{
                  fontSize: '0.82rem',
                  color: '#FFE082',
                  opacity: 0.88,
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.35
                }}>
                  {activeScene.narrationEnglish}
                </p>
              </div>
            </div>

            {/* Progress Timer Line */}
            <div style={{
              width: '100%',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '0.8rem'
            }}>
              <div style={{
                width: `${(progressTime / 10) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #FFD700, #FF6D00)',
                transition: 'width 0.1s linear'
              }} />
            </div>

            {/* Navigation Buttons: Previous, Auto Toggle, Next */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem'
            }}>
              <button
                onClick={onPrevScene}
                disabled={currentSceneIndex === 0}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: currentSceneIndex === 0 ? 'rgba(255,255,255,0.25)' : '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  cursor: currentSceneIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: 600
                }}
              >
                ◀ पिछला (Previous)
              </button>

              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                style={{
                  padding: '0.5rem 1.0rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: autoAdvance ? '#00E676' : '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                {autoAdvance ? '⏱️ Auto Next: ON' : '⏸️ Auto Next: OFF'}
              </button>

              <button
                onClick={onNextScene}
                className="gold-btn"
                style={{
                  padding: '0.5rem 1.4rem',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>{currentSceneIndex === RAMAYANA_SCENES.length - 1 ? 'भव्य दीपोत्सव 🎆' : 'अगला दृश्य ▶'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 6-STAGE TIMELINE DOTS / PILLS AT VERY BOTTOM */}
      {/* ======================================================== */}
      <footer style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        pointerEvents: 'auto'
      }}>
        <div
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          {RAMAYANA_SCENES.map((scene, idx) => {
            const isActive = currentSceneIndex === idx
            return (
              <button
                key={scene.id}
                onClick={() => onSelectScene(idx)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #FFD700, #FF9800)'
                    : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#120800' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1px solid #FFE082' : 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  transition: 'all 0.25s'
                }}
              >
                <span>{idx + 1}. {scene.titleHindi.split('–')[0].trim()}</span>
              </button>
            )
          })}
        </div>
      </footer>
    </div>
  )
}
