import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import StoryBackdrop from './StoryBackdrop'
import {
  LordRamFigure,
  LakshmanFigure,
  HanumanJiFigure
} from '../characters/RamayanaCharacters'

const PETAL_COUNT = 150

export default function Scene4HanumanMilap() {
  const petalsMeshRef = useRef()
  const celestialLightRef = useRef()

  // Flying flower petals
  const petalData = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 35,
      y: 5 + Math.random() * 20,
      z: (Math.random() - 0.5) * 25,
      speedY: 0.8 + Math.random() * 1.2,
      swaySpeed: 1.2 + Math.random() * 2.0,
      swayAmp: 0.2 + Math.random() * 0.3,
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

      // Marigold & Rose
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

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (petalsMeshRef.current) {
      const pos = petalsMeshRef.current.geometry.attributes.position
      for (let i = 0; i < PETAL_COUNT; i++) {
        let y = pos.getY(i) - petalData[i].speedY * delta * 2.5
        if (y < 0) y = 22
        pos.setY(i, y)

        const origX = petalData[i].x
        pos.setX(i, origX + Math.sin(t * petalData[i].swaySpeed + petalData[i].phase) * petalData[i].swayAmp)
      }
      pos.needsUpdate = true
    }

    if (celestialLightRef.current) {
      celestialLightRef.current.intensity = 2.5 + Math.sin(t * 1.5) * 0.6
    }
  })

  return (
    <group>
      {/* Divine Golden Rays & Mountain Atmosphere */}
      <ambientLight color="#FFE082" intensity={0.9} />
      <directionalLight
        ref={celestialLightRef}
        position={[15, 28, 15]}
        color="#FFE082"
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight skyColor="#FFE082" groundColor="#37474F" intensity={0.8} />

      {/* 3D Cinematic Story Backdrop */}
      <StoryBackdrop
        src="/scenes/scene4_hanuman_milap.jpg"
        position={[0, 10, -18]}
        size={[50, 28]}
        opacity={0.88}
      />

      {/* Kishkindha Mountain Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial color="#37474F" roughness={0.85} />
      </mesh>

      {/* Mountain Cliffs & Rocks */}
      {[-12, -7, 7, 12].map((x, idx) => (
        <group key={idx} position={[x, 0, -8 - idx * 2]}>
          <mesh position={[0, 4.5, 0]}>
            <coneGeometry args={[4.5 + idx * 0.5, 9, 6]} />
            <meshStandardMaterial color="#455A64" roughness={0.9} />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <dodecahedronGeometry args={[2.5]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Sacred Asana Rock where Ram stands */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.8, 16]} />
        <meshStandardMaterial color="#546E7A" roughness={0.7} />
      </mesh>

      {/* ======================================================== */}
      {/* 3D CHARACTERS: RAM, LAKSHMAN & DEVOTED HANUMAN JI */}
      {/* ======================================================== */}

      {/* Lord Ram in serene divine stance, receiving Hanuman */}
      <LordRamFigure position={[0, 0.8, 0]} scale={1.08} pose="BLESSING" />

      {/* Lakshman watching with joy */}
      <LakshmanFigure position={[-2.2, 0, 0.4]} scale={0.98} />

      {/* Hanuman Ji bowing reverently at Ram's feet */}
      <HanumanJiFigure position={[0, 0, 2.2]} scale={1.02} pose="DEVOTION" />

      {/* Sugriva & Vanar Warriors on Rocky Cliffs */}
      {[-5, 4.5, 6.5].map((x, idx) => (
        <group key={idx} position={[x, 1.5 + idx * 0.8, -4 + idx * 1.2]}>
          {/* Warrior Body */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.4, 0.35, 1.4, 8]} />
            <meshStandardMaterial color="#E65100" />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#FF8A65" />
          </mesh>
          {/* Saffron Flag held high */}
          <mesh position={[0.4, 2.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.6, 6]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh position={[0.7, 3.2, 0]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.2, 0.7, 3]} rotation={[0, 0, Math.PI / 2]} />
            <meshBasicMaterial color="#FF6D00" />
          </mesh>
        </group>
      ))}

      {/* Floating Pushpa Vrishti (Flower Petals) */}
      <points ref={petalsMeshRef} geometry={petalGeo}>
        <pointsMaterial
          size={0.4}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Divine Connecting Halo Light Beam */}
      <pointLight position={[0, 2.5, 1.0]} color="#FFD700" intensity={5} distance={10} />
    </group>
  )
}

