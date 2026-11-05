import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SMOKE_PUFF_COUNT = 90
const PETAL_COUNT = 240
const GOLDEN_DUST_COUNT = 500

export default function SmokeAndAtmosphere() {
  const smokeGroupRef = useRef()
  const petalsMeshRef = useRef()
  const dustMeshRef = useRef()

  // 1. CELESTIAL FULL MOON WITH AURA
  const moonRef = useRef()

  // 2. PROCEDURAL VOLUMETRIC SMOKE PUFFS
  const smokePuffs = useMemo(() => {
    const list = []
    for (let i = 0; i < SMOKE_PUFF_COUNT; i++) {
      list.push({
        x: (Math.random() - 0.5) * 85,
        y: 8 + Math.random() * 26,
        z: -10 - Math.random() * 35,
        scale: 4.5 + Math.random() * 7.5,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        driftSpeedX: 0.15 + Math.random() * 0.25,
        driftSpeedY: 0.08 + Math.random() * 0.12,
        opacity: 0.12 + Math.random() * 0.16,
        color: Math.random() > 0.4 ? '#FFF8E1' : (Math.random() > 0.5 ? '#FFE082' : '#B0BEC5')
      })
    }
    return list
  }, [])

  // 3. FALLING FLOWER PETALS (PUSHPA VRISHTI)
  const petalGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(PETAL_COUNT * 3)
    const colors = new Float32Array(PETAL_COUNT * 3)
    const rotations = new Float32Array(PETAL_COUNT * 3)

    for (let i = 0; i < PETAL_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = Math.random() * 35
      positions[i * 3 + 2] = 12 - Math.random() * 35

      // Mix of Royal Marigold (Genda - Orange/Yellow) and Divine Rose (Red)
      const isMarigold = Math.random() > 0.35
      const color = new THREE.Color(
        isMarigold ? (Math.random() > 0.5 ? '#FF9800' : '#FFD54F') : '#E91E63'
      )
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  const petalSpeeds = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }).map(() => ({
      fallSpeed: 1.2 + Math.random() * 1.6,
      swaySpeed: 1.5 + Math.random() * 2.5,
      swayAmp: 0.35 + Math.random() * 0.4,
      rotSpeed: 0.8 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    }))
  }, [])

  // 4. FLOATING GOLDEN DIVINE PARTICLES (STARDUST)
  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(GOLDEN_DUST_COUNT * 3)
    for (let i = 0; i < GOLDEN_DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70
      positions[i * 3 + 1] = -1 + Math.random() * 32
      positions[i * 3 + 2] = 20 - Math.random() * 55
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  // Animation Frame
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // 1. Drift & Disperse Smoke Clouds
    if (smokeGroupRef.current) {
      smokeGroupRef.current.children.forEach((child, i) => {
        const p = smokePuffs[i]
        if (!p) return
        child.position.x += p.driftSpeedX * delta
        child.position.y += p.driftSpeedY * delta
        child.rotation.z += p.rotSpeed * delta

        // Loop smoke cloud back seamlessly
        if (child.position.x > 50) child.position.x = -50
        if (child.position.y > 36) child.position.y = 8
      })
    }

    // 2. Cascade Flower Petals (Oscillating flutter down)
    if (petalsMeshRef.current) {
      const pos = petalsMeshRef.current.geometry.attributes.position.array
      for (let i = 0; i < PETAL_COUNT; i++) {
        const sp = petalSpeeds[i]
        const idx = i * 3

        pos[idx + 1] -= sp.fallSpeed * delta // fall downwards
        pos[idx] += Math.sin(time * sp.swaySpeed + sp.phase) * delta * sp.swayAmp // sway X
        pos[idx + 2] += Math.cos(time * sp.swaySpeed + sp.phase) * delta * 0.2 // sway Z

        // Wrap around back to top
        if (pos[idx + 1] < -2) {
          pos[idx + 1] = 34 + Math.random() * 4
          pos[idx] = (Math.random() - 0.5) * 60
        }
      }
      petalsMeshRef.current.geometry.attributes.position.needsUpdate = true
    }

    // 3. Gentle Golden Dust Floating
    if (dustMeshRef.current) {
      const pos = dustMeshRef.current.geometry.attributes.position.array
      for (let i = 0; i < GOLDEN_DUST_COUNT; i++) {
        const idx = i * 3
        pos[idx + 1] += Math.sin(time + i) * 0.008
        pos[idx] += Math.cos(time * 0.5 + i) * 0.005
      }
      dustMeshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* ======================================================== */}
      {/* 1. CINEMATIC FULL MOON (SHARAD PURNIMA MOON) */}
      {/* ======================================================== */}
      <group position={[-25, 34, -48]}>
        {/* Glowing Lunar Disc */}
        <mesh ref={moonRef}>
          <circleGeometry args={[5.2, 32]} />
          <meshBasicMaterial color="#FFF9C4" />
        </mesh>
        {/* Soft Lunar Halo Aura Rings */}
        <mesh position={[0, 0, -0.1]}>
          <circleGeometry args={[7.5, 32]} />
          <meshBasicMaterial color="#E0F7FA" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.2]}>
          <circleGeometry args={[11.0, 32]} />
          <meshBasicMaterial color="#80DEEA" transparent opacity={0.12} />
        </mesh>
        {/* Moonlight Directional / Ambient illumination */}
        <directionalLight
          position={[-5, 8, 10]}
          color="#B3E5FC"
          intensity={0.65}
          castShadow
        />
      </group>

      {/* ======================================================== */}
      {/* 2. 3D DHUA / VOLUMETRIC SMOKE CLOUDS FROM FIREWORKS */}
      {/* ======================================================== */}
      <group ref={smokeGroupRef}>
        {smokePuffs.map((puff, i) => (
          <mesh
            key={i}
            position={[puff.x, puff.y, puff.z]}
            scale={[puff.scale, puff.scale * 0.65, puff.scale]}
          >
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial
              color={puff.color}
              transparent
              opacity={puff.opacity}
              roughness={0.9}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* River Mist Hugging Saryu Surface */}
      <mesh position={[0, -1.2, 24]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 40]} />
        <meshBasicMaterial color="#B0BEC5" transparent opacity={0.08} depthWrite={false} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. FLOWER PETAL SHOWER (PUSHPA VRISHTI) */}
      {/* ======================================================== */}
      <points ref={petalsMeshRef}>
        <primitive object={petalGeo} attach="geometry" />
        <pointsMaterial
          size={0.45}
          vertexColors
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </points>

      {/* ======================================================== */}
      {/* 4. GOLDEN DIVINE PARTICLES (STARDUST) */}
      {/* ======================================================== */}
      <points ref={dustMeshRef}>
        <primitive object={dustGeo} attach="geometry" />
        <pointsMaterial
          size={0.18}
          color="#FFD700"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
