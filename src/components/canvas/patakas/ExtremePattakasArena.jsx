import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundEngine } from '../../../audio/soundEngine'

// Particle count limits for buttery 60 FPS
const MAX_SPARKS = 2500
const MAX_SMOKE_PARTICLES = 400
const MAX_AERIAL_BURST_PARTICLES = 3000

const PALETTES = [
  ['#FFD700', '#FFA000', '#FF3D00'], // Golden Saffron
  ['#00E676', '#76FF03', '#B9F6CA'], // Emerald
  ['#00E5FF', '#2979FF', '#80D8FF'], // Celestial Cyan
  ['#FF1744', '#FF4081', '#FF80AB'], // Radiant Ruby
  ['#FFD600', '#FF6D00', '#FFFFFF'], // Diya Flame & White Spark
]

export default function ExtremePattakasArena({
  slowMo = false,
  autoCelebration = false,
  onDiyaClick
}) {
  const timeScale = slowMo ? 0.25 : 1.0

  // Cracker Active States
  const [anaarActive, setAnaarActive] = useState(false)
  const [chakriActive, setChakriActive] = useState(false)
  const [ladiActive, setLadiActive] = useState(false)
  const [bombActive, setBombActive] = useState(false)
  const [rocketActive, setRocketActive] = useState(false)

  // Fuse burn animations (0 to 1)
  const anaarFuse = useRef(0)
  const chakriFuse = useRef(0)
  const ladiIndex = useRef(0)
  const bombFuse = useRef(0)

  // Dynamic Point Lights
  const anaarLight = useRef()
  const chakriLight = useRef()
  const bombLight = useRef()
  const skyBurstLight = useRef()

  // Particle systems refs
  const sparkPointsRef = useRef()
  const smokePointsRef = useRef()
  const aerialPointsRef = useRef()

  // Data pools
  const sparkPool = useRef([])
  const smokePool = useRef([])
  const aerialPool = useRef([])

  // Rocket State
  const rocketPos = useRef({ x: -4, y: 0.8, z: 0, vy: 0, flying: false })
  const rocketMeshRef = useRef()

  // Chakri Rotation
  const chakriRot = useRef(0)

  // Geometries for points
  const sparkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MAX_SPARKS * 3)
    const col = new Float32Array(MAX_SPARKS * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [])

  const smokeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MAX_SMOKE_PARTICLES * 3)
    const col = new Float32Array(MAX_SMOKE_PARTICLES * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [])

  const aerialGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MAX_AERIAL_BURST_PARTICLES * 3)
    const col = new Float32Array(MAX_AERIAL_BURST_PARTICLES * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [])

  // Auto celebration timer
  useEffect(() => {
    if (!autoCelebration) return
    const interval = setInterval(() => {
      const choices = ['anaar', 'chakri', 'ladi', 'rocket', 'bomb']
      const pick = choices[Math.floor(Math.random() * choices.length)]
      if (pick === 'anaar' && !anaarActive) triggerAnaar()
      if (pick === 'chakri' && !chakriActive) triggerChakri()
      if (pick === 'ladi' && !ladiActive) triggerLadi()
      if (pick === 'rocket' && !rocketActive) triggerRocket()
      if (pick === 'bomb' && !bombActive) triggerBomb()
    }, 3800)
    return () => clearInterval(interval)
  }, [autoCelebration, anaarActive, chakriActive, ladiActive, rocketActive, bombActive])

  // ========================================================
  // CRACKER TRIGGER HANDLERS
  // ========================================================
  const triggerAnaar = () => {
    setAnaarActive(true)
    anaarFuse.current = 1.0
    soundEngine.playFuseSizzle(1.2)
    setTimeout(() => {
      soundEngine.playAnaarSizzle(4.5)
      setTimeout(() => setAnaarActive(false), 5000)
    }, 1200)
  }

  const triggerChakri = () => {
    setChakriActive(true)
    chakriFuse.current = 1.0
    soundEngine.playFuseSizzle(1.0)
    setTimeout(() => {
      soundEngine.playChakriWhir(4.0)
      setTimeout(() => setChakriActive(false), 4500)
    }, 1000)
  }

  const triggerLadi = () => {
    setLadiActive(true)
    ladiIndex.current = 0
    soundEngine.playFuseSizzle(0.8)
    setTimeout(() => {
      soundEngine.playLadiBurst(28, 65)
      const ladiTimer = setInterval(() => {
        ladiIndex.current += 1
        // Emit small pop flash at current cracker position
        emitLadiPuff(ladiIndex.current)
        if (ladiIndex.current >= 28) {
          clearInterval(ladiTimer)
          setTimeout(() => setLadiActive(false), 500)
        }
      }, 65)
    }, 800)
  }

  const triggerBomb = () => {
    setBombActive(true)
    bombFuse.current = 1.0
    soundEngine.playFuseSizzle(1.4)
    setTimeout(() => {
      soundEngine.playBombBoom()
      emitBombExplosion()
      setTimeout(() => setBombActive(false), 600)
    }, 1400)
  }

  const triggerRocket = () => {
    setRocketActive(true)
    soundEngine.playFuseSizzle(0.8)
    setTimeout(() => {
      soundEngine.playRocketLaunch()
      rocketPos.current = { x: -4, y: 0.8, z: 0, vy: 14.0, flying: true }
    }, 800)
  }

  // ========================================================
  // PARTICLE EMITTERS
  // ========================================================
  const emitAnaarSparks = () => {
    for (let i = 0; i < 22; i++) {
      if (sparkPool.current.length >= MAX_SPARKS) sparkPool.current.shift()
      const angle = Math.random() * Math.PI * 2
      const spread = Math.random() * 0.4
      sparkPool.current.push({
        x: 0 + (Math.random() - 0.5) * 0.15,
        y: 0.8,
        z: 0 + (Math.random() - 0.5) * 0.15,
        vx: Math.cos(angle) * spread * 3.5,
        vy: 4.5 + Math.random() * 5.5,
        vz: Math.sin(angle) * spread * 3.5,
        life: 1.0,
        decay: 0.8 + Math.random() * 0.6,
        r: 1.0,
        g: 0.8 + Math.random() * 0.2,
        b: Math.random() > 0.5 ? 0.3 : 0.9 // Golden & Silver
      })
    }
    // Also emit volumetric smoke at base
    if (Math.random() > 0.6 && smokePool.current.length < MAX_SMOKE_PARTICLES) {
      smokePool.current.push({
        x: (Math.random() - 0.5) * 0.4,
        y: 0.6,
        z: (Math.random() - 0.5) * 0.4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.8 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 0.5,
        life: 1.0,
        decay: 0.3,
        r: 0.85,
        g: 0.85,
        b: 0.85
      })
    }
  }

  const emitChakriSparks = () => {
    for (let i = 0; i < 14; i++) {
      if (sparkPool.current.length >= MAX_SPARKS) sparkPool.current.shift()
      const angle = chakriRot.current + (i / 14) * Math.PI * 2
      const speed = 4.0 + Math.random() * 2.5
      sparkPool.current.push({
        x: 4.0 + Math.cos(angle) * 0.4,
        y: 0.15,
        z: 0 + Math.sin(angle) * 0.4,
        vx: -Math.sin(angle) * speed,
        vy: 0.2 + Math.random() * 0.8,
        vz: Math.cos(angle) * speed,
        life: 1.0,
        decay: 1.2 + Math.random() * 0.8,
        r: 1.0,
        g: 0.6 + Math.random() * 0.4,
        b: 0.1
      })
    }
  }

  const emitLadiPuff = (idx) => {
    const ladiX = -8 + (idx / 28) * 4.5
    for (let i = 0; i < 16; i++) {
      if (sparkPool.current.length >= MAX_SPARKS) sparkPool.current.shift()
      const u = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 3.0
      sparkPool.current.push({
        x: ladiX,
        y: 0.1,
        z: -2 + (idx % 2 === 0 ? 0.2 : -0.2),
        vx: Math.cos(u) * speed,
        vy: 0.8 + Math.random() * 2.0,
        vz: Math.sin(u) * speed,
        life: 1.0,
        decay: 1.8,
        r: 1.0,
        g: 0.4,
        b: 0.1
      })
    }
    // Grey/White smoke puff
    if (smokePool.current.length < MAX_SMOKE_PARTICLES) {
      smokePool.current.push({
        x: ladiX,
        y: 0.2,
        z: -2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.6 + Math.random() * 0.6,
        vz: (Math.random() - 0.5) * 0.3,
        life: 1.0,
        decay: 0.4,
        r: 0.8,
        g: 0.8,
        b: 0.8
      })
    }
  }

  const emitBombExplosion = () => {
    // Flash Bomb Light
    if (bombLight.current) {
      bombLight.current.intensity = 15.0
    }
    // 120 sparks radiating outward
    for (let i = 0; i < 120; i++) {
      if (sparkPool.current.length >= MAX_SPARKS) sparkPool.current.shift()
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.5
      const speed = 4.0 + Math.random() * 6.5
      sparkPool.current.push({
        x: 0,
        y: 0.2,
        z: 3,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed * 0.8,
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        life: 1.0,
        decay: 0.9 + Math.random() * 0.6,
        r: 1.0,
        g: 0.5 + Math.random() * 0.5,
        b: 0.1
      })
    }
    // Thick volumetric smoke cloud
    for (let j = 0; j < 25; j++) {
      if (smokePool.current.length < MAX_SMOKE_PARTICLES) {
        smokePool.current.push({
          x: (Math.random() - 0.5) * 0.8,
          y: 0.4,
          z: 3 + (Math.random() - 0.5) * 0.8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 0.6 + Math.random() * 1.2,
          vz: (Math.random() - 0.5) * 1.2,
          life: 1.0,
          decay: 0.22,
          r: 0.75,
          g: 0.75,
          b: 0.75
        })
      }
    }
  }

  const triggerSkyExplosion = (x, y, z) => {
    soundEngine.playExplosion('grand')
    if (skyBurstLight.current) {
      skyBurstLight.current.position.set(x, y, z)
      skyBurstLight.current.intensity = 16.0
    }
    const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    const baseCol = new THREE.Color(pal[0])

    for (let i = 0; i < 180; i++) {
      if (aerialPool.current.length >= MAX_AERIAL_BURST_PARTICLES) aerialPool.current.shift()
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const speed = 5.0 + Math.random() * 9.0

      aerialPool.current.push({
        x: x,
        y: y,
        z: z,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed,
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        life: 1.0,
        decay: 0.6 + Math.random() * 0.4,
        r: baseCol.r,
        g: baseCol.g,
        b: baseCol.b
      })
    }
  }

  // ========================================================
  // FRAME ANIMATION LOOP
  // ========================================================
  useFrame((state, delta) => {
    const dt = delta * timeScale
    const t = state.clock.getElapsedTime()

    // 1. Anaar Active Loop
    if (anaarActive && anaarFuse.current <= 0.1) {
      emitAnaarSparks()
      if (anaarLight.current) {
        anaarLight.current.intensity = 6.0 + Math.sin(t * 25) * 2.0
      }
    } else if (anaarLight.current) {
      anaarLight.current.intensity = Math.max(0, anaarLight.current.intensity - dt * 10)
    }

    // 2. Chakri Active Loop
    if (chakriActive && chakriFuse.current <= 0.1) {
      chakriRot.current += dt * 35 // Rapid RPM
      emitChakriSparks()
      if (chakriLight.current) {
        chakriLight.current.intensity = 5.0 + Math.sin(t * 30) * 1.5
      }
    } else if (chakriLight.current) {
      chakriLight.current.intensity = Math.max(0, chakriLight.current.intensity - dt * 8)
    }

    // 3. Rocket Physics & Trail
    if (rocketPos.current.flying) {
      rocketPos.current.y += rocketPos.current.vy * dt
      rocketPos.current.vy -= 9.8 * 0.15 * dt // Rocket thrust vs gravity

      // Rocket mesh update
      if (rocketMeshRef.current) {
        rocketMeshRef.current.position.set(rocketPos.current.x, rocketPos.current.y, rocketPos.current.z)
      }

      // Exhaust golden spark & smoke trail
      for (let i = 0; i < 6; i++) {
        if (sparkPool.current.length < MAX_SPARKS) {
          sparkPool.current.push({
            x: rocketPos.current.x + (Math.random() - 0.5) * 0.1,
            y: rocketPos.current.y - 0.4,
            z: rocketPos.current.z + (Math.random() - 0.5) * 0.1,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -4.0 - Math.random() * 2.0,
            vz: (Math.random() - 0.5) * 0.8,
            life: 1.0,
            decay: 2.5,
            r: 1.0,
            g: 0.7,
            b: 0.1
          })
        }
      }

      // Detonation at apex
      if (rocketPos.current.y >= 26.0) {
        rocketPos.current.flying = false
        triggerSkyExplosion(rocketPos.current.x, rocketPos.current.y, rocketPos.current.z)
        setRocketActive(false)
        if (rocketMeshRef.current) rocketMeshRef.current.position.set(-4, 0.8, 0)
      }
    }

    // Decay bomb light
    if (bombLight.current && bombLight.current.intensity > 0) {
      bombLight.current.intensity = Math.max(0, bombLight.current.intensity - dt * 14)
    }

    // Decay sky burst light
    if (skyBurstLight.current && skyBurstLight.current.intensity > 0) {
      skyBurstLight.current.intensity = Math.max(0, skyBurstLight.current.intensity - dt * 8)
    }

    // Update Spark Particles
    if (sparkPointsRef.current) {
      const pos = sparkPointsRef.current.geometry.attributes.position
      const col = sparkPointsRef.current.geometry.attributes.color

      for (let i = sparkPool.current.length - 1; i >= 0; i--) {
        const p = sparkPool.current[i]
        p.life -= p.decay * dt
        if (p.life <= 0) {
          sparkPool.current.splice(i, 1)
          continue
        }
        // Physics: velocity + gravity
        p.vy -= 9.8 * 0.65 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt

        // Ground bounce
        if (p.y < 0.05) {
          p.y = 0.05
          p.vy = -p.vy * 0.35
          p.vx *= 0.7
          p.vz *= 0.7
        }

        pos.setXYZ(i, p.x, p.y, p.z)
        col.setXYZ(i, p.r * p.life, p.g * p.life, p.b * p.life)
      }

      // Clear remaining buffer slots
      for (let i = sparkPool.current.length; i < MAX_SPARKS; i++) {
        pos.setXYZ(i, 0, -999, 0)
      }
      pos.needsUpdate = true
      col.needsUpdate = true
    }

    // Update Smoke Particles
    if (smokePointsRef.current) {
      const pos = smokePointsRef.current.geometry.attributes.position
      const col = smokePointsRef.current.geometry.attributes.color

      for (let i = smokePool.current.length - 1; i >= 0; i--) {
        const sm = smokePool.current[i]
        sm.life -= sm.decay * dt
        if (sm.life <= 0) {
          smokePool.current.splice(i, 1)
          continue
        }
        // Smoke drifts gently with wind and rises
        sm.x += (sm.vx + 0.3) * dt
        sm.y += sm.vy * dt
        sm.z += sm.vz * dt

        pos.setXYZ(i, sm.x, sm.y, sm.z)
        const alpha = sm.life * 0.45
        col.setXYZ(i, sm.r * alpha, sm.g * alpha, sm.b * alpha)
      }

      for (let i = smokePool.current.length; i < MAX_SMOKE_PARTICLES; i++) {
        pos.setXYZ(i, 0, -999, 0)
      }
      pos.needsUpdate = true
      col.needsUpdate = true
    }

    // Update Aerial Burst Particles
    if (aerialPointsRef.current) {
      const pos = aerialPointsRef.current.geometry.attributes.position
      const col = aerialPointsRef.current.geometry.attributes.color

      for (let i = aerialPool.current.length - 1; i >= 0; i--) {
        const p = aerialPool.current[i]
        p.life -= p.decay * dt
        if (p.life <= 0) {
          aerialPool.current.splice(i, 1)
          continue
        }
        // Gravity & air drag
        p.vy -= 9.8 * 0.3 * dt
        p.vx *= 0.98
        p.vz *= 0.98
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt

        pos.setXYZ(i, p.x, p.y, p.z)
        col.setXYZ(i, p.r * p.life, p.g * p.life, p.b * p.life)
      }

      for (let i = aerialPool.current.length; i < MAX_AERIAL_BURST_PARTICLES; i++) {
        pos.setXYZ(i, 0, -999, 0)
      }
      pos.needsUpdate = true
      col.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Night Sky & Lighting */}
      <color attach="background" args={['#040816']} />
      <fog attach="fog" args={['#071026', 15, 90]} />

      <ambientLight color="#0B1A3D" intensity={0.7} />
      <directionalLight position={[10, 25, 15]} color="#FFE082" intensity={1.2} />

      {/* Dynamic Lighting from active ground crackers */}
      <pointLight ref={anaarLight} position={[0, 1.2, 0]} color="#FFD700" distance={16} />
      <pointLight ref={chakriLight} position={[4, 0.4, 0]} color="#FF9100" distance={14} />
      <pointLight ref={bombLight} position={[0, 0.5, 3]} color="#FF1744" distance={25} />
      <pointLight ref={skyBurstLight} position={[0, 24, 0]} color="#FFD700" distance={50} />

      {/* Street / Temple Stone Pavement */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial color="#2B1D16" roughness={0.8} />
      </mesh>

      {/* Diya Row along the stone boundary */}
      {[-12, -9, -6, 6, 9, 12].map((x, idx) => (
        <group key={idx} position={[x, 0.05, -5]} onClick={onDiyaClick} style={{ cursor: 'pointer' }}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.15, 0.14, 12]} />
            <meshStandardMaterial color="#D7CCC8" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <coneGeometry args={[0.08, 0.22, 8]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          <pointLight color="#FFA000" intensity={1.8} distance={4} />
        </group>
      ))}

      {/* ======================================================== */}
      {/* 3D GROUND FIRECRACKERS (INTERACTIVE CLICKABLE MESHES) */}
      {/* ======================================================== */}

      {/* 1. ROYAL ANAAR (Flowerpot Fountain) */}
      <group position={[0, 0, 0]} onClick={triggerAnaar} style={{ cursor: 'pointer' }}>
        {/* Clay Flowerpot Cone */}
        <mesh position={[0, 0.35, 0]}>
          <coneGeometry args={[0.4, 0.7, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
            emissive="#FF8F00"
            emissiveIntensity={anaarActive ? 0.6 : 0.1}
          />
        </mesh>
        {/* Pot Base Collar */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.12, 16]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
        {/* Glowing Fuse Wick at Top */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
          <meshBasicMaterial color={anaarActive ? '#FF1744' : '#ECEFF1'} />
        </mesh>
      </group>

      {/* 2. ZAMEEN CHAKRI (Ground Spinner) */}
      <group position={[4, 0, 0]} onClick={triggerChakri} style={{ cursor: 'pointer' }}>
        <group rotation={[0, chakriRot.current, 0]}>
          {/* Circular Wheel Disc */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.1, 16]} />
            <meshStandardMaterial
              color="#FF3D00"
              metalness={0.6}
              roughness={0.3}
              emissive="#FFD700"
              emissiveIntensity={chakriActive ? 0.8 : 0.1}
            />
          </mesh>
          {/* Spiral Pattern Spokes */}
          <mesh position={[0, 0.12, 0]}>
            <torusGeometry args={[0.3, 0.04, 6, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </group>
      </group>

      {/* 3. LADI CRACKER (Row of Red Firecrackers) */}
      <group position={[-6, 0, -2]} onClick={triggerLadi} style={{ cursor: 'pointer' }}>
        {Array.from({ length: 24 }).map((_, idx) => (
          <mesh
            key={idx}
            position={[(idx / 24) * 4.2, 0.06, idx % 2 === 0 ? 0.1 : -0.1]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.18, 6]} />
            <meshStandardMaterial
              color={ladiActive && idx <= ladiIndex.current ? '#424242' : '#D50000'}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* 4. SKY ROCKET LAUNCH STAND & BOTTLE */}
      <group position={[-4, 0, 0]} onClick={triggerRocket} style={{ cursor: 'pointer' }}>
        {/* Glass Bottle Launcher Stand */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 0.7, 12]} />
          <meshStandardMaterial color="#00897B" roughness={0.2} transparent opacity={0.7} />
        </mesh>
        {/* Rocket in Bottle */}
        <group ref={rocketMeshRef} position={[0, 0.8, 0]}>
          {/* Wooden Stabilizer Stick */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.2, 4]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          {/* Rocket Cylinder */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
            <meshStandardMaterial color="#FF1744" metalness={0.7} />
          </mesh>
          {/* Nose Cone */}
          <mesh position={[0, 0.65, 0]}>
            <coneGeometry args={[0.08, 0.25, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 5. SUTLI / CHOCOLATE BOMB */}
      <group position={[0, 0, 3]} onClick={triggerBomb} style={{ cursor: 'pointer' }}>
        {/* Green/Jute Wound Bomb Cube */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.35, 0.3, 0.35]} />
          <meshStandardMaterial
            color="#2E7D32"
            roughness={0.9}
            emissive="#FF1744"
            emissiveIntensity={bombActive ? 0.7 : 0}
          />
        </mesh>
        {/* Fuse Cord */}
        <mesh position={[0, 0.35, 0]} rotation={[0.2, 0, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 4]} />
          <meshBasicMaterial color={bombActive ? '#FF3D00' : '#ECEFF1'} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* PARTICLE BUFFERS (SPARKS, SMOKE & AERIAL BURSTS) */}
      {/* ======================================================== */}
      <points ref={sparkPointsRef} geometry={sparkGeo}>
        <pointsMaterial size={0.16} vertexColors transparent opacity={0.95} sizeAttenuation />
      </points>

      <points ref={smokePointsRef} geometry={smokeGeo}>
        <pointsMaterial size={0.65} vertexColors transparent opacity={0.4} sizeAttenuation />
      </points>

      <points ref={aerialPointsRef} geometry={aerialGeo}>
        <pointsMaterial size={0.25} vertexColors transparent opacity={0.95} sizeAttenuation />
      </points>
    </group>
  )
}

