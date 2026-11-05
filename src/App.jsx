import React, { useState } from 'react'
import MasterScene from './components/canvas/MasterScene'
import CinematicSceneBackdrop from './components/ui/CinematicSceneBackdrop'
import CinematicSceneCarousel from './components/ui/CinematicSceneCarousel'
import TopDiyaAndPatakhe from './components/ui/TopDiyaAndPatakhe'
import SingleAnaarOverlay from './components/ui/SingleAnaarOverlay'
import ExtremePattakasToolbar from './components/ui/ExtremePattakasToolbar'
import GrandDiwaliCelebrationModal from './components/ui/GrandDiwaliCelebrationModal'
import CharacterGalleryModal from './components/ui/CharacterGalleryModal'
import GreetingCardModal from './components/ui/GreetingCardModal'
import { soundEngine } from './audio/soundEngine'
import { RAMAYANA_SCENES } from './data/ramayanaStoryData'

export default function App() {
  // Mode: 'STORY' (Ramayana 3D Movie) | 'PATAKAS' (Extreme 3D Crackers Arena) | 'AYODHYA' (Free Explorer)
  const [mode, setMode] = useState('STORY')
  const [storySceneIndex, setStorySceneIndex] = useState(0)
  const [isFreeOrbit, setIsFreeOrbit] = useState(false)

  // Patakas Arena States
  const [slowMo, setSlowMo] = useState(false)
  const [autoCelebration, setAutoCelebration] = useState(false)
  const [interactiveRocket, setInteractiveRocket] = useState(null)

  // Grand Diwali Celebration Modal
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false)
  const [triggerGrandBarrage, setTriggerGrandBarrage] = useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isCharModalOpen, setIsCharModalOpen] = useState(false)
  const [useDashrathFarewell, setUseDashrathFarewell] = useState(false)

  // Navigation handlers for 3D Ramayana Story Mode
  const handleNextScene = () => {
    soundEngine.init()
    if (storySceneIndex < RAMAYANA_SCENES.length - 1) {
      setStorySceneIndex((prev) => prev + 1)
    } else {
      // Reached finale (after Scene 6)
      handleOpenCelebrationFinale()
    }
  }

  const handlePrevScene = () => {
    soundEngine.init()
    if (storySceneIndex > 0) {
      setStorySceneIndex((prev) => prev - 1)
    }
  }

  const handleSelectScene = (idx) => {
    soundEngine.init()
    setStorySceneIndex(idx)
  }

  const handleOpenCelebrationFinale = () => {
    soundEngine.init()
    setTriggerGrandBarrage(true)
    setIsCelebrationModalOpen(true)
  }

  // Trigger individual rocket
  const handleLaunchRocket = (x) => {
    soundEngine.init()
    soundEngine.playRocketLaunch()
    setInteractiveRocket({
      x: x || 0,
      targetY: 28 + Math.random() * 12,
      timestamp: Date.now()
    })
  }

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Full-Screen Edge-to-Edge 16:9 Cinematic Scene Backdrop */}
      <CinematicSceneBackdrop
        currentSceneIndex={storySceneIndex}
        mode={mode}
        useDashrathFarewell={useDashrathFarewell}
      />

      {/* 3D Master Canvas (Story Scenes, Extreme Patakas Arena, or Ayodhya Explorer) */}
      <MasterScene
        mode={mode}
        storySceneIndex={storySceneIndex}
        isFreeOrbit={isFreeOrbit}
        slowMo={slowMo}
        autoCelebration={autoCelebration}
        triggerGrandBarrage={triggerGrandBarrage}
        onBarrageDone={() => setTriggerGrandBarrage(false)}
        interactiveRocket={interactiveRocket}
        onCanvasClick={() => {
          soundEngine.init()
        }}
      />

      {/* Upper Left 3D Diya & Upper Right Burn Anaar (Goes to Next Page) */}
      {mode === 'STORY' && (
        <TopDiyaAndPatakhe onGoToAnaarPage={() => setMode('ANAAR_PAGE')} />
      )}

      {/* 3D Interactive Scene Carousel (Front & Back Moveable CoverFlow) */}
      {mode === 'STORY' && (
        <CinematicSceneCarousel
          currentSceneIndex={storySceneIndex}
          onSelectScene={handleSelectScene}
          onNextScene={handleNextScene}
          onPrevScene={handlePrevScene}
          onSkipToFinale={handleOpenCelebrationFinale}
          useDashrathFarewell={useDashrathFarewell}
          setUseDashrathFarewell={setUseDashrathFarewell}
        />
      )}

      {/* NEXT PAGE: Dedicated Single Anaar Burning Arena & Experience */}
      {mode === 'ANAAR_PAGE' && (
        <SingleAnaarOverlay onBackToStory={() => setMode('STORY')} />
      )}

      {/* Return to Story Mode button when in Patakas Arena */}
      {mode === 'PATAKAS' && (
        <div style={{
          position: 'absolute',
          top: '1.0rem',
          left: '1.0rem',
          zIndex: 40
        }}>
          <button
            onClick={() => {
              soundEngine.init()
              setMode('STORY')
            }}
            style={{
              background: 'rgba(5, 10, 25, 0.82)',
              border: '1.5px solid rgba(255, 215, 0, 0.55)',
              color: '#FFD700',
              borderRadius: '24px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.7)'
            }}
          >
            <span>◀</span>
            <span>रामायण कथा (Return to Story)</span>
          </button>
        </div>
      )}

      {/* Patakas Arena Bottom Toolbar (when mode is PATAKAS) */}
      {mode === 'PATAKAS' && (
        <ExtremePattakasToolbar
          slowMo={slowMo}
          setSlowMo={setSlowMo}
          autoCelebration={autoCelebration}
          setAutoCelebration={setAutoCelebration}
          onTriggerAnaar={() => soundEngine.playAnaarSizzle(4.5)}
          onTriggerChakri={() => soundEngine.playChakriWhir(4.0)}
          onTriggerLadi={() => soundEngine.playLadiBurst(28, 65)}
          onTriggerRocket={() => handleLaunchRocket((Math.random() - 0.5) * 20)}
          onTriggerBomb={() => soundEngine.playBombBoom()}
          onLightAll={() => {
            soundEngine.playFuseSizzle(1.5)
            setTimeout(() => {
              soundEngine.playLadiBurst(24, 60)
              soundEngine.playAnaarSizzle(4.0)
              soundEngine.playChakriWhir(3.5)
            }, 800)
          }}
        />
      )}

      {/* Grand Diwali Celebration Modal (After Scene 6 or on demand) */}
      <GrandDiwaliCelebrationModal
        isOpen={isCelebrationModalOpen}
        onClose={() => setIsCelebrationModalOpen(false)}
        onExplorePatakas={() => {
          setMode('ANAAR_PAGE')
        }}
        onReplayStory={() => {
          setMode('STORY')
          setStorySceneIndex(0)
        }}
      />

      {/* Character Gallery Modal */}
      <CharacterGalleryModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
      />

      {/* Greeting Card Modal */}
      <GreetingCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </main>
  )
}
