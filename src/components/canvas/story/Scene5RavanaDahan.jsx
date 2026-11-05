import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import StoryBackdrop from './StoryBackdrop'
import {
  LordRamFigure,
  TenHeadedRavanaFigure,
  HanumanJiFigure
} from '../characters/RamayanaCharacters'

const EMBER_COUNT = 300
const SMOKE_COUNT = 60

export default function Scene5RavanaDahan() {
  const embersRef = useRef()
  const flameLightRef = useRef()
  const arrowRef = useRef()

  // Flying fiery embers from burning Ravana
  const emberData = useMemo(() => {
    return Array.from({ length: EMBER_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 12,
      y: Math.random() * 14,
      z: -4 + (Math.random() - 0.5) * 10,
      speedY: 2.5 + Math.random() * 4.0,
      swayX: (Math.random() - 0.5) * 1.5,
      size: 0.15 + Math.random() * 0.35
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

      // Red, Orange, Gold burning ember colors
      const r = 1.0
      const g = 0.2 + Math.random() * 0.7
      const b = 0.05
      col[i * 3] = r
      col[i * 3 + 1] = g
      col[i * 3 + 2] = b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return geo
  }, [emberData])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Flickering bonfire light from burning Ravana
    if (flameLightRef.current) {
      flameLightRef.current.intensity = 8.0 + Math.sin(t * 18) * 2.5 + Math.cos(t * 11) * 1.5
    }

    // Embers rising dynamically into the sky
    if (embersRef.current) {
      const pos = embersRef.current.geometry.attributes.position
      for (let i = 0; i < EMBER_COUNT; i++) {
        let y = pos.getY(i) + emberData[i].speedY * delta
        if (y > 22) {
          y = 0.5 + Math.random() * 2.0
          pos.setX(i, (Math.random() - 0.5) * 10)
        }
        pos.setY(i, y)
        pos.setX(i, pos.getX(i) + Math.sin(t * 3 + i) * 0.03)
      }
      pos.needsUpdate = true
    }

    // Glowing Brahmastra arrow trajectory
    if (arrowRef.current) {
      arrowRef.current.position.z = -2 + Math.sin(t * 2) * 1.5
    }
  })

  return (
    <group>
      {/* Dramatic Battle & Fire Lighting */}
      <ambientLight color="#5D1010" intensity={0.8} />
      <directionalLight
        position={[-15, 20, 15]}
        color="#FFA726"
        intensity={1.5}
        castShadow
      />
      <hemisphereLight skyColor="#FF5722" groundColor="#3E2723" intensity={0.9} />

      {/* 3D Cinematic Story Backdrop */}
      <StoryBackdrop
        src="/scenes/scene5_killing_ravana.jpg"
        position={[0, 11, -20]}
        size={[54, 30]}
        opacity={0.88}
      />

      {/* Burning Ravana Massive Bonfire Light */}
      <pointLight
        ref={flameLightRef}
        position={[0, 6, -5]}
        color="#FF3D00"
        distance={35}
      />

      {/* Battlefield Ground Terrain */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial color="#21100D" roughness={0.9} />
      </mesh>

      {/* Lanka Fortress Wall in distant background */}
      <group position={[0, 0, -18]}>
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[45, 10, 3]} />
          <meshStandardMaterial color="#37474F" roughness={0.8} />
        </mesh>
        {/* Battlements / Crenellations */}
        {[-18, -12, -6, 0, 6, 12, 18].map((x, idx) => (
          <mesh key={idx} position={[x, 10.8, 0]}>
            <boxGeometry args={[2.5, 1.6, 3.2]} />
            <meshStandardMaterial color="#263238" />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* BURNING 10-HEADED RAVANA EFFIGY */}
      {/* ======================================================== */}
      <group position={[0, 0, -5]}>
        {/* 10-Headed Ravana falling in defeat */}
        <TenHeadedRavanaFigure position={[0, 0.5, 0]} scale={1.35} isDefeated={true} />

        {/* Effigy Scaffolding Base */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[6, 0.8, 5]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>

        {/* Dynamic Multi-layered Fire Flames surrounding Ravana */}
        {[
          [-1.5, 2.5, 0.8], [1.5, 2.5, 0.8],
          [0, 4.0, 1.2], [-2.0, 5.0, -0.5],
          [2.0, 5.0, -0.5], [0, 7.5, 0]
        ].map((pos, idx) => (
          <group key={idx} position={pos}>
            {/* Outer Orange Flame Cone */}
            <mesh rotation={[0, 0, 0.1]}>
              <coneGeometry args={[1.2, 3.5, 8]} />
              <meshBasicMaterial color="#FF6D00" transparent opacity={0.7} />
            </mesh>
            {/* Inner Yellow Core */}
            <mesh position={[0, -0.2, 0]}>
              <coneGeometry args={[0.7, 2.8, 8]} />
              <meshBasicMaterial color="#FFEB3B" transparent opacity={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Rising Embers and Fire Sparks */}
      <points ref={embersRef} geometry={emberGeo}>
        <pointsMaterial
          size={0.35}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* ======================================================== */}
      {/* SHRI RAM & HEROIC VANAR SENA */}
      {/* ======================================================== */}

      {/* Lord Ram aiming the Brahmastra from his golden chariot */}
      <group position={[-5.5, 0, 4]}>
        {/* Golden Battle Chariot (Rath) */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[3.2, 1.6, 4.5]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Chariot Wheels */}
        <mesh position={[-1.7, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 16]} />
          <meshStandardMaterial color="#FFB300" metalness={0.9} />
        </mesh>
        <mesh position={[1.7, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 16]} />
          <meshStandardMaterial color="#FFB300" metalness={0.9} />
        </mesh>
        {/* Lord Ram atop the chariot */}
        <LordRamFigure position={[0, 1.6, 0.3]} scale={1.1} pose="ARCHER" />
      </group>

      {/* Heroic Hanuman Ji charging with his Gada */}
      <HanumanJiFigure position={[-1.8, 0, 2.5]} scale={1.05} />

      {/* Vanar Warriors cheering and holding maces */}
      {[-8, -7, 6, 7.5].map((x, idx) => (
        <group key={idx} position={[x, 0, 3 + idx * 0.8]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.35, 0.3, 1.4, 8]} />
            <meshStandardMaterial color="#E65100" />
          </mesh>
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.28, 8, 8]} />
            <meshStandardMaterial color="#FF8A65" />
          </mesh>
          {/* Raised Mace */}
          <mesh position={[0.4, 2.2, 0]} rotation={[0.4, 0, 0.6]}>
            <cylinderGeometry args={[0.04, 0.08, 1.8, 6]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
        </group>
      ))}

      {/* Victorious Fireworks already beginning in high sky */}
      {[[-8, 16, -10], [8, 18, -12], [0, 20, -15]].map((pos, idx) => (
        <group key={idx} position={pos}>
          <pointLight color={idx === 1 ? '#00E676' : '#FFD700'} intensity={6} distance={20} />
          <mesh>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color="#FFF9C4" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

