import React from 'react'
import StoryBackdrop from './StoryBackdrop'
import AyodhyaCity from '../AyodhyaCity'
import SaryuRiver from '../SaryuRiver'
import SmokeAndAtmosphere from '../SmokeAndAtmosphere'
import FireworksSystem from '../FireworksSystem'
import {
  LordRamFigure,
  MataSitaFigure,
  LakshmanFigure,
  HanumanJiFigure
} from '../characters/RamayanaCharacters'

export default function Scene6AyodhyaAagman({
  triggerBarrage = true,
  onBarrageDone
}) {
  return (
    <group>
      {/* Cinematic Golden Aarti Lights */}
      <ambientLight color="#0B1A3D" intensity={0.8} />
      <hemisphereLight skyColor="#FFA000" groundColor="#0B1536" intensity={0.9} />
      <directionalLight
        position={[15, 35, 20]}
        color="#FFE082"
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* 3D Cinematic Story Backdrop */}
      <StoryBackdrop
        src="/scenes/scene6_ayodhya_diwali.jpg"
        position={[0, 18, -36]}
        size={[85, 48]}
        opacity={0.85}
      />

      {/* 3D Ayodhya Mandir City & Saryu River */}
      <AyodhyaCity />
      <SaryuRiver />
      <SmokeAndAtmosphere />

      {/* Royal Coronation Balcony: Shri Ram, Sita, Lakshman & Hanuman */}
      <group position={[0, 4.2, 8]}>
        {/* Golden Royal Balcony Platform */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[14, 0.6, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Diyas lining the royal balcony */}
        {[-6, -4, -2, 0, 2, 4, 6].map((x, idx) => (
          <group key={idx} position={[x, 0.15, 2.7]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.1, 0.12, 12]} />
              <meshStandardMaterial color="#D7CCC8" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <coneGeometry args={[0.08, 0.22, 8]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
            <pointLight color="#FF9800" intensity={1.5} distance={3} />
          </group>
        ))}

        {/* Lord Shri Ram in royal pitambar */}
        <LordRamFigure position={[0, 0, 0]} scale={1.12} pose="ROYAL" />

        {/* Mata Sita beside Shri Ram */}
        <MataSitaFigure position={[1.8, 0, -0.2]} scale={1.05} />

        {/* Lakshman holding the royal parasol */}
        <LakshmanFigure position={[-1.8, 0, -0.2]} scale={1.05} />

        {/* Hanuman Ji in joyful celebration */}
        <HanumanJiFigure position={[3.6, 0, 0.4]} scale={1.02} pose="DEVOTION" />
      </group>

      {/* Continuous Grand Aerial Fireworks */}
      <FireworksSystem
        triggerGrandBarrage={triggerBarrage}
        onBarrageDone={onBarrageDone}
      />
    </group>
  )
}

