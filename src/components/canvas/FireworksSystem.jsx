import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundEngine } from '../../audio/soundEngine'

// Particle count limits for silky smooth 60+ FPS
const MAX_AERIAL_PARTICLES = 3500
const MAX_ROCKET_TRAILS = 600
const MAX_ANAAR_PARTICLES = 1200
const MAX_CHAKRI_PARTICLES = 800

const FESTIVE_PALETTES = [
  ['#FFD700', '#FFA000', '#FF5722', '#FFE082'], // Royal Gold & Saffron
  ['#FF1744', '#FF4081', '#F50057', '#FF80AB'], // Radiant Gulal & Ruby
  ['#00E676', '#76FF03', '#1DE9B6', '#B9F6CA'], // Emerald & Shubh Green
  ['#00E5FF', '#2979FF', '#651FFF', '#80D8FF'], // Celestial Indigo & Sky Blue
  ['#FFD600', '#FF6D00', '#DD2C00', '#FFFFFF'], // Diya Deep Flame & White Spark
]

export default function FireworksSystem({ triggerGrandBarrage = false, onBarrageDone, interactiveRocket = null }) {
  // Aerial Bursts State
  const aerialMeshRef = useRef()
  const rocketsMeshRef = useRef()
  const anaarMeshRef = useRef()
  const chakriMeshRef = useRef()

  // Dynamic point light that flashes during aerial explosions
  const explosionLightRef = useRef()

  // Particle data pools
  const aerialParticles = useRef([])
  const rocketParticles = useRef([])
  const anaarParticles = useRef([])
  const chakriParticles = useRef([])

  // Chakri angle
  const chakriAngle = useRef(0)

  // Initialize Buffer Geometries
  const aerialGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_AERIAL_PARTICLES * 3)
    const colors = new Float32Array(MAX_AERIAL_PARTICLES * 3)
    const sizes = new Float32Array(MAX_AERIAL_PARTICLES)

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [])

  const rocketGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_ROCKET_TRAILS * 3)
    const colors = new Float32Array(MAX_ROCKET_TRAILS * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  const anaarGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_ANAAR_PARTICLES * 3)
    const colors = new Float32Array(MAX_ANAAR_PARTICLES * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  const chakriGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_CHAKRI_PARTICLES * 3)
    const colors = new Float32Array(MAX_CHAKRI_PARTICLES * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  // Spawner function: Aerial Burst
  const triggerAerialBurst = (originX, originY, originZ, palette = null) => {
    const pal = palette || FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)]
    const count = 140 + Math.floor(Math.random() * 80)
    const threeColor = new THREE.Color(pal[0])

    // Flash explosion light
    if (explosionLightRef.current) {
      explosionLightRef.current.position.set(originX, originY, originZ)
      explosionLightRef.current.color.set(pal[0])
      explosionLightRef.current.intensity = 8.0
    }

    soundEngine.playExplosion('grand')

    for (let i = 0; i < count; i++) {
      if (aerialParticles.current.length >= MAX_AERIAL_PARTICLES) {
        aerialParticles.current.shift()
      }

      // Spherical random velocity
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const speed = 7.0 + Math.random() * 12.0

      const vx = speed * Math.sin(phi) * Math.cos(theta)
      const vy = speed * Math.sin(phi) * Math.sin(theta)
      const vz = speed * Math.cos(phi)

      const colorHex = pal[Math.floor(Math.random() * pal.length)]
      const pColor = new THREE.Color(colorHex)

      aerialParticles.current.push({
        x: originX,
        y: originY,
        z: originZ,
        vx,
        vy,
        vz,
        color: pColor,
        life: 1.0,
        decay: 0.35 + Math.random() * 0.35,
        size: 3.5 + Math.random() * 3.5
      })
    }
  }

  // Spawner function: Rocket Launch
  const launchRocket = (startX, targetY) => {
    soundEngine.playRocketLaunch()
    const targetHeight = targetY || (28 + Math.random() * 15)
    const targetX = startX + (Math.random() - 0.5) * 8
    const targetZ = -10 - Math.random() * 25

    const rocket = {
      x: startX,
      y: 0,
      z: targetZ,
      vy: 24 + Math.random() * 8,
      targetY: targetHeight,
      palette: FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)]
    }

    // Push into active rockets
    activeRockets.current.push(rocket)
  }

  const activeRockets = useRef([])

  // Watch for external interactive launch triggers
  useEffect(() => {
    if (interactiveRocket) {
      launchRocket(interactiveRocket.x || 0, interactiveRocket.targetY || 35)
    }
  }, [interactiveRocket])

  // Watch for Grand Celebration Barrage button trigger
  useEffect(() => {
    if (triggerGrandBarrage) {
      soundEngine.playShankh()
      soundEngine.playTempleBell(1.0)

      // Staggered grand volley of 12 rockets & fireworks across the sky
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const rx = (Math.random() - 0.5) * 60
          launchRocket(rx, 30 + Math.random() * 18)
        }, i * 350)
      }

      if (onBarrageDone) {
        setTimeout(onBarrageDone, 4800)
      }
    }
  }, [triggerGrandBarrage])

  // Automatic background fireworks cadence
  const nextAutoLaunch = useRef(2.5)

  // Animation Loop
  useFrame((_, delta) => {
    // Dim explosion light back down smoothly
    if (explosionLightRef.current && explosionLightRef.current.intensity > 0) {
      explosionLightRef.current.intensity = Math.max(0, explosionLightRef.current.intensity - delta * 14.0)
    }

    // Auto launcher timer
    nextAutoLaunch.current -= delta
    if (nextAutoLaunch.current <= 0) {
      launchRocket((Math.random() - 0.5) * 50, 26 + Math.random() * 16)
      nextAutoLaunch.current = 2.2 + Math.random() * 2.5
    }

    // 1. UPDATE ROCKETS
    for (let rIdx = activeRockets.current.length - 1; rIdx >= 0; rIdx--) {
      const r = activeRockets.current[rIdx]
      r.y += r.vy * delta

      // Emit rocket trail sparks
      if (rocketParticles.current.length < MAX_ROCKET_TRAILS) {
        rocketParticles.current.push({
          x: r.x + (Math.random() - 0.5) * 0.3,
          y: r.y - 0.5,
          z: r.z + (Math.random() - 0.5) * 0.3,
          color: new THREE.Color('#FFB300'),
          life: 1.0,
          decay: 2.2
        })
      }

      // Check if rocket reached peak
      if (r.y >= r.targetY) {
        triggerAerialBurst(r.x, r.y, r.z, r.palette)
        activeRockets.current.splice(rIdx, 1)
      }
    }

    // 2. UPDATE ROCKET TRAILS
    const rPositions = rocketGeo.attributes.position.array
    const rColors = rocketGeo.attributes.color.array
    let rCount = 0

    for (let i = rocketParticles.current.length - 1; i >= 0; i--) {
      const p = rocketParticles.current[i]
      p.life -= p.decay * delta
      if (p.life <= 0) {
        rocketParticles.current.splice(i, 1)
        continue
      }
      p.y -= delta * 1.5 // gentle drift down

      const idx = rCount * 3
      rPositions[idx] = p.x
      rPositions[idx + 1] = p.y
      rPositions[idx + 2] = p.z

      rColors[idx] = p.color.r * p.life
      rColors[idx + 1] = p.color.g * p.life
      rColors[idx + 2] = p.color.b * p.life
      rCount++
    }
    // Clear rest
    for (let i = rCount; i < MAX_ROCKET_TRAILS; i++) {
      rPositions[i * 3 + 1] = -9999
    }
    rocketGeo.attributes.position.needsUpdate = true
    rocketGeo.attributes.color.needsUpdate = true

    // 3. UPDATE AERIAL BURST PARTICLES
    const aPositions = aerialGeo.attributes.position.array
    const aColors = aerialGeo.attributes.color.array
    const aSizes = aerialGeo.attributes.size.array
    let aCount = 0

    for (let i = aerialParticles.current.length - 1; i >= 0; i--) {
      const p = aerialParticles.current[i]
      p.life -= p.decay * delta
      if (p.life <= 0) {
        aerialParticles.current.splice(i, 1)
        continue
      }

      // Physics: Velocity, Drag, Gravity
      p.vx *= 0.95
      p.vz *= 0.95
      p.vy = p.vy * 0.95 - 4.5 * delta // gravity pull down

      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta

      const idx = aCount * 3
      aPositions[idx] = p.x
      aPositions[idx + 1] = p.y
      aPositions[idx + 2] = p.z

      aColors[idx] = p.color.r * p.life
      aColors[idx + 1] = p.color.g * p.life
      aColors[idx + 2] = p.color.b * p.life
      aSizes[aCount] = p.size * (0.4 + p.life * 0.6)
      aCount++
    }
    for (let i = aCount; i < MAX_AERIAL_PARTICLES; i++) {
      aPositions[i * 3 + 1] = -9999
    }
    aerialGeo.attributes.position.needsUpdate = true
    aerialGeo.attributes.color.needsUpdate = true
    aerialGeo.attributes.size.needsUpdate = true

    // 4. UPDATE ANAAR FOUNTAIN PARTICLES (Located on Left & Right Promenade)
    const anaarOrigins = [
      [-12, 2.7, 5],
      [12, 2.7, 5],
    ]
    anaarOrigins.forEach((orig) => {
      // Emit continuous sparks
      for (let k = 0; k < 4; k++) {
        if (anaarParticles.current.length < MAX_ANAAR_PARTICLES) {
          const speed = 7.0 + Math.random() * 5.5
          const spread = 0.35
          anaarParticles.current.push({
            x: orig[0],
            y: orig[1],
            z: orig[2],
            vx: (Math.random() - 0.5) * spread * speed,
            vy: speed,
            vz: (Math.random() - 0.5) * spread * speed,
            color: new THREE.Color(Math.random() > 0.3 ? '#FFF9C4' : '#FFA000'),
            life: 1.0,
            decay: 0.9 + Math.random() * 0.6
          })
        }
      }
    })

    const anPositions = anaarGeo.attributes.position.array
    const anColors = anaarGeo.attributes.color.array
    let anCount = 0

    for (let i = anaarParticles.current.length - 1; i >= 0; i--) {
      const p = anaarParticles.current[i]
      p.life -= p.decay * delta
      if (p.life <= 0) {
        anaarParticles.current.splice(i, 1)
        continue
      }
      p.vy -= 12.0 * delta // gravity pulling sparks down like a fountain
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta

      const idx = anCount * 3
      anPositions[idx] = p.x
      anPositions[idx + 1] = p.y
      anPositions[idx + 2] = p.z

      anColors[idx] = p.color.r * p.life
      anColors[idx + 1] = p.color.g * p.life
      anColors[idx + 2] = p.color.b * p.life
      anCount++
    }
    for (let i = anCount; i < MAX_ANAAR_PARTICLES; i++) {
      anPositions[i * 3 + 1] = -9999
    }
    anaarGeo.attributes.position.needsUpdate = true
    anaarGeo.attributes.color.needsUpdate = true

    // 5. UPDATE SPINNING CHAKRI (Ground Wheel Spinner on Ghats)
    chakriAngle.current += delta * 16.0 // high speed rotation
    const chakriOrigins = [
      [-6, 0.4, 4],
      [6, 0.4, 4]
    ]

    chakriOrigins.forEach((orig) => {
      for (let k = 0; k < 3; k++) {
        if (chakriParticles.current.length < MAX_CHAKRI_PARTICLES) {
          const angle = chakriAngle.current + (k * (Math.PI * 2)) / 3
          const speed = 5.0 + Math.random() * 4.0
          chakriParticles.current.push({
            x: orig[0],
            y: orig[1] + 0.1,
            z: orig[2],
            vx: Math.cos(angle) * speed,
            vy: 0.4 + Math.random() * 0.8,
            vz: Math.sin(angle) * speed,
            color: new THREE.Color(Math.random() > 0.5 ? '#FFD700' : '#FF6D00'),
            life: 1.0,
            decay: 2.2
          })
        }
      }
    })

    const chPositions = chakriGeo.attributes.position.array
    const chColors = chakriGeo.attributes.color.array
    let chCount = 0

    for (let i = chakriParticles.current.length - 1; i >= 0; i--) {
      const p = chakriParticles.current[i]
      p.life -= p.decay * delta
      if (p.life <= 0) {
        chakriParticles.current.splice(i, 1)
        continue
      }
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta

      const idx = chCount * 3
      chPositions[idx] = p.x
      chPositions[idx + 1] = p.y
      chPositions[idx + 2] = p.z

      chColors[idx] = p.color.r * p.life
      chColors[idx + 1] = p.color.g * p.life
      chColors[idx + 2] = p.color.b * p.life
      chCount++
    }
    for (let i = chCount; i < MAX_CHAKRI_PARTICLES; i++) {
      chPositions[i * 3 + 1] = -9999
    }
    chakriGeo.attributes.position.needsUpdate = true
    chakriGeo.attributes.color.needsUpdate = true
  })

  return (
    <group>
      {/* Dynamic Flash Light for Aerial Explosions */}
      <pointLight ref={explosionLightRef} intensity={0} distance={90} />

      {/* Aerial Bursts Mesh */}
      <points ref={aerialMeshRef}>
        <primitive object={aerialGeo} attach="geometry" />
        <pointsMaterial
          size={0.65}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Rocket Ascending Trails Mesh */}
      <points ref={rocketsMeshRef}>
        <primitive object={rocketGeo} attach="geometry" />
        <pointsMaterial
          size={0.35}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Anaar Fountains Mesh */}
      <points ref={anaarMeshRef}>
        <primitive object={anaarGeo} attach="geometry" />
        <pointsMaterial
          size={0.32}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Chakri Spinners Mesh */}
      <points ref={chakriMeshRef}>
        <primitive object={chakriGeo} attach="geometry" />
        <pointsMaterial
          size={0.28}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
