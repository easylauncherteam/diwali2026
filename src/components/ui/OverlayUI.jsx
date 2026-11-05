import React, { useState, useEffect } from 'react'
import { soundEngine } from '../../audio/soundEngine'
import { CAMERA_VIEWS } from '../canvas/CameraController'

export default function OverlayUI({
  cameraView,
  setCameraView,
  isFreeOrbit,
  setIsFreeOrbit,
  onCelebrateDiwali,
  onLaunchRocket,
  onOpenCardModal,
  isBarrageActive
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [diyaCount, setDiyaCount] = useState(2512500)
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false)

  // Toggle Sound Mute
  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute()
    setIsMuted(muted)
    if (!muted) {
      soundEngine.startAmbientDrone()
      soundEngine.playTempleBell(1.2)
    } else {
      soundEngine.stopAmbientDrone()
    }
  }

  // Handle Grand Celebration Click
  const handleGrandCelebrate = () => {
    soundEngine.init()
    soundEngine.startAmbientDrone()
    setDiyaCount((prev) => prev + 100000)
    setShowCelebrationBanner(true)
    onCelebrateDiwali()

    setTimeout(() => {
      setShowCelebrationBanner(false)
    }, 6000)
  }

  // Handle Quick Firecracker Actions
  const handleActionAnaar = () => {
    soundEngine.playAnaarSizzle()
    setDiyaCount((prev) => prev + 50)
  }

  const handleActionChakri = () => {
    soundEngine.playChakriWhir()
    setDiyaCount((prev) => prev + 50)
  }

  const handleActionBell = () => {
    soundEngine.playTempleBell(1.0)
    soundEngine.playTempleBell(1.5)
    setDiyaCount((prev) => prev + 108)
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
      zIndex: 10
    }}>
      {/* ======================================================== */}
      {/* TOP BAR: EMBLEM, LIVE DIYA COUNT, AUDIO & PERSPECTIVES */}
      {/* ======================================================== */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem',
        width: '100%'
      }}>
        {/* Ayodhya Emblem */}
        <div
          className="glass-panel ornate-border"
          style={{
            pointerEvents: 'auto',
            padding: '0.6rem 1.2rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          <div className="animate-diya" style={{ fontSize: '1.6rem' }}>🪔</div>
          <div>
            <h1 className="font-devanagari-royal gold-gradient-text" style={{ fontSize: '1.15rem', lineHeight: 1.1, margin: 0 }}>
              अयोध्या दीपोत्सव २०२६
            </h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#FFB74D', letterSpacing: '0.5px' }}>
              श्री राम जन्मभूमि तीर्थ क्षेत्र
            </p>
          </div>
        </div>

        {/* Live Diya Count & Sound Toggle */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {/* Live Lit Diyas Counter */}
          <div
            className="glass-panel"
            style={{
              pointerEvents: 'auto',
              padding: '0.55rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ color: '#FFD700' }}>✨ प्रज्वलित दीप:</span>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              color: '#FFF2A1',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.7)'
            }}>
              {diyaCount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleMute}
            className="glass-panel"
            style={{
              pointerEvents: 'auto',
              padding: '0.55rem 0.9rem',
              borderRadius: '12px',
              cursor: 'pointer',
              color: isMuted ? '#EF5350' : '#FFD700',
              border: isMuted ? '1px solid rgba(239, 83, 80, 0.4)' : '1px solid rgba(255, 215, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            title={isMuted ? 'ध्वनि चालू करें (Unmute Audio)' : 'ध्वनि बंद करें (Mute Audio)'}
          >
            <span>{isMuted ? '🔇 Muted' : '🔊 Sound ON'}</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CENTER HERO GREETING & CELEBRATION BUTTON */}
      {/* ======================================================== */}
      <div style={{
        textAlign: 'center',
        margin: 'auto',
        maxWidth: '850px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.9rem'
      }}>
        {/* Banner Alert during Grand Celebration */}
        {showCelebrationBanner && (
          <div
            className="glass-panel animate-diya"
            style={{
              pointerEvents: 'auto',
              padding: '0.6rem 1.6rem',
              borderRadius: '30px',
              border: '1px solid #FFD700',
              background: 'linear-gradient(90deg, rgba(230,81,0,0.8), rgba(255,160,0,0.8))',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 0 30px rgba(255, 160, 0, 0.8)',
              marginBottom: '0.5rem'
            }}
          >
            🚩 जय श्री राम! अयोध्या में भव्य आतिशबाजी व शंखनाद 🚩
          </div>
        )}

        {/* Shubh Deepavali Main Heading */}
        <div style={{ position: 'relative' }}>
          <h2
            className="font-devanagari-royal gold-gradient-text"
            style={{
              fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
              lineHeight: 1.05,
              margin: 0,
              filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.75)) drop-shadow(0 4px 12px rgba(0,0,0,0.9))'
            }}
          >
            शुभ दीपावली
          </h2>
        </div>

        {/* Sacred Subheading: "अधर्म पर धर्म की विजय, अंधकार पर प्रकाश की विजय।" */}
        <p
          className="font-devanagari-festive gold-glow-text"
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.85rem)',
            margin: '0.2rem 0',
            letterSpacing: '0.5px',
            color: '#FFF2A1'
          }}
        >
          "अधर्म पर धर्म की विजय, अंधकार पर प्रकाश की विजय।"
        </p>

        {/* Saffron Jai Shri Ram 🚩 Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 1.4rem',
          borderRadius: '24px',
          background: 'rgba(230, 81, 0, 0.35)',
          border: '1px solid rgba(255, 112, 67, 0.5)',
          backdropFilter: 'blur(8px)'
        }}>
          <span
            className="font-devanagari-royal saffron-glow-text"
            style={{
              fontSize: 'clamp(1.2rem, 2.6vw, 1.7rem)',
              fontWeight: 700
            }}
          >
            जय श्री राम 🚩
          </span>
        </div>

        {/* Premium Golden Glowing Button: "✨ Celebrate Diwali" */}
        <div style={{ marginTop: '0.6rem' }}>
          <button
            onClick={handleGrandCelebrate}
            className="gold-btn ornate-border"
            disabled={isBarrageActive}
            style={{
              pointerEvents: 'auto',
              padding: '1.1rem 2.8rem',
              borderRadius: '50px',
              fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              letterSpacing: '0.5px'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🪔</span>
            <span>✨ Celebrate Diwali</span>
            <span style={{ fontSize: '1.4rem' }}>🎆</span>
          </button>
        </div>

        {/* Subtle Hint */}
        <p style={{
          fontSize: '0.85rem',
          color: '#FFE082',
          opacity: 0.8,
          margin: '0.3rem 0 0',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)'
        }}>
          💡 स्क्रीन पर कहीं भी क्लिक करें और मनमोहक आतिशबाजी देखें (Click anywhere to burst fireworks)
        </p>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM CONTROLS: CAMERA VIEWS & PATAKA TOOLBAR */}
      {/* ======================================================== */}
      <footer style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Camera Views Selector Pills */}
        <div
          className="glass-panel"
          style={{
            pointerEvents: 'auto',
            padding: '0.4rem 0.6rem',
            borderRadius: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          {Object.entries(CAMERA_VIEWS).map(([key, view]) => (
            <button
              key={key}
              onClick={() => {
                setIsFreeOrbit(false)
                setCameraView(key)
                soundEngine.playTempleBell(1.1)
              }}
              style={{
                background: !isFreeOrbit && cameraView === key
                  ? 'linear-gradient(135deg, #FFD700, #FF9800)'
                  : 'rgba(255, 255, 255, 0.06)',
                color: !isFreeOrbit && cameraView === key ? '#1A0C00' : '#FFD700',
                fontWeight: !isFreeOrbit && cameraView === key ? 700 : 500,
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                transition: 'all 0.25s'
              }}
            >
              {view.name}
            </button>
          ))}

          {/* 3D Orbit Free Camera Toggle */}
          <button
            onClick={() => {
              setIsFreeOrbit(!isFreeOrbit)
              soundEngine.playTempleBell(1.3)
            }}
            style={{
              background: isFreeOrbit
                ? 'linear-gradient(135deg, #FFD700, #FF9800)'
                : 'rgba(255, 255, 255, 0.06)',
              color: isFreeOrbit ? '#1A0C00' : '#FFD700',
              fontWeight: isFreeOrbit ? 700 : 500,
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            🔄 3D Orbit View
          </button>
        </div>

        {/* Patakas Quick Launch Bar & Wish Card Button */}
        <div
          className="glass-panel ornate-border"
          style={{
            pointerEvents: 'auto',
            padding: '0.55rem 0.9rem',
            borderRadius: '18px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <span style={{ fontSize: '0.82rem', color: '#FFD700', fontWeight: 600, paddingRight: '0.4rem' }}>
            💥 उत्सव साधन:
          </span>

          <button
            onClick={() => onLaunchRocket((Math.random() - 0.5) * 45)}
            className="glass-panel"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: '#FFF2A1',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            🚀 रॉकेट (Rocket)
          </button>

          <button
            onClick={handleActionAnaar}
            className="glass-panel"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: '#FFF2A1',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            🌟 अनार (Anaar)
          </button>

          <button
            onClick={handleActionChakri}
            className="glass-panel"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: '#FFF2A1',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            💫 चकरी (Chakri)
          </button>

          <button
            onClick={handleActionBell}
            className="glass-panel"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: '#FFF2A1',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            🔔 मंदिर घंटी (Aarti Bell)
          </button>

          <button
            onClick={onOpenCardModal}
            className="gold-btn"
            style={{
              padding: '0.45rem 1.05rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            📜 शुभकामना पत्र (Send Wish)
          </button>
        </div>
      </footer>
    </div>
  )
}

