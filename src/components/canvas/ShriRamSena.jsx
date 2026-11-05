import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Divine Halo (Prabhamandal / Aura) with rotating ray glow
function DivineHalo({ color = '#FFD700', radius = 1.2, position = [0, 0, 0] }) {
  const haloRef = useRef()

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.4
    }
  })

  return (
    <group position={position}>
      {/* Outer Glow Ring */}
      <mesh ref={haloRef}>
        <ringGeometry args={[radius * 0.7, radius, 32]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Radiant Sun Rays in Halo */}
      <mesh>
        <circleGeometry args={[radius * 0.75, 24]} />
        <meshBasicMaterial
          color="#FFF9C4"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
        />
      </mesh>
      {/* Core Halo Light */}
      <pointLight color={color} intensity={2.2} distance={6} />
    </group>
  )
}

// Lord Shri Ram 3D Majestic Figure
function LordRam({ position = [0, 0, 0] }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle divine breathing motion
      const t = state.clock.getElapsedTime()
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.04
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Divine Golden Halo (Surya Prabha) */}
      <DivineHalo color="#FFD700" radius={1.4} position={[0, 4.3, -0.3]} />

      {/* Royal Crown (Mukut) */}
      <group position={[0, 4.8, 0]}>
        <mesh>
          <coneGeometry args={[0.55, 1.1, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FFA000" emissiveIntensity={0.2} />
        </mesh>
        {/* Crown Jewel */}
        <mesh position={[0, 0.4, 0.45]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#E91E63" />
        </mesh>
      </group>

      {/* Head / Face */}
      <mesh position={[0, 4.0, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} scale={[0.9, 1.1, 0.9]} />
        {/* Divine Neelamegha Shyam complexion (soft sacred blue-cyan hue) */}
        <meshStandardMaterial color="#81D4FA" roughness={0.5} />
      </mesh>
      {/* Tilak (Urdhva Pundra Chandan & Kumkum) */}
      <mesh position={[0, 4.15, 0.38]} scale={[0.08, 0.22, 0.05]}>
        <boxGeometry />
        <meshBasicMaterial color="#FFD54F" />
      </mesh>
      <mesh position={[0, 4.1, 0.39]} scale={[0.04, 0.16, 0.05]}>
        <boxGeometry />
        <meshBasicMaterial color="#D32F2F" />
      </mesh>

      {/* Upper Torso & Pitambar (Golden Silk Shawl) */}
      <mesh position={[0, 2.9, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 1.6, 12]} />
        <meshStandardMaterial color="#FFF176" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Royal Angavastra (Draped over left shoulder) */}
      <mesh position={[-0.2, 2.9, 0.1]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.4, 1.7, 0.7]} />
        <meshStandardMaterial color="#FFA000" roughness={0.5} />
      </mesh>

      {/* Golden Royal Necklace & Kundal (Jewelry) */}
      <mesh position={[0, 3.4, 0.25]}>
        <torusGeometry args={[0.4, 0.08, 8, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Lower Garment (Dhoti in Royal Yellow / Pitambar) */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.48, 0.65, 1.8, 12]} />
        <meshStandardMaterial color="#FFB300" roughness={0.5} />
      </mesh>

      {/* Divine Kodanda Bow held in left hand */}
      <group position={[-0.8, 2.8, 0.2]} rotation={[0, 0.2, -0.15]}>
        {/* Bow Stave */}
        <mesh>
          <torusGeometry args={[1.5, 0.05, 8, 24, Math.PI * 0.8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bow String */}
        <mesh position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 2.6, 6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Quiver (Tarkash) of Divine Golden Arrows on Back */}
      <group position={[0.45, 3.1, -0.35]} rotation={[-0.2, 0, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.14, 1.4, 8]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.4} />
        </mesh>
        {/* Golden Arrow Feathers */}
        {[-0.05, 0.05].map((x, idx) => (
          <mesh key={idx} position={[x, 0.85, 0]}>
            <coneGeometry args={[0.07, 0.45, 6]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Right Arm in Abhaya Mudra / Blessing Pose */}
      <group position={[0.7, 3.1, 0.3]} rotation={[0.4, 0, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
          <meshStandardMaterial color="#81D4FA" roughness={0.5} />
        </mesh>
        {/* Palm */}
        <mesh position={[0, 0.45, 0.1]}>
          <boxGeometry args={[0.2, 0.25, 0.08]} />
          <meshStandardMaterial color="#81D4FA" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// Mata Sita 3D Figure
function MataSita({ position = [0, 0, 0] }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5 + 0.4) * 0.04
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Auspicious Golden Aura */}
      <DivineHalo color="#FF80AB" radius={1.2} position={[0, 3.9, -0.2]} />

      {/* Mukut / Tiara */}
      <mesh position={[0, 4.3, 0]}>
        <coneGeometry args={[0.45, 0.7, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.75, 0]}>
        <sphereGeometry args={[0.36, 16, 16]} scale={[0.9, 1.05, 0.9]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>
      {/* Bindi / Sindoor */}
      <mesh position={[0, 3.95, 0.33]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#C62828" />
      </mesh>

      {/* Royal Red & Gold Embroidered Saree */}
      <mesh position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.42, 0.38, 1.4, 12]} />
        <meshStandardMaterial color="#C2185B" roughness={0.4} />
      </mesh>
      {/* Zari Pallu draped elegantly */}
      <mesh position={[0.2, 2.6, 0.1]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 1.6, 0.6]} />
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Graceful Lower Saree Pleats */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.4, 0.62, 1.6, 12]} />
        <meshStandardMaterial color="#AD1457" roughness={0.5} />
      </mesh>

      {/* Folded Hands in Namaskar / Pranam */}
      <mesh position={[0, 2.8, 0.4]}>
        <boxGeometry args={[0.25, 0.3, 0.2]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>
    </group>
  )
}

// Lakshman Ji 3D Figure
function Lakshman({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Divine Aura */}
      <DivineHalo color="#FFCA28" radius={1.2} position={[0, 4.2, -0.2]} />

      {/* Crown */}
      <mesh position={[0, 4.6, 0]}>
        <coneGeometry args={[0.45, 0.85, 10]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.9, 0]}>
        <sphereGeometry args={[0.38, 14, 14]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.5} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.5, 0.42, 1.5, 10]} />
        <meshStandardMaterial color="#FF7043" roughness={0.4} />
      </mesh>
      {/* Lower Garment */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 1.7, 10]} />
        <meshStandardMaterial color="#E64A19" roughness={0.5} />
      </mesh>
      {/* Warrior Bow */}
      <group position={[0.7, 2.7, 0.2]} rotation={[0, -0.2, 0.2]}>
        <mesh>
          <torusGeometry args={[1.3, 0.04, 8, 20, Math.PI * 0.75]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// Hanuman Ji 3D Powerful Devotional Figure
function HanumanJi({ position = [0, 0, 0] }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef} position={position}>
      {/* Radiant Golden Saffron Aura */}
      <DivineHalo color="#FF6D00" radius={1.5} position={[0, 3.6, -0.2]} />

      {/* Golden Crown (Mukut) */}
      <mesh position={[0, 4.0, 0]}>
        <coneGeometry args={[0.5, 0.8, 10]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Head with Devotional Divine Glow */}
      <mesh position={[0, 3.4, 0]}>
        <sphereGeometry args={[0.45, 14, 14]} scale={[0.95, 1.0, 0.95]} />
        <meshStandardMaterial color="#FF9800" roughness={0.6} />
      </mesh>

      {/* Powerful Muscular Torso with Rudraksha Mala */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 1.7, 10]} />
        <meshStandardMaterial color="#FB8C00" roughness={0.5} />
      </mesh>
      {/* Rudraksha & Gold Malas */}
      <mesh position={[0, 2.5, 0.35]}>
        <torusGeometry args={[0.45, 0.08, 8, 16]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>

      {/* Saffron Dhoti */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.55, 0.75, 1.5, 10]} />
        <meshStandardMaterial color="#E65100" roughness={0.5} />
      </mesh>

      {/* Mighty Golden Gada (Mace) held firmly in hand */}
      <group position={[0.9, 1.4, 0.3]} rotation={[0, 0, -0.15]}>
        {/* Shaft */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 2.4, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Mace Head with Ribbed Spikes */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.45, 10, 10]} scale={[1, 1.25, 1]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} emissive="#FF8F00" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Left Hand in Devotional Anjali / Pranam Mudra */}
      <mesh position={[-0.3, 2.3, 0.5]}>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#FB8C00" />
      </mesh>

      {/* Devotional Light on Hanuman Ji */}
      <pointLight position={[0, 2.5, 1.5]} color="#FF9100" intensity={3.0} distance={10} />
    </group>
  )
}

// Vanar Sena Warrior with waving Saffron Flag 🚩
function SenaWarrior({ position = [0, 0, 0], scale = 0.8, flagAngle = 0 }) {
  const flagRef = useRef()

  useFrame((state) => {
    if (flagRef.current) {
      const t = state.clock.getElapsedTime() * 3 + position[0]
      flagRef.current.rotation.y = Math.sin(t) * 0.25
    }
  })

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 1.1, 8]} />
        <meshStandardMaterial color="#E65100" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#FF9800" roughness={0.6} />
      </mesh>

      {/* Saffron Flagstaff held up high */}
      <group position={[0.4, 1.5, 0]} rotation={[0, 0, -0.15 + flagAngle]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3.2, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} />
        </mesh>
        {/* Waving Saffron Flag 🚩 */}
        <mesh ref={flagRef} position={[0.65, 2.2, 0]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshStandardMaterial
            color="#FF3D00"
            side={THREE.DoubleSide}
            emissive="#FF5722"
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>
    </group>
  )
}

// Grand Decorated Royal Pushpak Chariot / Rath
function RoyalRath({ children }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Golden Rath Base Platform */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.8, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Intricately Carved Golden Railings */}
      {[-4.6, 4.6].map((x, idx) => (
        <mesh key={idx} position={[x, 1.6, 0]}>
          <boxGeometry args={[0.4, 0.9, 7.6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Rath Wheels (4 Massive Golden Sun Wheels / Surya Chakra) */}
      {[
        [-4.8, 0.8, 2.8],
        [4.8, 0.8, 2.8],
        [-4.8, 0.8, -2.8],
        [4.8, 0.8, -2.8],
      ].map((pos, idx) => (
        <group key={idx} position={pos} rotation={[0, 0, Math.PI / 2]}>
          {/* Wheel Rim */}
          <mesh>
            <torusGeometry args={[1.2, 0.16, 12, 24]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Hub */}
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.4, 12]} />
            <meshStandardMaterial color="#C68B16" metalness={0.8} />
          </mesh>
          {/* Spokes */}
          {Array.from({ length: 8 }).map((_, sIdx) => (
            <mesh key={sIdx} rotation={[0, 0, (sIdx * Math.PI) / 4]}>
              <boxGeometry args={[2.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#FFE082" metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Royal Chhatra (Golden Umbrella of Sovereignty) above Shri Ram */}
      <group position={[0, 6.8, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[3.2, 0.9, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Golden Kalash on umbrella top */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} />
        </mesh>
        {/* Support Staff */}
        <mesh position={[0, -2.2, -1.2]}>
          <cylinderGeometry args={[0.07, 0.07, 4.8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>
      </group>

      {/* Characters mounted on the Rath */}
      {children}
    </group>
  )
}

export default function ShriRamSena() {
  return (
    <group position={[0, 2.7, 0]}>
      {/* Royal Procession on the grand Ayodhya Plaza */}
      <RoyalRath>
        {/* 1. Lord Shri Ram at the center */}
        <LordRam position={[0, 1.2, 0]} />

        {/* 2. Mata Sita on Lord Ram's left */}
        <MataSita position={[-1.7, 1.2, 0]} />

        {/* 3. Lakshman Ji on Lord Ram's right */}
        <Lakshman position={[1.7, 1.2, 0]} />

        {/* 4. Hanuman Ji standing in forefront devotion */}
        <HanumanJi position={[0, 1.2, 2.5]} />
      </RoyalRath>

      {/* Vanar Sena Warriors welcoming the Lord with Saffron Flags & Joy */}
      <SenaWarrior position={[-4.5, 0, 3.5]} scale={0.85} flagAngle={0.1} />
      <SenaWarrior position={[-7.5, 0, 2.0]} scale={0.8} flagAngle={-0.15} />
      <SenaWarrior position={[-10.5, 0, 0.5]} scale={0.78} flagAngle={0.2} />

      <SenaWarrior position={[4.5, 0, 3.5]} scale={0.85} flagAngle={-0.1} />
      <SenaWarrior position={[7.5, 0, 2.0]} scale={0.8} flagAngle={0.15} />
      <SenaWarrior position={[10.5, 0, 0.5]} scale={0.78} flagAngle={-0.2} />

      {/* Procession Torchlights & Golden Radiance */}
      <pointLight position={[0, 4.5, 2.0]} color="#FFD54F" intensity={3.5} distance={20} />
      <pointLight position={[-6, 3, 2]} color="#FF7043" intensity={2.0} distance={12} />
      <pointLight position={[6, 3, 2]} color="#FF7043" intensity={2.0} distance={12} />
    </group>
  )
}

