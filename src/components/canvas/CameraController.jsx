import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export const CAMERA_VIEWS = {
  HERO: {
    name: 'भव्य अयोध्या (Grand Hero)',
    position: [0, 8, 38],
    target: [0, 6, -5]
  },
  RAM_DARSHAN: {
    name: 'प्रभु श्री राम दर्शन (Darshan)',
    position: [0, 4.8, 11],
    target: [0, 4.5, 0]
  },
  RAM_MANDIR: {
    name: 'श्री राम मंदिर (Mandir Shikhara)',
    position: [0, 16, 8],
    target: [0, 18, -26]
  },
  SARYU_AARTI: {
    name: 'सरयू तट दीपोत्सव (Ghats & River)',
    position: [0, 0.5, 26],
    target: [0, 2.5, 0]
  }
}

export default function CameraController({ currentView = 'HERO', isFreeOrbit = false }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  // Desired camera target and position vectors
  const targetPos = useRef(new THREE.Vector3(...CAMERA_VIEWS.HERO.position))
  const targetLook = useRef(new THREE.Vector3(...CAMERA_VIEWS.HERO.target))

  // Mouse Parallax coordinates (-1 to 1)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // When active view changes, update target coordinates
  useEffect(() => {
    const viewConfig = CAMERA_VIEWS[currentView] || CAMERA_VIEWS.HERO
    targetPos.current.set(...viewConfig.position)
    targetLook.current.set(...viewConfig.target)
  }, [currentView])

  useFrame((_, delta) => {
    if (isFreeOrbit) return

    // Apply subtle smooth mouse parallax
    const parallaxFactorX = 2.5
    const parallaxFactorY = 1.2

    const desiredX = targetPos.current.x + mouse.current.x * parallaxFactorX
    const desiredY = targetPos.current.y + mouse.current.y * parallaxFactorY
    const desiredZ = targetPos.current.z

    // Smooth lerp camera position
    camera.position.x += (desiredX - camera.position.x) * delta * 2.2
    camera.position.y += (desiredY - camera.position.y) * delta * 2.2
    camera.position.z += (desiredZ - camera.position.z) * delta * 2.2

    // Smooth lerp camera lookAt
    if (controlsRef.current) {
      controlsRef.current.target.x += (targetLook.current.x - controlsRef.current.target.x) * delta * 2.2
      controlsRef.current.target.y += (targetLook.current.y - controlsRef.current.target.y) * delta * 2.2
      controlsRef.current.target.z += (targetLook.current.z - controlsRef.current.target.z) * delta * 2.2
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
      maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
      minDistance={6}
      maxDistance={70}
    />
  )
}
