import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Custom Water Shader for Saryu River with realistic wave ripples and golden reflections
const RiverShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color('#030A1C') },
    uColorShallow: { value: new THREE.Color('#0A2342') },
    uColorReflection: { value: new THREE.Color('#FFB300') },
    uMoonReflection: { value: new THREE.Color('#E3F2FD') },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Gentle river ripples and flow towards +X
      float wave1 = sin(pos.x * 0.15 + uTime * 0.8) * cos(pos.z * 0.18 + uTime * 0.5) * 0.18;
      float wave2 = sin(pos.x * 0.4 - uTime * 1.2 + pos.z * 0.3) * 0.08;
      float wave3 = cos(pos.z * 0.8 + uTime * 0.6) * 0.04;
      pos.y += wave1 + wave2 + wave3;

      vPosition = pos;
      vNormal = normalize(normal + vec3(
        -cos(pos.x * 0.15 + uTime * 0.8) * 0.05,
        1.0,
        -sin(pos.z * 0.18 + uTime * 0.5) * 0.05
      ));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorDeep;
    uniform vec3 uColorShallow;
    uniform vec3 uColorReflection;
    uniform vec3 uMoonReflection;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

      // Golden shimmer ripples
      float shimmer = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.0, 0.8, -0.6)), 0.0), 16.0);
      float moonShimmer = pow(max(dot(reflect(-viewDir, vNormal), vec3(-0.3, 0.9, -0.3)), 0.0), 32.0);

      // Base water depth gradient
      vec3 waterColor = mix(uColorDeep, uColorShallow, sin(vPosition.x * 0.1 + uTime * 0.2) * 0.5 + 0.5);

      // Mix in golden palace/diya reflections
      vec3 finalColor = mix(waterColor, uColorReflection, shimmer * 0.85);
      finalColor += uMoonReflection * moonShimmer * 0.6;
      finalColor += uColorReflection * fresnel * 0.45;

      gl_FragColor = vec4(finalColor, 0.92);
    }
  `
}

export default function SaryuRiver() {
  const meshRef = useRef()
  const riverMatRef = useRef()

  // Floating Diyas along Saryu River (Deepdan)
  const floatingDiyas = useMemo(() => {
    const count = 180
    const items = []
    for (let i = 0; i < count; i++) {
      items.push({
        x: (Math.random() - 0.5) * 120,
        z: 8 + Math.random() * 35,
        speed: 0.15 + Math.random() * 0.25,
        bobSpeed: 1.5 + Math.random() * 2,
        bobAmp: 0.08 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
        scale: 0.25 + Math.random() * 0.35,
        flameFlickerSpeed: 4 + Math.random() * 6
      })
    }
    return items
  }, [])

  const diyasGroupRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    if (riverMatRef.current) {
      riverMatRef.current.uniforms.uTime.value = time
    }

    // Drift floating diyas gently along river
    if (diyasGroupRef.current) {
      diyasGroupRef.current.children.forEach((child, i) => {
        const data = floatingDiyas[i]
        if (!data) return
        child.position.x += data.speed * delta * 2.5
        // Wrap around seamlessly
        if (child.position.x > 60) child.position.x = -60
        child.position.y = -1.85 + Math.sin(time * data.bobSpeed + data.phase) * data.bobAmp
      })
    }
  })

  return (
    <group position={[0, -2, 0]}>
      {/* Sacred Saryu River Plane */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 25]}>
        <planeGeometry args={[140, 60, 96, 64]} />
        <shaderMaterial
          ref={riverMatRef}
          args={[RiverShaderMaterial]}
          transparent
          depthWrite={true}
        />
      </mesh>

      {/* Floating Deepdan Diyas on River Surface */}
      <group ref={diyasGroupRef}>
        {floatingDiyas.map((diya, i) => (
          <group key={i} position={[diya.x, -1.85, diya.z]} scale={[diya.scale, diya.scale, diya.scale]}>
            {/* Clay Diya Dish / Dona leaf */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.6, 0.2, 0.22, 12]} />
              <meshStandardMaterial color="#8D4925" roughness={0.7} metalness={0.2} />
            </mesh>
            {/* Oil surface */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.5, 0.4, 0.05, 12]} />
              <meshStandardMaterial color="#E65100" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Glowing Flame */}
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} scale={[0.8, 1.8, 0.8]} />
              <meshBasicMaterial color="#FFF59D" />
            </mesh>
            {/* Golden Flame Glow Halo */}
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial color="#FF9800" transparent opacity={0.35} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

