import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

import AyodhyaCity from './AyodhyaCity'
import SaryuRiver from './SaryuRiver'
import ShriRamSena from './ShriRamSena'
import FireworksSystem from './FireworksSystem'
import SmokeAndAtmosphere from './SmokeAndAtmosphere'
import CameraController from './CameraController'

export default function Scene({
  cameraView = 'HERO',
  isFreeOrbit = false,
  triggerGrandBarrage = false,
  onBarrageDone,
  onSceneClick,
  externalRocket = null
}) {
  const [interactiveRocket, setInteractiveRocket] = useState(null)

  // Use external rocket if triggered from UI button
  const activeRocket = externalRocket || interactiveRocket

  // Handle click on the canvas background to trigger firework burst at click position
  const handlePointerDown = (e) => {
    // Only launch if clicking on sky / empty space
    if (e.point) {
      setInteractiveRocket({
        x: e.point.x,
        targetY: Math.max(22, e.point.y + 12),
        timestamp: Date.now()
      })
    } else {
      // Screen space fallback
      const normX = (e.clientX / window.innerWidth - 0.5) * 45
      setInteractiveRocket({
        x: normX,
        targetY: 28 + Math.random() * 12,
        timestamp: Date.now()
      })
    }
    if (onSceneClick) onSceneClick()
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]} // Crisp rendering on high-DPI displays
        camera={{ position: [0, 8, 38], fov: 48, near: 0.5, far: 350 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Deep Midnight Navy Celestial Sky & Volumetric Fog */}
        <color attach="background" args={['#030714']} />
        <fog attach="fog" args={['#050C22', 25, 160]} />

        {/* ======================================================== */}
        {/* CINEMATIC LIGHTING SETUP */}
        {/* ======================================================== */}
        {/* Ambient celestial blue glow */}
        <ambientLight color="#0B1A3D" intensity={0.8} />

        {/* Sacred Golden Aarti Hemisphere Glow */}
        <hemisphereLight
          skyColor="#FFA000"
          groundColor="#0B1536"
          intensity={0.9}
        />

        {/* Main Golden Sun/Mandir Directional Light */}
        <directionalLight
          position={[15, 35, 20]}
          color="#FFE082"
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />

        {/* 3D Scene Elements */}
        <Suspense fallback={null}>
          <AyodhyaCity />
          <SaryuRiver />
          <ShriRamSena />
          <SmokeAndAtmosphere />
          <FireworksSystem
            triggerGrandBarrage={triggerGrandBarrage}
            onBarrageDone={onBarrageDone}
            interactiveRocket={activeRocket}
          />
          <CameraController
            currentView={cameraView}
            isFreeOrbit={isFreeOrbit}
          />

          {/* Post-Processing: Cinematic Bloom, Golden Shimmer & Vignette */}
          <EffectComposer multisampling={4}>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.85}
              intensity={1.4}
              mipmapBlur
            />
            <Vignette
              eskil={false}
              offset={0.15}
              darkness={0.75}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
