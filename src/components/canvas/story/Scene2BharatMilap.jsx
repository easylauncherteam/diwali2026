import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import StoryBackdrop from './StoryBackdrop'
import {
  LordRamFigure,
  LakshmanFigure,
  MataSitaFigure,
  BharatFigure
} from '../characters/RamayanaCharacters'

export default function Scene2BharatMilap() {
  const riverRef = useRef()
  const sunbeamRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (riverRef.current) {
      riverRef.current.position.x = -12 + Math.sin(t * 0.4) * 0.1
    }
    if (sunbeamRef.current) {
      sunbeamRef.current.intensity = 2.0 + Math.sin(t * 1.5) * 0.3
    }
  })

  // Forest foliage clusters
  const treePositions = useMemo(() => [
    [-10, 0, -6], [-7, 0, -10], [8, 0, -8], [11, 0, -4],
    [-13, 0, 4], [9, 0, 5], [-5, 0, -12], [4, 0, -11]
  ], [])

  return (
    <group>
      {/* Sunbeams & Nature Ambient */}
      <ambientLight color="#A5D6A7" intensity={0.8} />
      <directionalLight
        ref={sunbeamRef}
        position={[18, 25, 12]}
        color="#FFF9C4"
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight skyColor="#C8E6C9" groundColor="#2E7D32" intensity={0.7} />

      {/* 3D Cinematic Story Backdrop */}
      <StoryBackdrop
        src="/scenes/scene2_bharat_milap.jpg"
        position={[0, 9, -17]}
        size={[50, 28]}
        opacity={0.88}
      />

      {/* Forest Ground Terrain */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial color="#2E5A27" roughness={0.9} />
      </mesh>

      {/* Mandakini Sacred Forest River */}
      <mesh ref={riverRef} position={[-14, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 65]} />
        <meshStandardMaterial
          color="#00695C"
          roughness={0.15}
          metalness={0.65}
          emissive="#004D40"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Riverbank Stones & Rocks */}
      {[-8, -4, 0, 4, 8].map((z, idx) => (
        <mesh key={idx} position={[-9.5, 0.3, z]} rotation={[0.2, idx * 0.7, 0.1]}>
          <dodecahedronGeometry args={[0.7 + (idx % 3) * 0.25]} />
          <meshStandardMaterial color="#5D4037" roughness={0.85} />
        </mesh>
      ))}

      {/* Parna-Kuti (Ram's Leaf Hermitage Cottage) */}
      <group position={[0, 0, -8]}>
        {/* Thatched Mud Walls */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[7.5, 3.6, 5.5]} />
          <meshStandardMaterial color="#795548" roughness={0.9} />
        </mesh>
        {/* Leaf & Straw Thatched Sloping Roof */}
        <mesh position={[0, 4.3, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[5.4, 2.6, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.95} />
        </mesh>
        {/* Wooden Entrance Post */}
        <mesh position={[0, 1.3, 2.8]}>
          <boxGeometry args={[1.6, 2.4, 0.1]} />
          <meshBasicMaterial color="#1B0000" />
        </mesh>
      </group>

      {/* Lush Ancient Forest Trees (Banyan & Sal Trees) */}
      {treePositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Trunk */}
          <mesh position={[0, 3.0, 0]}>
            <cylinderGeometry args={[0.55, 0.85, 6.0, 8]} />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
          </mesh>
          {/* Foliage Canopies */}
          <mesh position={[0, 6.5, 0]}>
            <dodecahedronGeometry args={[2.8 + (idx % 2) * 0.7]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#2E7D32' : '#388E3C'} roughness={0.8} />
          </mesh>
          <mesh position={[0, 8.2, 0]}>
            <dodecahedronGeometry args={[2.0]} />
            <meshStandardMaterial color="#43A047" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Holy Asana (Wooden Seat) where Padukas are venerated */}
      <group position={[0, 0.2, 0.2]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.6, 0.4, 16]} />
          <meshStandardMaterial color="#5D4037" roughness={0.7} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 3D CHARACTERS */}
      {/* ======================================================== */}

      {/* Lord Ram in ascetic calm, blessing Bharat */}
      <LordRamFigure position={[0, 0.4, -0.6]} scale={1.05} pose="BLESSING" />

      {/* Bharat kneeling in deep devotion at Ram's feet, holding Charan Padukas */}
      <BharatFigure position={[0, 0, 1.8]} scale={1.0} holdsPadukas={true} />

      {/* Mata Sita standing gracefully outside the Kutiya */}
      <MataSitaFigure position={[2.4, 0, -2.0]} scale={0.95} />

      {/* Lakshman watching with brotherly emotion */}
      <LakshmanFigure position={[-2.4, 0, -1.8]} scale={0.98} />

      {/* Royal Ayodhya Chariots / Retinue in far background */}
      <group position={[12, 0, 2]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[3, 1.8, 2]} />
          <meshStandardMaterial color="#FFB300" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.7, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.12, 8, 16]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        <mesh position={[0, 0.7, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.12, 8, 16]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      </group>
    </group>
  )
}

