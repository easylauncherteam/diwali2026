import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import StoryBackdrop from './StoryBackdrop'
import {
  LordRamFigure,
  LakshmanFigure,
  GoldenDeerFigure,
  PushpakVimanFigure,
  JatayuFigure
} from '../characters/RamayanaCharacters'

export default function Scene3SitaHaran() {
  const lightningLightRef = useRef()
  const rekhaRingRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Random dramatic lightning flashes
    if (lightningLightRef.current) {
      const isFlash = Math.random() > 0.96
      lightningLightRef.current.intensity = isFlash ? 8.0 : 0.4
    }

    // Glowing pulsating Lakshman Rekha
    if (rekhaRingRef.current) {
      rekhaRingRef.current.material.opacity = 0.6 + Math.sin(t * 5) * 0.35
    }
  })

  return (
    <group>
      {/* Dramatic Lightning & Storm Atmosphere */}
      <ambientLight color="#311B92" intensity={0.6} />
      <directionalLight
        ref={lightningLightRef}
        position={[-10, 30, 10]}
        color="#E1BEE7"
        intensity={0.8}
        castShadow
      />
      <hemisphereLight skyColor="#4A148C" groundColor="#1A237E" intensity={0.6} />

      {/* 3D Cinematic Story Backdrop */}
      <StoryBackdrop
        src="/scenes/scene3_sita_haran.jpg"
        position={[0, 11, -19]}
        size={[52, 29]}
        opacity={0.88}
      />

      {/* Forest Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial color="#1B2E18" roughness={0.9} />
      </mesh>

      {/* Panchavati Kutiya (Cottage) */}
      <group position={[0, 0, -6]}>
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[7, 3.6, 5]} />
          <meshStandardMaterial color="#4E342E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 4.3, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[5.2, 2.6, 4]} />
          <meshStandardMaterial color="#3E2723" roughness={0.95} />
        </mesh>
        {/* Doorway */}
        <mesh position={[0, 1.2, 2.55]}>
          <boxGeometry args={[1.6, 2.4, 0.1]} />
          <meshBasicMaterial color="#0A0503" />
        </mesh>
      </group>

      {/* Sacred Protective LAKSHMAN REKHA Glowing Line */}
      <group position={[0, 0.04, -2.5]}>
        <mesh ref={rekhaRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.6, 48]} />
          <meshBasicMaterial
            color="#FFD700"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
        <pointLight color="#FFD700" intensity={3.5} distance={8} />
      </group>

      {/* Forest Trees surrounding Panchavati */}
      {[[-11, 0, -5], [-8, 0, -11], [8, 0, -10], [12, 0, -3], [-13, 0, 4], [10, 0, 6]].map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.5, 0.8, 6, 8]} />
            <meshStandardMaterial color="#3E2723" roughness={0.9} />
          </mesh>
          <mesh position={[0, 6.5, 0]}>
            <dodecahedronGeometry args={[2.8]} />
            <meshStandardMaterial color="#1B5E20" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Golden Deer (Swarna Mriga) fleeing into the forest */}
      <GoldenDeerFigure position={[7, 0, -2]} scale={0.95} />

      {/* Lord Ram running into the forest after the golden deer */}
      <LordRamFigure position={[3.5, 0, -3.5]} scale={1.0} pose="ARCHER" />

      {/* Lakshman standing reluctantly outside the cottage */}
      <LakshmanFigure position={[-2.8, 0, -2.2]} scale={0.98} />

      {/* Mendicant / Ascetic Sage Ravana standing right outside the Lakshman Rekha */}
      <group position={[0, 0, 1.2]}>
        {/* Saffron Robed Disguise */}
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.48, 0.38, 1.4, 10]} />
          <meshStandardMaterial color="#FF6F00" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.38, 0.6, 1.6, 10]} />
          <meshStandardMaterial color="#E65100" roughness={0.7} />
        </mesh>
        {/* Head with matted sadhu hair */}
        <mesh position={[0, 3.4, 0]}>
          <sphereGeometry args={[0.38, 12, 12]} />
          <meshStandardMaterial color="#795548" />
        </mesh>
        <mesh position={[0, 3.85, 0]}>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
        {/* Begging Bowl (Kamandalu) & Staff (Trishul / Danda) */}
        <mesh position={[0.45, 2.2, 0.3]}>
          <sphereGeometry args={[0.16, 8, 8]} scale={[1, 1.2, 1]} />
          <meshStandardMaterial color="#C68B16" metalness={0.8} />
        </mesh>
        <mesh position={[-0.45, 2.4, 0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 2.6, 6]} />
          <meshStandardMaterial color="#4E342E" />
        </mesh>
      </group>

      {/* MID-AIR DRAMA: Pushpak Viman Abduction & Valiant Jatayu */}
      {/* Pushpak Viman fleeing in stormy skies */}
      <PushpakVimanFigure position={[-5, 9.5, 3]} scale={1.2} />

      {/* Brave Jatayu soaring in mid-air attack against Ravana's chariot */}
      <JatayuFigure position={[1, 11, 4]} scale={1.15} />
    </group>
  )
}

