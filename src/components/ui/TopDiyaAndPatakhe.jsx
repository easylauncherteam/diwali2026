import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { soundEngine } from '../../audio/soundEngine'

export default function TopDiyaAndPatakhe({ onGoToAnaarPage }) {
  const [isDiyaBlessed, setIsDiyaBlessed] = useState(false)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animFrameRef = useRef(null)

  // ========================================================
  // 1. CLICK 3D DIYA (LEFT UPPER SIDE)
  // ========================================================
  const handleDiyaClick = () => {
    soundEngine.init()
    soundEngine.playTempleBell(1.2)
    soundEngine.playChimes()
    setIsDiyaBlessed(true)

    // Spawn floating golden blessing sparks from the Diya
    spawnBlessingSparks()

    setTimeout(() => {
      setIsDiyaBlessed(false)
    }, 2800)
  }

  // ========================================================
  // 2. CLICK BURN ANAAR (RIGHT UPPER SIDE)
  // ========================================================
  const handleBurnAnaar = () => {
    soundEngine.init()
    soundEngine.playFuseSizzle(0.6)
    if (onGoToAnaarPage) {
      onGoToAnaarPage()
    }
  }

  const spawnBlessingSparks = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        x: 60 + Math.random() * 70,
        y: 60 + Math.random() * 50,
        vx: (Math.random() - 0.2) * 2.8,
        vy: 1.2 + Math.random() * 2.2,
        size: 3 + Math.random() * 3.5,
        color: ['#FFD700', '#FFF2A1', '#FFA000', '#FFB300'][Math.floor(Math.random() * 4)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.01,
        gravity: 0.02
      })
    }
  }

  // Animation Loop for Canvas Sparks
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let isRunning = true
    const loop = () => {
      if (!isRunning) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const remaining = []
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.985
        p.alpha -= p.decay

        if (p.alpha > 0.02) {
          ctx.save()
          ctx.globalAlpha = Math.max(0, p.alpha)
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          remaining.push(p)
        }
      }
      particlesRef.current = remaining

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      isRunning = false
      window.removeEventListener('resize', resize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <>
      {/* 2D Particle Burst Overlay Canvas for Diya Blessing */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 38,
          pointerEvents: 'none'
        }}
      />

      {/* ======================================================== */}
      {/* LEFT UPPER SIDE: 3D DIYA WITH DANCING FLAME & GLOW       */}
      {/* ======================================================== */}
      <div
        onClick={handleDiyaClick}
        style={{
          position: 'fixed',
          top: 'clamp(0.8rem, 2.5vw, 1.4rem)',
          left: 'clamp(0.8rem, 2.5vw, 1.5rem)',
          zIndex: 50,
          cursor: 'pointer',
          pointerEvents: 'auto',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}
        title="Click on the 3D Diya to bless with sacred temple bells"
      >
        <motion.div
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.94 }}
          animate={isDiyaBlessed ? {
            scale: [1, 1.25, 1.1],
            rotate: [0, -3, 3, 0]
          } : {
            y: [0, -2, 0]
          }}
          transition={isDiyaBlessed ? { duration: 0.6 } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            width: 'clamp(54px, 5.5vw, 68px)',
            height: 'clamp(54px, 5.5vw, 68px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: isDiyaBlessed
              ? 'drop-shadow(0 0 25px rgba(255, 215, 0, 1)) drop-shadow(0 0 45px rgba(255, 152, 0, 0.9))'
              : 'drop-shadow(0 0 16px rgba(255, 183, 77, 0.85)) drop-shadow(0 4px 15px rgba(0,0,0,0.8))'
          }}
        >
          {/* Pulsating Radial Halo Behind Diya */}
          <motion.div
            animate={{
              scale: isDiyaBlessed ? [1.2, 1.6, 1.3] : [1, 1.18, 1],
              opacity: isDiyaBlessed ? [0.8, 1, 0.8] : [0.55, 0.75, 0.55]
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 112, 67, 0.35) 50%, transparent 75%)',
              pointerEvents: 'none'
            }}
          />

          {/* SVG 3D Diya */}
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="diyaClayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D84315" />
                <stop offset="45%" stopColor="#BF360C" />
                <stop offset="85%" stopColor="#4E1A0C" />
              </linearGradient>

              <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFF2A1" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA000" />
              </linearGradient>

              <radialGradient id="flameOuterGrad" cx="50%" cy="65%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FFF176" />
                <stop offset="60%" stopColor="#FF9800" />
                <stop offset="90%" stopColor="#FF3D00" />
                <stop offset="100%" stopColor="rgba(216, 27, 96, 0)" />
              </radialGradient>

              <linearGradient id="flameInnerGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#29B6F6" />
                <stop offset="35%" stopColor="#FFFDE7" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>

            {/* Clay Diya Base */}
            <path
              d="M 16 58 C 16 78 40 88 50 88 C 60 88 84 78 84 58 C 84 54 75 52 50 52 C 25 52 16 54 16 58 Z"
              fill="url(#diyaClayGrad)"
              stroke="#E65100"
              strokeWidth="1.5"
            />

            {/* Golden Carved Rim */}
            <ellipse
              cx="50"
              cy="55"
              rx="34"
              ry="7"
              fill="url(#goldRimGrad)"
              stroke="#FFD700"
              strokeWidth="0.8"
            />

            {/* Diya Wick Peak */}
            <path d="M 47 54 Q 50 48 53 54 Z" fill="#37474F" />

            {/* Dancing 3D Teardrop Flame */}
            <motion.path
              d="M 50 14 C 44 26 38 35 38 46 C 38 54 43 57 50 57 C 57 57 62 54 62 46 C 62 35 56 26 50 14 Z"
              fill="url(#flameOuterGrad)"
              animate={{
                d: [
                  "M 50 14 C 44 26 38 35 38 46 C 38 54 43 57 50 57 C 57 57 62 54 62 46 C 62 35 56 26 50 14 Z",
                  "M 51 12 C 43 24 37 36 37 46 C 37 54 44 57 50 57 C 56 57 63 54 63 46 C 63 36 57 24 51 12 Z",
                  "M 49 13 C 45 25 39 35 39 46 C 39 54 44 57 50 57 C 56 57 61 54 61 46 C 61 35 55 25 49 13 Z"
                ],
                scaleY: [1, 1.08, 0.96, 1],
                scaleX: [1, 0.94, 1.04, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.85, ease: "easeInOut" }}
              style={{ transformOrigin: '50% 55%' }}
            />

            {/* Inner Core */}
            <motion.ellipse
              cx="50"
              cy="46"
              rx="5"
              ry="10"
              fill="url(#flameInnerGrad)"
              animate={{
                ry: [10, 12, 9, 10],
                rx: [5, 4.5, 5.5, 5]
              }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Small Golden Badge Label */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            background: 'rgba(5, 10, 25, 0.78)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: isDiyaBlessed ? '1.5px solid #FFD700' : '1.2px solid rgba(255, 215, 0, 0.45)',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            color: '#FFE082',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
            letterSpacing: '0.3px'
          }}
        >
          <span>✨</span>
          <span>{isDiyaBlessed ? 'Blessed! 🪔' : ' Diya'}</span>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT UPPER SIDE: BURN ANAAR BUTTON                      */}
      {/* ======================================================== */}
      < div
        style={{
          position: 'fixed',
          top: 'clamp(0.8rem, 2.5vw, 1.4rem)',
          right: 'clamp(0.8rem, 2.5vw, 1.5rem)',
          zIndex: 50,
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <motion.button
          onClick={handleBurnAnaar}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            boxShadow: [
              '0 4px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255, 193, 7, 0.35)',
              '0 4px 25px rgba(0,0,0,0.7), 0 0 25px rgba(255, 160, 0, 0.65)',
              '0 4px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255, 193, 7, 0.35)'
            ]
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 15, 35, 0.88) 0%, rgba(10, 5, 22, 0.95) 100%)',
            border: '1.8px solid rgba(255, 193, 7, 0.7)',
            borderRadius: '26px',
            padding: 'clamp(0.42rem, 1.2vw, 0.58rem) clamp(0.85rem, 2vw, 1.4rem)',
            color: '#FFFFFF',
            fontSize: 'clamp(0.78rem, 1.8vw, 0.92rem)',
            fontWeight: 800,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            letterSpacing: '0.4px'
          }}
          title="Click to burn the Royal 3D Anaar with sparkling crackles and festive voiceover!"
        >
          {/* Animated Anaar Icon */}
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ fontSize: '1.3rem', display: 'inline-block' }}
          >
            🌟
          </motion.span>

          {/* Button Text */}
          <span style={{
            background: 'linear-gradient(90deg, #FFF176, #FFB300)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 10px rgba(255, 160, 0, 0.5)'
          }}>
            Burn Anaar 🌟
          </span>

          {/* Sizzling Active Fuse Spark */}
          <motion.span
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            style={{
              fontSize: '0.9rem',
              color: '#FFD700',
              filter: 'drop-shadow(0 0 8px #FFD700)'
            }}
          >
            🔥
          </motion.span>
        </motion.button >
      </div >
    </>
  )
}
