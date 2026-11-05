import React, { useState } from 'react'
import Scene from './components/canvas/Scene'
import OverlayUI from './components/ui/OverlayUI'
import GreetingCardModal from './components/ui/GreetingCardModal'
import { soundEngine } from './audio/soundEngine'

export default function App() {
  const [cameraView, setCameraView] = useState('HERO')
  const [isFreeOrbit, setIsFreeOrbit] = useState(false)
  const [triggerGrandBarrage, setTriggerGrandBarrage] = useState(false)
  const [isBarrageActive, setIsBarrageActive] = useState(false)
  const [interactiveRocket, setInteractiveRocket] = useState(null)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)

  // Trigger Grand Diwali Celebration
  const handleCelebrateDiwali = () => {
    setIsBarrageActive(true)
    setTriggerGrandBarrage(true)
  }

  const handleBarrageDone = () => {
    setTriggerGrandBarrage(false)
    setIsBarrageActive(false)
  }

  // Trigger Individual Rocket
  const handleLaunchRocket = (x) => {
    soundEngine.init()
    setInteractiveRocket({
      x: x || 0,
      targetY: 28 + Math.random() * 14,
      timestamp: Date.now()
    })
  }

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Immersive Ayodhya Canvas */}
      <Scene
        cameraView={cameraView}
        isFreeOrbit={isFreeOrbit}
        triggerGrandBarrage={triggerGrandBarrage}
        onBarrageDone={handleBarrageDone}
        onSceneClick={() => soundEngine.init()}
        externalRocket={interactiveRocket}
      />

      {/* Cinematic UI Overlay */}
      <OverlayUI
        cameraView={cameraView}
        setCameraView={setCameraView}
        isFreeOrbit={isFreeOrbit}
        setIsFreeOrbit={setIsFreeOrbit}
        onCelebrateDiwali={handleCelebrateDiwali}
        onLaunchRocket={handleLaunchRocket}
        onOpenCardModal={() => setIsCardModalOpen(true)}
        isBarrageActive={isBarrageActive}
      />

      {/* Personalized Greeting Card Modal */}
      <GreetingCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </main>
  )
}
