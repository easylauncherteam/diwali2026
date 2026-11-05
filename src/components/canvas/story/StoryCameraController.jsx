import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { RAMAYANA_SCENES } from '../../../data/ramayanaStoryData'

export default function StoryCameraController({
  currentSceneIndex = 0,
  mode = 'STORY', // 'STORY' | 'PATAKAS' | 'AYODHYA'
  isFreeOrbit = false,
  customCameraPreset = null
}) {
  const { camera } = useThree()
  const controlsRef = useRef()

  const targetPos = useRef(new THREE.Vector3(0, 6, 22))
  const targetLook = useRef(new THREE.Vector3(0, 4, 0))
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (mode === 'PATAKAS') {
      targetPos.current.set(0, 3.6, 13)
      targetLook.current.set(0, 1.0, 0)
    } else if (mode === 'ANAAR_PAGE') {
      targetPos.current.set(0, 3.2, 9.8)
      targetLook.current.set(0, 1.4, 0)
    } else if (mode === 'AYODHYA') {
      targetPos.current.set(0, 8, 38)
      targetLook.current.set(0, 6, -5)
    } else {
      // Ramayana Story Mode
      const scene = RAMAYANA_SCENES[currentSceneIndex] || RAMAYANA_SCENES[0]
      if (scene) {
        targetPos.current.set(...scene.cameraPos)
        targetLook.current.set(...scene.cameraTarget)
      }
    }
  }, [currentSceneIndex, mode])

  useFrame((state, delta) => {
    if (isFreeOrbit) return

    const t = state.clock.getElapsedTime()

    // Smooth subtle cinematic breathing camera dolly
    const subtlePan = Math.sin(t * 0.4) * 0.6
    const mouseX = mouse.current.x * 1.8
    const mouseY = mouse.current.y * 1.0

    const desiredX = targetPos.current.x + mouseX + subtlePan
    const desiredY = targetPos.current.y + mouseY
    const desiredZ = targetPos.current.z

    // Lerp camera
    camera.position.x += (desiredX - camera.position.x) * delta * 2.4
    camera.position.y += (desiredY - camera.position.y) * delta * 2.4
    camera.position.z += (desiredZ - camera.position.z) * delta * 2.4

    if (controlsRef.current) {
      controlsRef.current.target.x += (targetLook.current.x - controlsRef.current.target.x) * delta * 2.4
      controlsRef.current.target.y += (targetLook.current.y - controlsRef.current.target.y) * delta * 2.4
      controlsRef.current.target.z += (targetLook.current.z - controlsRef.current.target.z) * delta * 2.4
      controlsRef.current.update()
    } else {
      camera.lookAt(targetLook.current)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={isFreeOrbit}
      enablePan={isFreeOrbit}
      enableZoom={true}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  )
}

