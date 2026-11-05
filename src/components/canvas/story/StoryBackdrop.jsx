import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * StoryBackdrop
 * Renders high-resolution cinematic artwork as an atmospheric 3D backdrop
 * positioned behind the scene's procedural 3D elements.
 */
export default function StoryBackdrop({
  src,
  position = [0, 8, -18],
  size = [48, 27],
  opacity = 0.92
}) {
  const texture = useMemo(() => {
    if (!src) return null
    const loader = new THREE.TextureLoader()
    const tex = loader.load(src)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [src])

  if (!texture) return null

  return (
    <group position={position}>
      {/* Vignette Shadow Frame behind image */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[size[0] * 1.03, size[1] * 1.03]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>

      {/* Main Cinematic Backdrop Surface */}
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
