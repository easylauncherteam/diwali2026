import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Divine Halo (Prabhamandal)
export function DivineHalo({ color = '#FFD700', radius = 1.3, position = [0, 0, 0] }) {
  const haloRef = useRef()
  useFrame((_, delta) => {
    if (haloRef.current) haloRef.current.rotation.z += delta * 0.4
  })
  return (
    <group position={position}>
      <mesh ref={haloRef}>
        <ringGeometry args={[radius * 0.7, radius, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh>
        <circleGeometry args={[radius * 0.75, 24]} />
        <meshBasicMaterial color="#FFFDE7" side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>
      <pointLight color={color} intensity={2.2} distance={6} />
    </group>
  )
}

// Lord Shri Ram
export function LordRamFigure({ position = [0, 0, 0], scale = 1, pose = 'SERENE' }) {
  const groupRef = useRef()
  const bowRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      groupRef.current.position.y = position[1] + Math.sin(t * 1.6) * 0.03
      if (pose === 'ARCHER' && bowRef.current) {
        bowRef.current.rotation.z = -0.3 + Math.sin(t * 2) * 0.04
      }
    }
  })

  const isExile = pose === 'EXILE' || pose === 'FOREST'
  const isArcher = pose === 'ARCHER'

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Divine Halo */}
      <DivineHalo color="#FFD700" radius={1.4} position={[0, 4.3, -0.3]} />

      {/* Mukut (Crown) */}
      <group position={[0, 4.8, 0]}>
        <mesh>
          <coneGeometry args={[0.5, 1.05, 12]} />
          <meshStandardMaterial
            color={isExile ? '#C68B16' : '#FFD700'}
            metalness={0.9}
            roughness={0.2}
            emissive="#FFA000"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, 0.4, 0.4]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#E91E63" />
        </mesh>
      </group>

      {/* Head - Neelamegha Shyam divine complexion */}
      <mesh position={[0, 4.0, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} scale={[0.9, 1.1, 0.9]} />
        <meshStandardMaterial color="#81D4FA" roughness={0.45} />
      </mesh>
      {/* Tilak */}
      <mesh position={[0, 4.15, 0.38]} scale={[0.07, 0.2, 0.04]}>
        <boxGeometry />
        <meshBasicMaterial color="#FFD54F" />
      </mesh>
      <mesh position={[0, 4.1, 0.39]} scale={[0.03, 0.14, 0.04]}>
        <boxGeometry />
        <meshBasicMaterial color="#D32F2F" />
      </mesh>

      {/* Upper Torso & Pitambar */}
      <mesh position={[0, 2.9, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 1.4, 12]} />
        <meshStandardMaterial
          color={isExile ? '#FF8F00' : '#FFB300'}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Golden Armor / Kavach (if royal/archer) */}
      {!isExile && (
        <mesh position={[0, 3.0, 0.1]}>
          <cylinderGeometry args={[0.52, 0.42, 0.9, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
        </mesh>
      )}

      {/* Saffron Scarf / Angavastra */}
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.62, 0.1, 8, 16]} />
        <meshStandardMaterial color="#E65100" roughness={0.5} />
      </mesh>

      {/* Lower Dhoti */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.42, 0.65, 1.7, 12]} />
        <meshStandardMaterial
          color={isExile ? '#E65100' : '#FFA000'}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Arms & Bow Kodanda */}
      {isArcher ? (
        <group ref={bowRef} position={[0.5, 3.0, 0.4]}>
          {/* Drawn Bow */}
          <mesh rotation={[0, 0, 0.8]}>
            <torusGeometry args={[1.5, 0.06, 8, 24, Math.PI * 0.7]} />
            <meshStandardMaterial color="#DDA15E" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Brahmastra Arrow with glowing tip */}
          <mesh position={[-0.4, 0.1, 0.1]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
            <meshStandardMaterial color="#FFD700" emissive="#FF6D00" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.4, 0.6, 0.1]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color="#FFF9C4" />
          </mesh>
          <pointLight color="#FFD700" intensity={4} distance={6} />
        </group>
      ) : (
        <group position={[-0.55, 3.0, 0]}>
          {/* Slung Bow over shoulder */}
          <mesh rotation={[0.2, 0, -0.4]}>
            <torusGeometry args={[1.3, 0.05, 8, 20, Math.PI * 0.65]} />
            <meshStandardMaterial color="#C68B16" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Blessing / Pranam Arms */}
      {pose === 'BLESSING' && (
        <group position={[0.4, 3.0, 0.3]} rotation={[-0.6, 0, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#81D4FA" />
          </mesh>
          {/* Abhaya Mudra Hand */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.16, 0.22, 0.06]} />
            <meshStandardMaterial color="#81D4FA" />
          </mesh>
        </group>
      )}

      {/* Lotus Pedestal */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.25, 16]} />
        <meshStandardMaterial color="#E91E63" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  )
}

// Mata Sita Figure
export function MataSitaFigure({ position = [0, 0, 0], scale = 0.95, pose = 'SERENE' }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.position.y = position[1] + Math.sin(t * 1.5 + 0.5) * 0.025
    }
  })

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      {/* Golden Aura */}
      <DivineHalo color="#FF80AB" radius={1.2} position={[0, 4.0, -0.25]} />

      {/* Crown / Maang Tikka */}
      <group position={[0, 4.5, 0]}>
        <mesh>
          <coneGeometry args={[0.38, 0.75, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0.3]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#E91E63" />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.38, 16, 16]} scale={[0.9, 1.1, 0.9]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>
      {/* Bindi & Tilak */}
      <mesh position={[0, 3.92, 0.34]} scale={[0.05, 0.05, 0.03]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#C2185B" />
      </mesh>

      {/* Royal / Forest Silk Saree (Upper) */}
      <mesh position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.42, 0.36, 1.3, 12]} />
        <meshStandardMaterial color="#C2185B" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Golden Zari Pallu */}
      <mesh position={[0.1, 2.8, 0.1]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.5, 0.09, 8, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Lower Saree Flared Skirt */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.36, 0.65, 1.6, 12]} />
        <meshStandardMaterial color="#AD1457" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Lotus Pedestal */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.8, 0.95, 0.2, 16]} />
        <meshStandardMaterial color="#F48FB1" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  )
}

// Lakshman Figure
export function LakshmanFigure({ position = [0, 0, 0], scale = 0.97 }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.position.y = position[1] + Math.sin(t * 1.6 + 1.0) * 0.025
    }
  })

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      <DivineHalo color="#FFE082" radius={1.25} position={[0, 4.2, -0.25]} />

      {/* Crown */}
      <mesh position={[0, 4.75, 0]}>
        <coneGeometry args={[0.45, 0.95, 12]} />
        <meshStandardMaterial color="#FFB300" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.95, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} scale={[0.9, 1.1, 0.9]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>

      {/* Torso & Saffron Angavastra */}
      <mesh position={[0, 2.85, 0]}>
        <cylinderGeometry args={[0.48, 0.38, 1.4, 12]} />
        <meshStandardMaterial color="#FF8F00" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Lower Dhoti */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.4, 0.62, 1.65, 12]} />
        <meshStandardMaterial color="#E65100" metalness={0.1} roughness={0.7} />
      </mesh>

      {/* Bow & Quiver */}
      <mesh position={[0.5, 2.9, 0]} rotation={[0.2, 0, 0.35]}>
        <torusGeometry args={[1.2, 0.05, 8, 20, Math.PI * 0.65]} />
        <meshStandardMaterial color="#8D6E63" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

// King Dasharath Figure (Grieving father)
export function KingDasharathFigure({ position = [0, 0, 0], scale = 1.0 }) {
  const armRef = useRef()
  useFrame((state) => {
    if (armRef.current) {
      const t = state.clock.getElapsedTime()
      armRef.current.rotation.x = -0.5 + Math.sin(t * 1.8) * 0.06
    }
  })

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Imperial Crown */}
      <mesh position={[0, 4.9, 0]}>
        <cylinderGeometry args={[0.5, 0.65, 1.0, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FF8F00" emissiveIntensity={0.2} />
      </mesh>
      {/* Crown Crest */}
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Head with Silver Royal Beard */}
      <mesh position={[0, 4.0, 0]}>
        <sphereGeometry args={[0.44, 16, 16]} scale={[0.92, 1.08, 0.92]} />
        <meshStandardMaterial color="#FFCCBC" roughness={0.6} />
      </mesh>
      {/* White/Silver Beard */}
      <mesh position={[0, 3.65, 0.28]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.28, 0.7, 10]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.7} />
      </mesh>

      {/* Royal Robes (Upper) */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.58, 0.48, 1.5, 12]} />
        <meshStandardMaterial color="#880E4F" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Golden Royal Collar & Jewel */}
      <mesh position={[0, 3.25, 0]}>
        <torusGeometry args={[0.55, 0.12, 8, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Outstretched Grieving Arms */}
      <group ref={armRef} position={[0, 3.1, 0.3]}>
        {/* Left Arm */}
        <mesh position={[-0.45, 0, 0.4]} rotation={[-0.7, -0.3, -0.2]}>
          <cylinderGeometry args={[0.1, 0.12, 0.9, 8]} />
          <meshStandardMaterial color="#FFCCBC" />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.45, 0, 0.4]} rotation={[-0.7, 0.3, 0.2]}>
          <cylinderGeometry args={[0.1, 0.12, 0.9, 8]} />
          <meshStandardMaterial color="#FFCCBC" />
        </mesh>
      </group>

      {/* Lower Robe */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.48, 0.75, 1.7, 12]} />
        <meshStandardMaterial color="#4A148C" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  )
}

// Queen Kaushalya (Weeping mother)
export function QueenKaushalyaFigure({ position = [0, 0, 0], scale = 0.92 }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      // Weeping shoulder shake motion
      ref.current.position.y = position[1] + Math.sin(t * 3.5) * 0.02
    }
  })

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      {/* Crown */}
      <mesh position={[0, 4.4, 0]}>
        <coneGeometry args={[0.35, 0.7, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.6} />
      </mesh>
      {/* Grieving hands raised to face */}
      <mesh position={[0, 3.7, 0.38]}>
        <boxGeometry args={[0.35, 0.2, 0.1]} />
        <meshStandardMaterial color="#FFE0B2" />
      </mesh>
      {/* Saree */}
      <mesh position={[0, 2.65, 0]}>
        <cylinderGeometry args={[0.42, 0.36, 1.4, 12]} />
        <meshStandardMaterial color="#E91E63" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.36, 0.65, 1.6, 12]} />
        <meshStandardMaterial color="#AD1457" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  )
}

// Bharat Figure (Devoted brother with Padukas)
export function BharatFigure({ position = [0, 0, 0], scale = 0.96, holdsPadukas = true }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.02
    }
  })

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      <DivineHalo color="#FFD54F" radius={1.2} position={[0, 3.8, -0.2]} />

      {/* Head bowed in humility */}
      <group position={[0, 3.6, 0.1]} rotation={[0.2, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
        </mesh>
        {/* Tilak */}
        <mesh position={[0, 0.15, 0.36]} scale={[0.06, 0.18, 0.04]}>
          <boxGeometry />
          <meshBasicMaterial color="#FFD54F" />
        </mesh>
      </group>

      {/* Ascetic Saffron Robe in empathy with Ram */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.46, 0.38, 1.3, 12]} />
        <meshStandardMaterial color="#FF9800" metalness={0.1} roughness={0.7} />
      </mesh>

      {/* Kneeling / Deep Bow Posture */}
      <mesh position={[0, 1.1, 0.15]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 1.5, 12]} />
        <meshStandardMaterial color="#E65100" roughness={0.8} />
      </mesh>

      {/* Sacred Golden Charan Padukas on Cushion */}
      {holdsPadukas && (
        <group position={[0, 2.2, 0.65]}>
          {/* Velvet Cushion */}
          <mesh>
            <boxGeometry args={[0.8, 0.15, 0.55]} />
            <meshStandardMaterial color="#B71C1C" roughness={0.4} />
          </mesh>
          {/* Golden Padukas (Footwear of Lord Ram) */}
          <mesh position={[-0.18, 0.12, 0]}>
            <boxGeometry args={[0.16, 0.06, 0.38]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.18, 0.12, 0]}>
            <boxGeometry args={[0.16, 0.06, 0.38]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.3} />
          </mesh>
          {/* Paduka Toe Knobs */}
          <mesh position={[-0.18, 0.2, -0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
          <mesh position={[0.18, 0.2, -0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
          {/* Divine Sparkle Light over Padukas */}
          <pointLight color="#FFD700" intensity={3.5} distance={4} />
        </group>
      )}
    </group>
  )
}

// Golden Deer (Swarna Mriga / Maricha)
export function GoldenDeerFigure({ position = [0, 0, 0], scale = 0.85 }) {
  const deerRef = useRef()

  useFrame((state) => {
    if (deerRef.current) {
      const t = state.clock.getElapsedTime() * 3
      // Prancing motion
      deerRef.current.position.y = position[1] + Math.abs(Math.sin(t)) * 0.35
      deerRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group ref={deerRef} position={position} scale={[scale, scale, scale]}>
      {/* Body - Shimmering Gold */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.35, 0.3, 1.2, 12]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.95}
          roughness={0.15}
          emissive="#FFA000"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Neck & Head */}
      <group position={[0, 1.6, 0.5]} rotation={[0.4, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.22, 0.7, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0.45, 0.15]} rotation={[-0.4, 0, 0]}>
          <coneGeometry args={[0.18, 0.45, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.3} />
        </mesh>
        {/* Jeweled Antlers / Horns */}
        <mesh position={[-0.2, 0.7, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.03, 0.04, 0.6, 6]} />
          <meshStandardMaterial color="#00E5FF" metalness={0.9} roughness={0.1} emissive="#00B0FF" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.2, 0.7, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.03, 0.04, 0.6, 6]} />
          <meshStandardMaterial color="#00E5FF" metalness={0.9} roughness={0.1} emissive="#00B0FF" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Legs */}
      {[[-0.25, 0.5, 0.4], [0.25, 0.5, 0.4], [-0.25, 0.5, -0.4], [0.25, 0.5, -0.4]].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.06, 0.04, 1.1, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Golden Aura Light */}
      <pointLight color="#FFD700" intensity={4} distance={6} />
    </group>
  )
}

// 10-Headed Ravana Figure
export function TenHeadedRavanaFigure({ position = [0, 0, 0], scale = 1.3, isDefeated = false }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      if (!isDefeated) {
        ref.current.position.y = position[1] + Math.sin(t * 1.8) * 0.08
      } else {
        // Falling defeated tilt
        ref.current.rotation.z = Math.sin(t * 0.8) * 0.15 - 0.35
      }
    }
  })

  // 10 heads positions (5 left, center, 4 right)
  const headOffsets = [
    -1.8, -1.4, -1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4, 1.8
  ]

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      {/* Ten Heads Array */}
      <group position={[0, 5.0, 0]}>
        {headOffsets.map((xOff, idx) => (
          <group key={idx} position={[xOff * 0.7, Math.abs(xOff) * -0.15, 0]}>
            {/* Crown */}
            <mesh position={[0, 0.7, 0]}>
              <coneGeometry args={[0.22, 0.6, 8]} />
              <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.3} emissive="#B71C1C" emissiveIntensity={0.3} />
            </mesh>
            {/* Demon Head */}
            <mesh>
              <sphereGeometry args={[0.26, 12, 12]} />
              <meshStandardMaterial color="#424242" roughness={0.6} />
            </mesh>
            {/* Glowing Red Demon Eyes */}
            <mesh position={[-0.08, 0.04, 0.24]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshBasicMaterial color="#FF1744" />
            </mesh>
            <mesh position={[0.08, 0.04, 0.24]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshBasicMaterial color="#FF1744" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Massive Demon Torso */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[1.2, 0.9, 2.0, 12]} />
        <meshStandardMaterial color="#212121" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Golden Demon Breastplate & Ornaments */}
      <mesh position={[0, 3.4, 0.2]}>
        <boxGeometry args={[1.6, 1.4, 0.4]} />
        <meshStandardMaterial color="#C62828" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Multiple Arms holding weapons */}
      {[-1.3, -1.0, 1.0, 1.3].map((x, idx) => (
        <group key={idx} position={[x, 3.2, 0]}>
          <mesh rotation={[0, 0, x > 0 ? -0.5 : 0.5]}>
            <cylinderGeometry args={[0.15, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#424242" />
          </mesh>
          {/* Sword / Mace */}
          <mesh position={[x > 0 ? 0.6 : -0.6, 0.8, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 1.8, 6]} />
            <meshStandardMaterial color="#B0BEC5" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Lower Body */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.9, 1.2, 1.8, 12]} />
        <meshStandardMaterial color="#3E2723" roughness={0.7} />
      </mesh>

      {/* Dark/Fiery Aura Light */}
      <pointLight color="#FF1744" intensity={5} distance={10} />
    </group>
  )
}

// Pushpak Viman (Celestial aerial chariot)
export function PushpakVimanFigure({ position = [0, 8, 0], scale = 1.0 }) {
  const vimanRef = useRef()

  useFrame((state) => {
    if (vimanRef.current) {
      const t = state.clock.getElapsedTime()
      vimanRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.3
      vimanRef.current.position.x = position[0] + Math.cos(t * 0.9) * 0.6
      vimanRef.current.rotation.z = Math.sin(t * 1.5) * 0.05
    }
  })

  return (
    <group ref={vimanRef} position={position} scale={[scale, scale, scale]}>
      {/* Main Golden Swan/Peacock Chariot Hull */}
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 0.8, 1.2, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.3} />
      </mesh>

      {/* Celestial Golden Canopy (Mandapa) */}
      <group position={[0, 1.6, 0]}>
        {/* 4 Golden Pillars */}
        {[[-0.9, 0, -0.9], [0.9, 0, -0.9], [-0.9, 0, 0.9], [0.9, 0, 0.9]].map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <cylinderGeometry args={[0.08, 0.08, 1.8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
        ))}
        {/* Ornate Domed Roof */}
        <mesh position={[0, 1.1, 0]}>
          <coneGeometry args={[1.6, 1.2, 12]} />
          <meshStandardMaterial color="#FF6D00" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Saffron Flag atop Pushpak Viman */}
        <mesh position={[0, 2.0, 0]}>
          <coneGeometry args={[0.2, 0.6, 4]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FF3D00" />
        </mesh>
      </group>

      {/* Celestial Glowing Wings */}
      <mesh position={[-1.8, 0.4, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.8, 0.12, 1.2]} />
        <meshStandardMaterial color="#FFE082" metalness={0.8} roughness={0.2} emissive="#FFB300" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[1.8, 0.4, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[1.8, 0.12, 1.2]} />
        <meshStandardMaterial color="#FFE082" metalness={0.8} roughness={0.2} emissive="#FFB300" emissiveIntensity={0.4} />
      </mesh>

      {/* Radiant Celestial Light */}
      <pointLight color="#FFE082" intensity={6} distance={15} />
    </group>
  )
}

// Jatayu (Celestial Eagle Hero)
export function JatayuFigure({ position = [0, 8, 0], scale = 1.0 }) {
  const ref = useRef()
  const leftWingRef = useRef()
  const rightWingRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 4
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.4
      ref.current.rotation.x = Math.sin(t * 0.5) * 0.1
    }
    if (leftWingRef.current) leftWingRef.current.rotation.z = Math.sin(t) * 0.45
    if (rightWingRef.current) rightWingRef.current.rotation.z = -Math.sin(t) * 0.45
  })

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      {/* Eagle Body */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.4, 1.8, 10]} rotation={[Math.PI / 3, 0, 0]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.6} />
      </mesh>
      {/* Eagle Head & Curved Golden Beak */}
      <mesh position={[0, 0.6, 1.1]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#A1887F" />
      </mesh>
      <mesh position={[0, 0.55, 1.45]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.15, 0.45, 6]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} />
      </mesh>
      {/* Piercing Eyes */}
      <mesh position={[-0.18, 0.7, 1.25]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#FFEB3B" />
      </mesh>
      <mesh position={[0.18, 0.7, 1.25]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#FFEB3B" />
      </mesh>

      {/* Flapping Wings */}
      <group ref={leftWingRef} position={[-0.6, 0.2, 0]}>
        <mesh position={[-1.4, 0, 0]}>
          <boxGeometry args={[2.8, 0.12, 1.4]} />
          <meshStandardMaterial color="#6D4C41" roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightWingRef} position={[0.6, 0.2, 0]}>
        <mesh position={[1.4, 0, 0]}>
          <boxGeometry args={[2.8, 0.12, 1.4]} />
          <meshStandardMaterial color="#6D4C41" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// Pawanputra Hanuman Ji Figure
export function HanumanJiFigure({ position = [0, 0, 0], scale = 1.0, pose = 'DEVOTION' }) {
  const ref = useRef()
  const tailRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.6) * 0.03
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 2) * 0.15
    }
  })

  return (
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      {/* Divine Radiant Golden Halo */}
      <DivineHalo color="#FF9800" radius={1.4} position={[0, 3.8, -0.3]} />

      {/* Golden Mukut (Crown) */}
      <mesh position={[0, 4.4, 0]}>
        <coneGeometry args={[0.48, 1.0, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FF9800" emissiveIntensity={0.3} />
      </mesh>

      {/* Head - Radiant Saffron Complexion & Devotional Eyes */}
      <mesh position={[0, 3.65, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} scale={[0.95, 1.05, 0.95]} />
        <meshStandardMaterial color="#FF8A65" roughness={0.5} />
      </mesh>
      {/* Tilak */}
      <mesh position={[0, 3.82, 0.38]} scale={[0.07, 0.2, 0.04]}>
        <boxGeometry />
        <meshBasicMaterial color="#FFD54F" />
      </mesh>
      <mesh position={[0, 3.78, 0.39]} scale={[0.03, 0.14, 0.04]}>
        <boxGeometry />
        <meshBasicMaterial color="#D32F2F" />
      </mesh>

      {/* Muscular Torso & Sacred Thread (Janeu) */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 1.4, 12]} />
        <meshStandardMaterial color="#FF7043" roughness={0.5} />
      </mesh>
      {/* Golden Garland & Ornaments */}
      <mesh position={[0, 2.7, 0.1]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.55, 0.08, 8, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} />
      </mesh>

      {/* Saffron Dhoti */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.45, 0.65, 1.5, 12]} />
        <meshStandardMaterial color="#E65100" roughness={0.7} />
      </mesh>

      {/* Folded Hands in Devotion (Pranam) */}
      <group position={[0, 2.7, 0.5]} rotation={[-0.4, 0, 0]}>
        <mesh position={[-0.08, 0, 0]}>
          <boxGeometry args={[0.12, 0.26, 0.08]} />
          <meshStandardMaterial color="#FF8A65" />
        </mesh>
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.12, 0.26, 0.08]} />
          <meshStandardMaterial color="#FF8A65" />
        </mesh>
      </group>

      {/* Golden Gada (Mace) resting by side */}
      <group position={[-0.7, 1.4, 0.3]} rotation={[0.2, 0, -0.3]}>
        {/* Shaft */}
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Mace Head */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.3, 12, 12]} scale={[1, 1.3, 1]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Swaying Tail (Langur) */}
      <group ref={tailRef} position={[0, 1.4, -0.4]}>
        <mesh rotation={[-1.2, 0, 0]}>
          <torusGeometry args={[0.7, 0.08, 8, 16, Math.PI * 0.8]} />
          <meshStandardMaterial color="#FF7043" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

