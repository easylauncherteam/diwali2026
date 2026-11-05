import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import StoryBackdrop from './StoryBackdrop'
import {
  LordRamFigure,
  MataSitaFigure,
  LakshmanFigure,
  KingDasharathFigure,
  QueenKaushalyaFigure
} from '../characters/RamayanaCharacters'

export default function Scene1DasharathVanvas({ useDashrathFarewell = false }) {
  const torchLight1 = useRef()
  const torchLight2 = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Subtle torch flicker
    if (torchLight1.current) {
      torchLight1.current.intensity = 2.5 + Math.sin(t * 12) * 0.4 + Math.cos(t * 7) * 0.3
    }
    if (torchLight2.current) {
      torchLight2.current.intensity = 2.5 + Math.cos(t * 14) * 0.4 + Math.sin(t * 9) * 0.3
    }
  })

  return (
    <group>
      {/* Atmospheric Dusk Lights */}
      <ambientLight color="#5D4037" intensity={0.9} />
      <directionalLight
        position={[-15, 20, 15]}
        color="#FF8A65"
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight skyColor="#FFAB91" groundColor="#3E2723" intensity={0.8} />

      {/* 3D Cinematic Story Backdrop */}
      <StoryBackdrop
        src={useDashrathFarewell ? "/scenes/scene1_dashrath_bichadna.jpg" : "/scenes/scene1_vanvas.jpg"}
        position={[0, 9, -15]}
        size={[48, 27]}
        opacity={0.88}
      />

      {/* ======================================================== */}
      {/* 3D ROYAL PALACE ARCHITECTURE */}
      {/* ======================================================== */}
      {/* Marble & Golden Palace Courtyard Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#3E2723"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Royal Red Carpet leading out of the palace */}
      <mesh position={[0, 0.02, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 32]} />
        <meshStandardMaterial color="#880E4F" roughness={0.7} />
      </mesh>
      {/* Golden Carpet Border */}
      <mesh position={[-2.3, 0.03, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} />
      </mesh>
      <mesh position={[2.3, 0.03, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} />
      </mesh>

      {/* Grand Royal Throne (Simhasana) */}
      <group position={[0, 0.5, -9]}>
        {/* Throne Base Platform */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[6.5, 0.8, 4.5]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Throne High Backrest with Sun (Surya) Crest */}
        <mesh position={[0, 3.8, -1.8]}>
          <boxGeometry args={[4.2, 5.5, 0.6]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.4} />
        </mesh>
        <mesh position={[0, 6.6, -1.8]}>
          <circleGeometry args={[1.6, 24]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.3} />
        </mesh>
        {/* Golden Lions flanking throne */}
        <mesh position={[-2.4, 1.2, 0.5]}>
          <boxGeometry args={[0.8, 1.6, 1.8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} />
        </mesh>
        <mesh position={[2.4, 1.2, 0.5]}>
          <boxGeometry args={[0.8, 1.6, 1.8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} />
        </mesh>
      </group>

      {/* Royal Palace Pillars */}
      {[-8, -4, 4, 8].map((x, idx) => (
        <group key={idx} position={[x, 0, -4]}>
          {/* Pillar Base */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.4, 1.0, 1.4]} />
            <meshStandardMaterial color="#D7CCC8" roughness={0.6} />
          </mesh>
          {/* Pillar Column */}
          <mesh position={[0, 5.0, 0]}>
            <cylinderGeometry args={[0.55, 0.6, 8.5, 16]} />
            <meshStandardMaterial color="#FFECB3" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Golden Capital */}
          <mesh position={[0, 9.4, 0]}>
            <boxGeometry args={[1.5, 0.8, 1.5]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Palace Royal Arched Gateway */}
      <group position={[0, 9.6, -4]}>
        <mesh>
          <boxGeometry args={[19, 1.4, 1.6]} />
          <meshStandardMaterial color="#D7CCC8" roughness={0.5} />
        </mesh>
      </group>

      {/* Torches with Flickering Fire */}
      <group position={[-5, 3.5, -4]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} scale={[1, 1.5, 1]} />
          <meshBasicMaterial color="#FF6D00" />
        </mesh>
        <pointLight ref={torchLight1} position={[0, 0.8, 0]} color="#FF9100" distance={12} />
      </group>

      <group position={[5, 3.5, -4]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} scale={[1, 1.5, 1]} />
          <meshBasicMaterial color="#FF6D00" />
        </mesh>
        <pointLight ref={torchLight2} position={[0, 0.8, 0]} color="#FF9100" distance={12} />
      </group>

      {/* ======================================================== */}
      {/* 3D CHARACTERS */}
      {/* ======================================================== */}

      {/* King Dasharath near the throne, arms outstretched in sorrow */}
      <KingDasharathFigure position={[-1.6, 0.5, -6.5]} scale={1.05} />

      {/* Queen Kaushalya beside Dasharath, weeping */}
      <QueenKaushalyaFigure position={[-3.6, 0.5, -6.0]} scale={0.96} />

      {/* Lord Ram, preparing for exile, turned respectfully toward Dasharath */}
      <LordRamFigure position={[0.5, 0, -1.5]} scale={1.0} pose="EXILE" />

      {/* Mata Sita standing lovingly beside Ram */}
      <MataSitaFigure position={[2.2, 0, -1.8]} scale={0.95} />

      {/* Lakshman standing with bow and quiver */}
      <LakshmanFigure position={[-1.2, 0, -1.0]} scale={0.97} />

      {/* Grieving Citizens / Ministers in Background */}
      {[-7, -6, 6, 7.5].map((x, idx) => (
        <group key={idx} position={[x, 0, 2 + idx * 1.5]}>
          <mesh position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 2.6, 8]} />
            <meshStandardMaterial color="#795548" roughness={0.8} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.28, 8, 8]} />
            <meshStandardMaterial color="#D7CCC8" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

