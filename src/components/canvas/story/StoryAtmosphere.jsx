import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import FireworksSystem from '../FireworksSystem'

const DUST_COUNT = 180
const PETAL_COUNT = 140
const EMBER_COUNT = 200

export default function StoryAtmosphere({ sceneIndex = 0, onBarrageDone }) {
  const lightningLight = useRef()
  const bonfireLight = useRef()
  const petalsRef = useRef()
  const embersRef = useRef()
  const dustRef = useRef()

  // 1. Golden Dust for Scene 0 & 1
  const dustData = useMemo(() => {
    return Array.from({ length: DUST_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 25,
      z: (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.2 + Math.random() * 0.4
    }))
  }, [])

  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(DUST_COUNT * 3)
    const col = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = dustData[i].x
      pos[i * 3 + 1] = dustData[i].y
      pos[i * 3 + 2] = dustData[i].z
      col[i * 3] = 1.0
      col[i * 3 + 1] = 0.85
      col[i * 3 + 2] = 0.4
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [dustData])

  // 2. Flower Petals for Scene 3 (Hanuman Milap)
  const petalData = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 35,
      y: 5 + Math.random() * 20,
      z: (Math.random() - 0.5) * 25,
      speedY: 1.0 + Math.random() * 1.5,
      swaySpeed: 1.2 + Math.random() * 2.0,
      swayAmp: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2
    }))
  }, [])

  const petalGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(PETAL_COUNT * 3)
    const col = new Float32Array(PETAL_COUNT * 3)
    for (let i = 0; i < PETAL_COUNT; i++) {
      pos[i * 3] = petalData[i].x
      pos[i * 3 + 1] = petalData[i].y
      pos[i * 3 + 2] = petalData[i].z
      const isMarigold = Math.random() > 0.4
      const c = new THREE.Color(isMarigold ? '#FFB300' : '#E91E63')
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [petalData])

  // 3. Embers for Scene 4 (Ravana Dahan)
  const emberData = useMemo(() => {
    return Array.from({ length: EMBER_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 15,
      speedY: 2.0 + Math.random() * 3.5,
      sway: (Math.random() - 0.5) * 0.8
    }))
  }, [])

  const emberGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(EMBER_COUNT * 3)
    const col = new Float32Array(EMBER_COUNT * 3)
    for (let i = 0; i < EMBER_COUNT; i++) {
      pos[i * 3] = emberData[i].x
      pos[i * 3 + 1] = emberData[i].y
      pos[i * 3 + 2] = emberData[i].z
      col[i * 3] = 1.0
      col[i * 3 + 1] = 0.35 + Math.random() * 0.45
      col[i * 3 + 2] = 0.05
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [emberData])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Scene 2: Lightning flashes
    if (sceneIndex === 2 && lightningLight.current) {
      lightningLight.current.intensity = Math.random() > 0.96 ? 9.0 : 0.2
    }

    // Scene 4: Bonfire flicker
    if (sceneIndex === 4 && bonfireLight.current) {
      bonfireLight.current.intensity = 6.0 + Math.sin(t * 15) * 2.5
    }

    // Petals animation
    if (sceneIndex === 3 && petalsRef.current) {
      const pos = petalsRef.current.geometry.attributes.position
      for (let i = 0; i < PETAL_COUNT; i++) {
        let y = pos.getY(i) - petalData[i].speedY * delta * 2.5
        if (y < -10) y = 20
        pos.setY(i, y)
        const origX = petalData[i].x
        pos.setX(i, origX + Math.sin(t * petalData[i].swaySpeed + petalData[i].phase) * petalData[i].swayAmp)
      }
      pos.needsUpdate = true
    }

    // Embers animation
    if (sceneIndex === 4 && embersRef.current) {
      const pos = embersRef.current.geometry.attributes.position
      for (let i = 0; i < EMBER_COUNT; i++) {
        let y = pos.getY(i) + emberData[i].speedY * delta * 2.0
        if (y > 22) y = -8
        pos.setY(i, y)
        pos.setX(i, pos.getX(i) + Math.sin(t * 2 + i) * 0.02)
      }
      pos.needsUpdate = true
    }

    // Dust animation
    if ((sceneIndex === 0 || sceneIndex === 1) && dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position
      for (let i = 0; i < DUST_COUNT; i++) {
        let y = pos.getY(i) + dustData[i].vy * delta
        if (y > 15) y = -15
        pos.setY(i, y)
      }
      pos.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Dynamic Lighting per scene */}
      {sceneIndex === 2 && (
        <directionalLight
          ref={lightningLight}
          position={[-10, 25, 10]}
          color="#E1BEE7"
          intensity={0.4}
        />
      )}

      {sceneIndex === 4 && (
        <pointLight
          ref={bonfireLight}
          position={[0, 4, 0]}
          color="#FF3D00"
          distance={35}
        />
      )}

      {/* Floating Golden Dust Particles (Scene 0 & 1) */}
      {(sceneIndex === 0 || sceneIndex === 1) && (
        <points ref={dustRef} geometry={dustGeo}>
          <pointsMaterial size={0.18} vertexColors transparent opacity={0.65} sizeAttenuation />
        </points>
      )}

      {/* Shower of Flower Petals (Scene 3 - Hanuman Milap) */}
      {sceneIndex === 3 && (
        <points ref={petalsRef} geometry={petalGeo}>
          <pointsMaterial size={0.38} vertexColors transparent opacity={0.88} sizeAttenuation />
        </points>
      )}

      {/* Rising Embers (Scene 4 - Ravana Dahan) */}
      {sceneIndex === 4 && (
        <points ref={embersRef} geometry={emberGeo}>
          <pointsMaterial size={0.28} vertexColors transparent opacity={0.9} sizeAttenuation />
        </points>
      )}

      {/* Grand Aerial Fireworks (Scene 5 - Ayodhya Return & Finale) */}
      {sceneIndex === 5 && (
        <FireworksSystem
          triggerGrandBarrage={true}
          onBarrageDone={onBarrageDone}
        />
      )}
    </group>
  )
}
