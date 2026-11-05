import React from 'react'

export default function ExtremePattakasToolbar({
  slowMo,
  setSlowMo,
  autoCelebration,
  setAutoCelebration,
  onTriggerAnaar,
  onTriggerChakri,
  onTriggerLadi,
  onTriggerRocket,
  onTriggerBomb,
  onLightAll
}) {
  return (
    <footer style={{
      position: 'absolute',
      bottom: '1.2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'auto',
      maxWidth: '95vw',
      pointerEvents: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.6rem',
      zIndex: 30
    }}>
      {/* Interactive Cracker Launch Bar */}
      <div
        className="glass-panel ornate-border"
        style={{
          padding: '0.65rem 1.1rem',
          borderRadius: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.55rem',
          border: '1.5px solid rgba(255, 112, 67, 0.5)',
          boxShadow: '0 8px 30px rgba(230, 81, 0, 0.4)'
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#FFD700', fontWeight: 700, paddingRight: '0.3rem' }}>
          💥 Ignite 3D Crackers:
        </span>

        {/* 1. Anaar Button */}
        <button
          onClick={onTriggerAnaar}
          className="glass-panel"
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            color: '#FFE082',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🌟</span>
          <span>Royal Fountain (Anaar)</span>
        </button>

        {/* 2. Chakri Button */}
        <button
          onClick={onTriggerChakri}
          className="glass-panel"
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            color: '#FFE082',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>💫</span>
          <span>Ground Spinner (Chakri)</span>
        </button>

        {/* 3. Ladi Button */}
        <button
          onClick={onTriggerLadi}
          className="glass-panel"
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            color: '#FF8A80',
            border: '1px solid rgba(255, 23, 68, 0.4)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🧨</span>
          <span>1000 Crackers String (Ladi)</span>
        </button>

        {/* 4. Rocket Button */}
        <button
          onClick={onTriggerRocket}
          className="glass-panel"
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            color: '#80D8FF',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🚀</span>
          <span>Sky Rocket</span>
        </button>

        {/* 5. Sutli Bomb */}
        <button
          onClick={onTriggerBomb}
          className="glass-panel"
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            color: '#A5D6A7',
            border: '1px solid rgba(76, 175, 80, 0.4)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>💣</span>
          <span>Hydro Bomb</span>
        </button>

        {/* Light All */}
        <button
          onClick={onLightAll}
          className="gold-btn"
          style={{
            padding: '0.45rem 1.05rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🔥</span>
          <span>Ignite All</span>
        </button>

        {/* Slow Mo Toggle */}
        <button
          onClick={() => setSlowMo(!slowMo)}
          style={{
            background: slowMo ? 'linear-gradient(135deg, #00E5FF, #2979FF)' : 'rgba(255, 255, 255, 0.08)',
            color: slowMo ? '#001E3C' : '#80D8FF',
            border: '1px solid rgba(0, 229, 255, 0.5)',
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>⏱️</span>
          <span>{slowMo ? 'Slow-Mo 0.25x: ON' : 'Slow-Mo: OFF'}</span>
        </button>

        {/* Auto Celebration Toggle */}
        <button
          onClick={() => setAutoCelebration(!autoCelebration)}
          style={{
            background: autoCelebration ? 'linear-gradient(135deg, #FFD700, #FF9800)' : 'rgba(255, 255, 255, 0.08)',
            color: autoCelebration ? '#120800' : '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            padding: '0.45rem 0.95rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🎆</span>
          <span>{autoCelebration ? 'Auto Loop: ON' : 'Auto Loop: OFF'}</span>
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <p style={{
        margin: 0,
        fontSize: '0.8rem',
        color: '#FFE082',
        opacity: 0.9,
        textShadow: '0 1px 4px rgba(0,0,0,0.9)'
      }}>
        💡 Click on any 3D firecracker or Diya on the ground to ignite it
      </p>
    </footer>
  )
}
