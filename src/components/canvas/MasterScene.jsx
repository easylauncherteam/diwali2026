import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

import StoryAtmosphere from './story/StoryAtmosphere'
import Scene1DasharathVanvas from './story/Scene1DasharathVanvas'
import Scene2BharatMilap from './story/Scene2BharatMilap'
import Scene3SitaHaran from './story/Scene3SitaHaran'
import Scene4HanumanMilap from './story/Scene4HanumanMilap'
import Scene5RavanaDahan from './story/Scene5RavanaDahan'
import Scene6AyodhyaAagman from './story/Scene6AyodhyaAagman'
import ExtremePattakasArena from './patakas/ExtremePattakasArena'
import SingleAnaarArena from './patakas/SingleAnaarArena'
import AyodhyaCity from './AyodhyaCity'
import SaryuRiver from './SaryuRiver'
import ShriRamSena from './ShriRamSena'
import FireworksSystem from './FireworksSystem'
import SmokeAndAtmosphere from './SmokeAndAtmosphere'
import StoryCameraController from './story/StoryCameraController'

export default function MasterScene({
  mode = 'STORY', // 'STORY' | 'PATAKAS' | 'AYODHYA'
  storySceneIndex = 0,
  isFreeOrbit = false,
  slowMo = false,
  autoCelebration = false,
  triggerGrandBarrage = false,
  onBarrageDone,
  interactiveRocket = null,
  useDashrathFarewell = false,
  onCanvasClick
}) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 6, 22], fov: 48, near: 0.5, far: 350 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        onPointerDown={(e) => {
          if (onCanvasClick) onCanvasClick(e)
        }}
      >
        <Suspense fallback={null}>
          {/* CAMERA DIRECTOR */}
          <StoryCameraController
            currentSceneIndex={storySceneIndex}
            mode={mode}
            isFreeOrbit={isFreeOrbit}
          />

          {/* ======================================================== */}
          {/* SCENE RENDERING BASED ON MODE */}
          {/* ======================================================== */}

          {mode === 'STORY' && (
            <group>
              <StoryAtmosphere
                sceneIndex={storySceneIndex}
                onBarrageDone={onBarrageDone}
              />
              {storySceneIndex === 0 && <Scene1DasharathVanvas useDashrathFarewell={useDashrathFarewell} />}
              {storySceneIndex === 1 && <Scene2BharatMilap />}
              {storySceneIndex === 2 && <Scene3SitaHaran />}
              {storySceneIndex === 3 && <Scene4HanumanMilap />}
              {storySceneIndex === 4 && <Scene5RavanaDahan />}
              {storySceneIndex === 5 && (
                <Scene6AyodhyaAagman
                  triggerBarrage={true}
                  onBarrageDone={onBarrageDone}
                />
              )}
            </group>
          )}

          {mode === 'PATAKAS' && (
            <ExtremePattakasArena
              slowMo={slowMo}
              autoCelebration={autoCelebration}
              onDiyaClick={() => {
                if (onCanvasClick) onCanvasClick()
              }}
            />
          )}

          {mode === 'ANAAR_PAGE' && (
            <SingleAnaarArena
              autoBurn={false}
              onDiyaClick={() => {
                if (onCanvasClick) onCanvasClick()
              }}
            />
          )}

          {mode === 'AYODHYA' && (
            <group>
              <color attach="background" args={['#030714']} />
              <fog attach="fog" args={['#050C22', 25, 160]} />
              <ambientLight color="#0B1A3D" intensity={0.8} />
              <hemisphereLight skyColor="#FFA000" groundColor="#0B1536" intensity={0.9} />
              <directionalLight
                position={[15, 35, 20]}
                color="#FFE082"
                intensity={1.2}
                castShadow
              />
              <AyodhyaCity />
              <SaryuRiver />
              <ShriRamSena />
              <SmokeAndAtmosphere />
              <FireworksSystem
                triggerGrandBarrage={triggerGrandBarrage}
                onBarrageDone={onBarrageDone}
                interactiveRocket={interactiveRocket}
              />
            </group>
          )}

          {/* ======================================================== */}
          {/* CINEMATIC POST-PROCESSING */}
          {/* ======================================================== */}
          <EffectComposer multisampling={4}>
            <Bloom
              luminanceThreshold={0.52}
              luminanceSmoothing={0.85}
              intensity={1.35}
              mipmapBlur
            />
            <Vignette
              eskil={false}
              offset={0.16}
              darkness={0.72}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}

