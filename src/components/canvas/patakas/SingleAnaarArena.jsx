import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundEngine } from '../../../audio/soundEngine'

const MAX_ANAAR_SPARKS = 3600
const MAX_ANAAR_SMOKE = 400

// Festive voice greetings for the single Anaar
const ANAAR_VOICES = [
  "Happy Diwali! Shubh Deepawali! Jai Shri Ram!",
  "Shubh Deepawali! May this glorious fountain illuminate your life with joy and prosperity!",
  "Happy Diwali to you and your loved ones! Victory of light over darkness! Jai Shri Ram!",
  "May the divine flame of Diwali bring peace, health, and eternal happiness! Shubh Deepawali!"
]

export default function SingleAnaarArena({
  autoBurn = false,
  onDiyaClick
}) {
  const [anaarActive, setAnaarActive] = useState(false)
  const [voiceIndex, setVoiceIndex] = useState(0)

  // Use refs for animation loop to avoid stale React closures
  const isBurningRef = useRef(false)
  const burnTimerRef = useRef(null)

  // Dynamic point light at anaar tip
  const anaarLight = useRef()

  // Particle systems refs
  const sparkPointsRef = useRef()
  const smokePointsRef = useRef()

  // Particle pools
  const sparkPool = useRef([])
  const smokePool = useRef([])

  // Create high-visibility glowing radial texture for sparkling fountain
  const sparkTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
    grad.addColorStop(0.2, 'rgba(255, 240, 140, 0.95)')
    grad.addColorStop(0.5, 'rgba(255, 160, 20, 0.8)')
    grad.addColorStop(0.85, 'rgba(255, 70, 0, 0.25)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Create soft volumetric smoke texture
  const smokeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(220, 220, 225, 0.8)')
    grad.addColorStop(0.4, 'rgba(180, 180, 195, 0.4)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Buffer geometries for 60 FPS GPU rendering
  const sparkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MAX_ANAAR_SPARKS * 3)
    const col = new Float32Array(MAX_ANAAR_SPARKS * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [])

  const smokeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MAX_ANAAR_SMOKE * 3)
    const col = new Float32Array(MAX_ANAAR_SMOKE * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [])

  // Trigger Anaar to burn with spectacular sparks, audio & voices
  const triggerAnaar = useCallback(() => {
    if (isBurningRef.current) return

    isBurningRef.current = true
    setAnaarActive(true)

    if (burnTimerRef.current) clearTimeout(burnTimerRef.current)

    // Notify overlay
    window.dispatchEvent(new CustomEvent('anaar-burn-started'))

    // Audio effects
    soundEngine.init()
    soundEngine.playFuseSizzle(0.6)

    // Roaring Fountain Sizzle Audio
    setTimeout(() => {
      soundEngine.playAnaarSizzle(5.8)
    }, 350)

    // Celebratory Voice Narration
    const selectedVoice = ANAAR_VOICES[voiceIndex % ANAAR_VOICES.length]
    setVoiceIndex(prev => prev + 1)
    setTimeout(() => {
      soundEngine.speakEnglish(selectedVoice)
    }, 700)

    // Auto finish after 6 seconds of grand celebration
    burnTimerRef.current = setTimeout(() => {
      isBurningRef.current = false
      setAnaarActive(false)
      window.dispatchEvent(new CustomEvent('anaar-burn-complete'))
    }, 6200)
  }, [voiceIndex])

  // Auto ignite Anaar if autoBurn is set
  useEffect(() => {
    if (autoBurn) {
      const timer = setTimeout(() => {
        triggerAnaar()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoBurn, triggerAnaar])

  // Listen for global reignite events from buttons
  useEffect(() => {
    const handleReignite = () => triggerAnaar()
    window.addEventListener('reignite-anaar', handleReignite)
    return () => window.removeEventListener('reignite-anaar', handleReignite)
  }, [triggerAnaar])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (burnTimerRef.current) clearTimeout(burnTimerRef.current)
      isBurningRef.current = false
    }
  }, [])

  // Emit sparkling particles from nozzle
  const emitAnaarSparks = () => {
    // Continuous fountain spray: 32 sparks per batch
    for (let i = 0; i < 32; i++) {
      if (sparkPool.current.length >= MAX_ANAAR_SPARKS) {
        sparkPool.current.shift()
      }

      const angle = Math.random() * Math.PI * 2
      const tier = Math.random()

      let heightVel, spread
      if (tier < 0.45) {
        // High core geyser (shoots 5 to 8 meters high)
        heightVel = 6.5 + Math.random() * 6.5
        spread = 0.18 + Math.random() * 0.18
      } else if (tier < 0.8) {
        // Mid spray (shoots 3 to 5.5 meters high)
        heightVel = 4.2 + Math.random() * 4.5
        spread = 0.35 + Math.random() * 0.35
      } else {
        // Low wide cascading base (shoots 2 to 3.5 meters high)
        heightVel = 2.5 + Math.random() * 3.0
        spread = 0.55 + Math.random() * 0.55
      }

      // Color Palette: Pure Diamond White, Molten Gold, Vivid Saffron, Silver
      const colorRoll = Math.random()
      let r = 1.0, g = 0.9, b = 0.2

      if (colorRoll > 0.82) {
        // Diamond White Flash
        r = 1.0; g = 1.0; b = 1.0
      } else if (colorRoll > 0.55) {
        // Brilliant Goldenrod
        r = 1.0; g = 0.85; b = 0.15
      } else if (colorRoll > 0.25) {
        // Molten Saffron Amber
        r = 1.0; g = 0.55; b = 0.05
      } else {
        // Sparkling Silver
        r = 0.95; g = 0.95; b = 1.0
      }

      sparkPool.current.push({
        x: (Math.random() - 0.5) * 0.08,
        y: 0.85,
        z: (Math.random() - 0.5) * 0.08,
        vx: Math.cos(angle) * spread * 4.2,
        vy: heightVel,
        vz: Math.sin(angle) * spread * 4.2,
        life: 1.0,
        decay: 0.55 + Math.random() * 0.45,
        r,
        g,
        b
      })
    }

    // Soft smoke puff from base nozzle
    if (Math.random() > 0.6 && smokePool.current.length < MAX_ANAAR_SMOKE) {
      smokePool.current.push({
        x: (Math.random() - 0.5) * 0.2,
        y: 0.8,
        z: (Math.random() - 0.5) * 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: 0.9 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 0.35,
        life: 1.0,
        decay: 0.22,
        r: 0.92,
        g: 0.9,
        b: 0.88
      })
    }
  }

  // Frame Update Loop (60 FPS GPU Buffer Pipeline)
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const isBurning = isBurningRef.current

    // Continuously emit sparks when active
    if (isBurning) {
      emitAnaarSparks()
      emitAnaarSparks()
    }

    // Dynamic flickering lighting at nozzle
    if (anaarLight.current) {
      if (isBurning) {
        anaarLight.current.intensity = 5.5 + Math.sin(Date.now() * 0.03) * 2.8 + Math.random() * 2.0
      } else {
        anaarLight.current.intensity = Math.max(0.05, anaarLight.current.intensity - dt * 6.0)
      }
    }

    // 1. UPDATE ANAAR SPARKS
    if (sparkPointsRef.current) {
      const posAttr = sparkPointsRef.current.geometry.attributes.position
      const colAttr = sparkPointsRef.current.geometry.attributes.color

      let activeSparks = 0

      for (let i = sparkPool.current.length - 1; i >= 0; i--) {
        const p = sparkPool.current[i]
        p.life -= p.decay * dt

        if (p.life <= 0) {
          sparkPool.current.splice(i, 1)
          continue
        }

        // Realistic Physics: Earth gravity + drag
        p.vy -= 9.8 * 0.72 * dt
        p.vx *= 0.985
        p.vz *= 0.985
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt

        // Ground bounce & roll
        if (p.y < 0.04) {
          p.y = 0.04
          p.vy = -p.vy * 0.32
          p.vx *= 0.68
          p.vz *= 0.68
        }

        posAttr.setXYZ(activeSparks, p.x, p.y, p.z)

        const intensity = Math.min(1.0, p.life * 1.35)
        colAttr.setXYZ(activeSparks, p.r * intensity, p.g * intensity, p.b * intensity)
        activeSparks++
      }

      // Tell WebGL to only draw active sparks (zero overhead!)
      sparkGeo.setDrawRange(0, activeSparks)
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
    }

    // 2. UPDATE SMOKE PARTICLES
    if (smokePointsRef.current) {
      const smPos = smokePointsRef.current.geometry.attributes.position
      const smCol = smokePointsRef.current.geometry.attributes.color

      let activeSmoke = 0

      for (let i = smokePool.current.length - 1; i >= 0; i--) {
        const p = smokePool.current[i]
        p.life -= p.decay * dt

        if (p.life <= 0) {
          smokePool.current.splice(i, 1)
          continue
        }

        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt

        smPos.setXYZ(activeSmoke, p.x, p.y, p.z)

        const alpha = p.life * 0.18
        smCol.setXYZ(activeSmoke, p.r * alpha, p.g * alpha, p.b * alpha)
        activeSmoke++
      }

      smokeGeo.setDrawRange(0, activeSmoke)
      smPos.needsUpdate = true
      smCol.needsUpdate = true
    }
  })

  // Circular ring of sacred diyas around courtyard
  const surroundingDiyas = useMemo(() => {
    const list = []
    const count = 16
    const radius = 6.5
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle
      })
    }
    return list
  }, [])

  return (
    <group>
      {/* Night Sky & Soft Festive Fog */}
      <color attach="background" args={['#030614']} />
      <fog attach="fog" args={['#04081c', 10, 85]} />

      {/* Atmospheric Ambient Lighting */}
      <ambientLight color="#0E1630" intensity={0.75} />
      <hemisphereLight skyColor="#FFA000" groundColor="#050C22" intensity={0.85} />

      {/* Dynamic Point Light at the Anaar Cone Tip */}
      <pointLight
        ref={anaarLight}
        position={[0, 1.2, 0]}
        color="#FFA000"
        intensity={0.1}
        distance={25}
        decay={1.8}
        castShadow
      />

      {/* Courtyard Ground Floor with Golden Rangoli Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#070C1E"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Concentric Rangoli Circles under Anaar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.5, 1.58, 48]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3.2, 3.3, 48]} />
        <meshBasicMaterial color="#FF9100" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.2, 5.32, 48]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
      </mesh>

      {/* ======================================================== */}
      {/* THE SINGLE 3D ROYAL ANAAR (FLOWERPOT FOUNTAIN)           */}
      {/* ======================================================== */}
      <group
        position={[0, 0, 0]}
        onClick={triggerAnaar}
        onPointerDown={(e) => {
          e.stopPropagation()
          triggerAnaar()
        }}
        style={{ cursor: 'pointer' }}
      >
        {/* Clay Flowerpot Cone with Gold Rim & Terracotta Texture */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <coneGeometry args={[0.5, 0.85, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.85}
            roughness={0.25}
            emissive="#FF8F00"
            emissiveIntensity={anaarActive ? 0.85 : 0.15}
          />
        </mesh>

        {/* Pot Base Collar */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.16, 24]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.4} />
        </mesh>

        {/* Ornamental Carved Rings on Cone */}
        <mesh position={[0, 0.28, 0]}>
          <torusGeometry args={[0.34, 0.025, 8, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <torusGeometry args={[0.18, 0.02, 8, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#FFF2A1" />
        </mesh>

        {/* Fuse Wick at Top */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 8]} />
          <meshBasicMaterial color={anaarActive ? '#FF1744' : '#ECEFF1'} />
        </mesh>

        {/* Glowing Fuse Ember / Eruption Nozzle Core */}
        {anaarActive && (
          <group position={[0, 0.98, 0]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color="#FF9100" transparent opacity={0.65} />
            </mesh>
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* SURROUNDING GLOWING 3D DIYAS                             */}
      {/* ======================================================== */}
      {surroundingDiyas.map((d, idx) => (
        <group
          key={idx}
          position={[d.x, 0, d.z]}
          onClick={() => {
            soundEngine.playTempleBell(1.1 + (idx % 4) * 0.1)
            if (onDiyaClick) onDiyaClick()
          }}
          style={{ cursor: 'pointer' }}
        >
          {/* Terracotta Diya Cup */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.22, 0.12, 0.12, 12]} />
            <meshStandardMaterial color="#BF360C" roughness={0.6} />
          </mesh>
          {/* Golden Flame */}
          <mesh position={[0, 0.18, 0]}>
            <coneGeometry args={[0.06, 0.16, 8]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          {/* Point Light */}
          <pointLight color="#FFA000" intensity={1.2} distance={3.5} />
        </group>
      ))}

      {/* ======================================================== */}
      {/* 3D PARTICLE SYSTEMS (SPARKS & VOLUMETRIC SMOKE)          */}
      {/* ======================================================== */}
      {/* FOUNTAIN SPARKS: frustumCulled={false} ensures continuous rendering */}
      <points ref={sparkPointsRef} geometry={sparkGeo} frustumCulled={false}>
        <pointsMaterial
          map={sparkTexture}
          size={0.42}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* VOLUMETRIC SMOKE PUFFS */}
      <points ref={smokePointsRef} geometry={smokeGeo} frustumCulled={false}>
        <pointsMaterial
          map={smokeTexture}
          size={0.85}
          vertexColors
          transparent
          opacity={0.35}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
