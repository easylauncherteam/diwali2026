import React, { useState } from 'react'

export default function GreetingCardModal({ isOpen, onClose }) {
  const [senderName, setSenderName] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const greetingMessage = `🪔 *शुभ दीपावली २०२६* 🪔\n\n"अधर्म पर धर्म की विजय, अंधकार पर प्रकाश की विजय।"\n\n${
    senderName ? `*${senderName}*` : 'हम'
  } की ओर से आपको एवं आपके पूरे परिवार को दीपावली की हार्दिक शुभकामनाएं!\n\nजय श्री राम 🚩✨`

  const handleCopy = () => {
    navigator.clipboard.writeText(greetingMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(greetingMessage)}`
    window.open(url, '_blank')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(2, 6, 20, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.2rem'
    }}>
      <div className="glass-panel ornate-border" style={{
        maxWidth: '520px',
        width: '100%',
        borderRadius: '20px',
        padding: '2.4rem 2rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            color: '#FFD700',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* Card Header */}
        <div style={{ fontSize: '2.8rem', marginBottom: '0.4rem' }}>🪔 ✨ 🪔</div>
        <h2 className="font-devanagari-royal gold-gradient-text" style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
          शुभ दीपावली २०२६
        </h2>
        <p style={{ color: '#FFA726', fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem' }}>
          अयोध्या धाम महा दीपोत्सव
        </p>

        {/* Shloka Quote */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.08)',
          borderLeft: '3px solid #FFD700',
          padding: '0.9rem 1rem',
          borderRadius: '8px',
          margin: '1.2rem 0',
          fontStyle: 'italic',
          color: '#FFF2A1',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          "अधर्म पर धर्म की विजय, अंधकार पर प्रकाश की विजय।" <br />
          <span style={{ color: '#FF7043', fontWeight: 'bold' }}>जय श्री राम 🚩</span>
        </div>

        {/* Name Input */}
        <div style={{ margin: '1.4rem 0 1rem' }}>
          <label style={{ display: 'block', color: '#FFE082', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>
            आपका नाम दर्ज करें (Enter your name):
          </label>
          <input
            type="text"
            placeholder="उदा. राघव शर्मा"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              background: 'rgba(0, 0, 0, 0.45)',
              color: '#FFFFFF',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border 0.3s'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          <button
            onClick={handleCopy}
            className="gold-btn"
            style={{
              flex: 1,
              padding: '0.85rem 1.2rem',
              borderRadius: '12px',
              fontSize: '0.95rem'
            }}
          >
            {copied ? '✓ कॉपी हो गया!' : '📋 कॉपी करें'}
          </button>
          <button
            onClick={handleWhatsApp}
            style={{
              flex: 1,
              padding: '0.85rem 1.2rem',
              borderRadius: '12px',
              background: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
            }}
          >
            💬 WhatsApp शेयर
          </button>
        </div>
      </div>
    </div>
  )
}

