import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Nagara-Style Mandir Shikhara Spire Geometry
function ShikharaSpire({ position = [0, 0, 0], scale = [1, 1, 1], tiers = 7 }) {
  const spireTiers = useMemo(() => {
    const list = []
    for (let i = 0; i < tiers; i++) {
      const progress = i / tiers
      const radiusBottom = (1 - progress * 0.75) * 3.2
      const radiusTop = (1 - (progress + 1 / tiers) * 0.75) * 3.2
      const height = 1.4
      const y = i * 1.35
      list.push({ radiusBottom, radiusTop, height, y })
    }
    return list
  }, [tiers])

  return (
    <group position={position} scale={scale}>
      {/* Stepped Shikhara Tiers */}
      {spireTiers.map((tier, idx) => (
        <group key={idx} position={[0, tier.y, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[tier.radiusTop, tier.radiusBottom, tier.height, 16]} />
            <meshStandardMaterial
              color="#DDA15E"
              roughness={0.65}
              metalness={0.25}
            />
          </mesh>
          {/* Decorative Corner Urushringas (mini replica spires) */}
          {idx < tiers - 2 && idx > 0 && (
            [
              [tier.radiusBottom * 0.7, 0, tier.radiusBottom * 0.7],
              [-tier.radiusBottom * 0.7, 0, tier.radiusBottom * 0.7],
              [tier.radiusBottom * 0.7, 0, -tier.radiusBottom * 0.7],
              [-tier.radiusBottom * 0.7, 0, -tier.radiusBottom * 0.7],
            ].map((pos, pIdx) => (
              <mesh key={pIdx} position={pos}>
                <coneGeometry args={[0.55, 1.2, 8]} />
                <meshStandardMaterial color="#C68B16" roughness={0.5} metalness={0.4} />
              </mesh>
            ))
          )}
        </group>
      ))}

      {/* Amalaka (Ribbed Stone Disc) on Top */}
      <mesh position={[0, tiers * 1.35 + 0.3, 0]} castShadow>
        <torusGeometry args={[1.1, 0.45, 12, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Golden Kalash on Top */}
      <mesh position={[0, tiers * 1.35 + 1.1, 0]} castShadow>
        <sphereGeometry args={[0.65, 16, 16]} scale={[1, 1.4, 1]} />
        <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} emissive="#FFA500" emissiveIntensity={0.25} />
      </mesh>
      {/* Kalash Needle Finial */}
      <mesh position={[0, tiers * 1.35 + 2.1, 0]}>
        <coneGeometry args={[0.15, 1.0, 8]} />
        <meshStandardMaterial color="#FFE082" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  )
}

// Saffron Dhwaja (Flag 🚩) with wind simulation
function TempleDhwaja({ position = [0, 0, 0] }) {
  const flagRef = useRef()
  const geometryRef = useRef()

  useFrame((state) => {
    if (geometryRef.current) {
      const time = state.clock.getElapsedTime() * 3.5
      const pos = geometryRef.current.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i) // along length of flag
        if (u > 0) {
          const wave = Math.sin(time + u * 2.5) * 0.25 * (u / 2.5)
          pos.setZ(i, wave)
        }
      }
      pos.needsUpdate = true
    }
  })

  // Triangular Pennant Flag geometry
  const flagGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.8, 1.4, 16, 8)
    geo.translate(1.4, 0, 0) // anchor at pole
    return geo
  }, [])

  return (
    <group position={position}>
      {/* Golden Flagstaff Pole */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3.6, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Saffron Flag Mesh */}
      <mesh ref={flagRef} position={[0, 2.5, 0]}>
        <primitive object={flagGeo} ref={geometryRef} attach="geometry" />
        <meshStandardMaterial
          color="#FF5722"
          roughness={0.4}
          side={THREE.DoubleSide}
          emissive="#FF3D00"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Surya / Om Symbol Glow at Flag Top */}
      <pointLight position={[0, 3.6, 0]} color="#FF9800" intensity={1.5} distance={8} />
    </group>
  )
}

// Carved Temple Pillar (Stambha)
function TemplePillar({ position = [0, 0, 0], height = 5 }) {
  return (
    <group position={position}>
      {/* Square Base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#DDA15E" roughness={0.7} />
      </mesh>
      {/* Octagonal Shaft */}
      <mesh position={[0, height / 2 + 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.35, height, 8]} />
        <meshStandardMaterial color="#E9C46A" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Bracket Capital Top */}
      <mesh position={[0, height + 0.45, 0]}>
        <boxGeometry args={[0.9, 0.35, 0.9]} />
        <meshStandardMaterial color="#DDA15E" roughness={0.7} />
      </mesh>
    </group>
  )
}

// Royal Arch / Torana
function RoyalTorana({ position = [0, 0, 0], width = 7, height = 6 }) {
  return (
    <group position={position}>
      <TemplePillar position={[-width / 2, 0, 0]} height={height} />
      <TemplePillar position={[width / 2, 0, 0]} height={height} />

      {/* Curved Arch Beam */}
      <mesh position={[0, height + 0.6, 0]}>
        <boxGeometry args={[width + 1.2, 0.7, 0.8]} />
        <meshStandardMaterial color="#C68B16" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Central Golden Crest / Kirtimukha */}
      <mesh position={[0, height + 1.5, 0]}>
        <coneGeometry args={[0.8, 1.2, 8]} />
        <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  )
}

// Deepastambha (Tall Pillar of Light)
function Deepastambha({ position = [0, 0, 0], tiers = 6 }) {
  return (
    <group position={position}>
      {/* Column */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.35, 0.55, 9, 12]} />
        <meshStandardMaterial color="#9C6644" roughness={0.6} />
      </mesh>
      {/* Tiers of Diyas */}
      {Array.from({ length: tiers }).map((_, i) => {
        const y = 1.5 + i * 1.3
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <cylinderGeometry args={[1.0 - i * 0.1, 0.3, 0.25, 12]} />
              <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* 4 small glow flames around perimeter */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, aIdx) => (
              <mesh
                key={aIdx}
                position={[
                  Math.cos(angle) * (0.9 - i * 0.08),
                  0.2,
                  Math.sin(angle) * (0.9 - i * 0.08)
                ]}
              >
                <sphereGeometry args={[0.12, 6, 6]} />
                <meshBasicMaterial color="#FFB300" />
              </mesh>
            ))}
          </group>
        )
      })}
      {/* Top Beacon Flame */}
      <mesh position={[0, 9.3, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} scale={[0.8, 1.5, 0.8]} />
        <meshBasicMaterial color="#FFF59D" />
      </mesh>
      <pointLight position={[0, 9.4, 0]} color="#FFA500" intensity={2.5} distance={15} />
    </group>
  )
}

export default function AyodhyaCity() {
  const diyasInstancedRef = useRef()

  // Generate thousands of glowing Diyas on the Ghats, Balconies, Temple steps and terraces
  const diyaPositions = useMemo(() => {
    const list = []

    // 1. Ghat Steps (Along Saryu Riverbank)
    const ghatSteps = 10
    const ghatWidth = 80
    for (let step = 0; step < ghatSteps; step++) {
      const z = 6 - step * 1.5 // steps lead up from water (z=6) to palace plaza (z=-9)
      const y = -1.8 + step * 0.45
      const countOnStep = 45
      for (let i = 0; i < countOnStep; i++) {
        const x = -ghatWidth / 2 + (i / countOnStep) * ghatWidth + (Math.random() - 0.5) * 0.5
        list.push([x, y + 0.15, z + (Math.random() - 0.5) * 0.4])
      }
    }

    // 2. Temple Plaza & Promenade
    for (let i = 0; i < 220; i++) {
      const x = (Math.random() - 0.5) * 70
      const z = -10 - Math.random() * 25
      const y = 2.8
      list.push([x, y, z])
    }

    // 3. Palace Balconies & Terraces
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() - 0.5) * 55
      const z = -20 - Math.random() * 20
      const y = 6.5 + Math.random() * 8
      list.push([x, y, z])
    }

    return list
  }, [])

  // Animate Diya flicker in instanced mesh
  useFrame((state) => {
    if (diyasInstancedRef.current) {
      const time = state.clock.getElapsedTime()
      // Subtly pulse scale/brightness
      const flicker = 0.95 + Math.sin(time * 8) * 0.05
      diyasInstancedRef.current.scale.set(flicker, flicker, flicker)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* ======================================================== */}
      {/* 1. AYODHYA GHATS (STONE STEPS LEADING DOWN TO SARYU) */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: 11 }).map((_, step) => {
          const z = 6 - step * 1.5
          const y = -1.8 + step * 0.45
          return (
            <mesh key={step} position={[0, y, z]} receiveShadow>
              <boxGeometry args={[95, 0.45, 1.8]} />
              <meshStandardMaterial
                color="#D4A373"
                roughness={0.75}
                metalness={0.15}
              />
            </mesh>
          )
        })}

        {/* Ghat Side Bastions / Pavilions (Burj) */}
        {[-44, 44].map((x, idx) => (
          <group key={idx} position={[x, 0.5, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[4.5, 5.5, 6, 16]} />
              <meshStandardMaterial color="#C68B16" roughness={0.6} />
            </mesh>
            {/* Chhatri Dome */}
            <mesh position={[0, 4.2, 0]}>
              <sphereGeometry args={[4.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Finial */}
            <mesh position={[0, 8.8, 0]}>
              <coneGeometry args={[0.5, 1.6, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            <pointLight position={[0, 3.5, 0]} color="#FFA500" intensity={2.0} distance={15} />
          </group>
        ))}

        {/* Ceremonial Deepastambha Pillars on Left & Right Ghats */}
        <Deepastambha position={[-32, 2.7, -4]} />
        <Deepastambha position={[-18, 2.7, -6]} />
        <Deepastambha position={[18, 2.7, -6]} />
        <Deepastambha position={[32, 2.7, -4]} />
      </group>

      {/* ======================================================== */}
      {/* 2. GRAND RAM MANDIR (CENTRAL SACRED SHRINE) */}
      {/* ======================================================== */}
      <group position={[0, 2.7, -26]}>
        {/* Jagati (Elevated Temple Plinth) */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[36, 1.6, 32]} />
          <meshStandardMaterial color="#DDA15E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[32, 1.0, 28]} />
          <meshStandardMaterial color="#C68B16" roughness={0.65} metalness={0.2} />
        </mesh>

        {/* Central Garbhagriha Main Shikhara (Grand Sacred Spire) */}
        <ShikharaSpire position={[0, 2.5, -6]} scale={[2.2, 2.4, 2.2]} tiers={9} />
        {/* Top Flag 🚩 on Ram Mandir */}
        <TempleDhwaja position={[0, 29.5, -6]} />

        {/* Secondary Shikhara Spire (Gudha Mandap) */}
        <ShikharaSpire position={[0, 2.5, 4]} scale={[1.5, 1.6, 1.5]} tiers={7} />

        {/* Left & Right Corner Subsidiary Shrines (Panchayatana Style) */}
        <ShikharaSpire position={[-11, 2.5, -6]} scale={[0.9, 1.1, 0.9]} tiers={6} />
        <ShikharaSpire position={[11, 2.5, -6]} scale={[0.9, 1.1, 0.9]} tiers={6} />
        <ShikharaSpire position={[-10, 2.5, 6]} scale={[0.8, 0.95, 0.8]} tiers={5} />
        <ShikharaSpire position={[10, 2.5, 6]} scale={[0.8, 0.95, 0.8]} tiers={5} />

        {/* Pillared Mandap Hallway & Pillars */}
        {[-8, -4, 4, 8].map((x, colIdx) =>
          [-2, 2, 6, 10].map((z, rowIdx) => (
            <TemplePillar key={`${colIdx}-${rowIdx}`} position={[x, 2.5, z]} height={4.2} />
          ))
        )}

        {/* Mandap Roof Slabs */}
        <mesh position={[0, 7.0, 4]} castShadow>
          <boxGeometry args={[22, 0.8, 18]} />
          <meshStandardMaterial color="#BC6C25" roughness={0.6} metalness={0.25} />
        </mesh>

        {/* Grand Front Entrance Torana Arch */}
        <RoyalTorana position={[0, 2.5, 13.5]} width={8} height={5.5} />

        {/* Divine Garbhagriha Golden Glow Light */}
        <pointLight position={[0, 5.5, -4]} color="#FFD700" intensity={4.5} distance={25} />
        <pointLight position={[0, 16, -6]} color="#FFA500" intensity={3.5} distance={35} />
      </group>

      {/* ======================================================== */}
      {/* 3. SURROUNDING AYODHYA GOLDEN PALACES & SKYLINE */}
      {/* ======================================================== */}
      {/* Left Palace Complex */}
      <group position={[-38, 2.5, -28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[24, 12, 18]} />
          <meshStandardMaterial color="#C68B16" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* Golden Domes on Palaces */}
        <mesh position={[-6, 7.5, 0]}>
          <sphereGeometry args={[3.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[6, 7.5, 0]}>
          <sphereGeometry args={[3.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Balconies / Jharokhas */}
        {[-6, 0, 6].map((x, jIdx) => (
          <mesh key={jIdx} position={[x, 3, 9.2]}>
            <boxGeometry args={[2.8, 2.2, 0.8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Right Palace Complex */}
      <group position={[38, 2.5, -28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[24, 12, 18]} />
          <meshStandardMaterial color="#C68B16" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* Golden Domes */}
        <mesh position={[-6, 7.5, 0]}>
          <sphereGeometry args={[3.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[6, 7.5, 0]}>
          <sphereGeometry args={[3.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Balconies */}
        {[-6, 0, 6].map((x, jIdx) => (
          <mesh key={jIdx} position={[x, 3, 9.2]}>
            <boxGeometry args={[2.8, 2.2, 0.8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Distant Ayodhya City Minarets & Spires silhouette in the background */}
      {[-70, -56, 56, 70].map((x, i) => (
        <group key={i} position={[x, 2.5, -45]}>
          <mesh>
            <cylinderGeometry args={[2.2, 2.8, 20, 12]} />
            <meshStandardMaterial color="#9C6644" roughness={0.8} />
          </mesh>
          <mesh position={[0, 12, 0]}>
            <coneGeometry args={[2.6, 5, 12]} />
            <meshStandardMaterial color="#C68B16" metalness={0.6} roughness={0.4} />
          </mesh>
          <pointLight position={[0, 15, 0]} color="#FF9800" intensity={1.5} distance={20} />
        </group>
      ))}

      {/* ======================================================== */}
      {/* 4. THOUSANDS OF GLOWING DIYAS (DEEPAWALI MAHOTSAV) */}
      {/* ======================================================== */}
      <group ref={diyasInstancedRef}>
        {diyaPositions.map((pos, idx) => (
          <group key={idx} position={pos}>
            {/* Clay Bowl */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.1, 0.1, 8]} />
              <meshStandardMaterial color="#9C512D" roughness={0.8} />
            </mesh>
            {/* Golden Flame */}
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.08, 6, 6]} scale={[0.8, 1.6, 0.8]} />
              <meshBasicMaterial color="#FFF59D" />
            </mesh>
            {/* Flame Halo Aura */}
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.22, 6, 6]} />
              <meshBasicMaterial color="#FF9800" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Key Atmospheric Golden Point Lights casting warm glow on Ghats */}
      <pointLight position={[0, 1.5, 2]} color="#FFA000" intensity={2.8} distance={22} />
      <pointLight position={[-15, 2.0, 0]} color="#FF8F00" intensity={2.2} distance={18} />
      <pointLight position={[15, 2.0, 0]} color="#FF8F00" intensity={2.2} distance={18} />
      <pointLight position={[-28, 3.0, -8]} color="#FFB300" intensity={2.5} distance={20} />
      <pointLight position={[28, 3.0, -8]} color="#FFB300" intensity={2.5} distance={20} />
    </group>
  )
}
