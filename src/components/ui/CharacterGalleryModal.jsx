import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { soundEngine } from '../../audio/soundEngine'

export const CHARACTERS_DATA = [
  {
    id: 'ram',
    nameHindi: 'प्रभु श्री राम',
    title: 'मर्यादा पुरुषोत्तम (Lord Shri Ram)',
    role: 'भगवान विष्णु के सातवें अवतार, सत्य और धर्म के प्रतीक',
    shloka: 'राम रामेति रामेति रमे रामे मनोरमे। सहस्रनाम तत्तुल्यं रामनाम वरानने॥',
    shlokaMeaning: 'Chanting the sacred name of Shri Ram is equivalent to chanting a thousand divine names.',
    attributes: ['कोदंड धनुष (Kodanda Bow)', 'सूर्यवंश मुकुट (Solar Dynasty Crown)', 'नीलमेघ श्याम वर्ण (Neelamegha Shyam)', 'पीताम्बर वस्त्र (Golden Silk)'],
    image: '/characters/lord_ram.png',
    bgGradient: 'radial-gradient(circle at center, rgba(255, 160, 0, 0.35) 0%, rgba(10, 16, 35, 0.95) 75%)',
    borderColor: '#FFD700'
  },
  {
    id: 'sita',
    nameHindi: 'माता सीता',
    title: 'वैदेही / जनक नंदिनी (Mata Sita)',
    role: 'माता लक्ष्मी का पावन अवतार, त्याग, पवित्रता और असीम धैर्य की देवी',
    shloka: 'उद्भवस्थितिसंहारकारिणीं क्लेशहारिणीम्। सर्वश्रेयस्करीं सीतां नतोऽहं रामवल्लभाम्॥',
    shlokaMeaning: 'I bow to Mata Sita, beloved of Shri Ram, the creator, sustainer, and dispeller of all sorrow.',
    attributes: ['रत्नजड़ित साड़ी (Golden Zari Saree)', 'मांग टीका व आभूषण (Ornate Jewels)', 'कमल पुष्प (Lotus Grace)', 'दिव्य प्रभा (Divine Glow)'],
    image: '/characters/mata_sita.png',
    bgGradient: 'radial-gradient(circle at center, rgba(233, 30, 99, 0.3) 0%, rgba(15, 10, 30, 0.95) 75%)',
    borderColor: '#FF80AB'
  },
  {
    id: 'hanuman',
    nameHindi: 'पवनपुत्र हनुमान जी',
    title: 'संकटमोचन / परम रामभक्त (Hanuman Ji)',
    role: 'अष्टसिद्धि नवनिधि के दाता, श्री राम के अनन्य सेवक और शक्ति के प्रतीक',
    shloka: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
    shlokaMeaning: 'I seek refuge in Shri Ram’s messenger Hanuman, as swift as the mind, master of the senses, foremost among the wise.',
    attributes: ['स्वर्ण गदा (Golden Mace)', 'प्रणाम मुद्रा (Folded Devotional Hands)', 'सिंदूरी प्रभा (Vermillion Radiance)', 'पुष्प वृष्टि (Petal Shower)'],
    image: '/characters/hanuman_ji.png',
    bgGradient: 'radial-gradient(circle at center, rgba(255, 109, 0, 0.35) 0%, rgba(20, 10, 10, 0.95) 75%)',
    borderColor: '#FF9800'
  },
  {
    id: 'lakshman',
    nameHindi: 'वीर लक्ष्मण जी',
    title: 'सौमित्र / शेषावतार (Prince Lakshman)',
    role: 'भगवान शेषनाग के अवतार, भ्रातृ-प्रेम, निष्ठा और अदम्य शौर्य के प्रतीक',
    shloka: 'लक्ष्मणो लक्ष्मीसंपन्नः सुमित्राऽऽनन्दवर्धनः। भ्रातुर्विधेयो धर्मज्ञो रामेण सह संस्थितः॥',
    shlokaMeaning: 'Lakshman, endowed with noble virtues and filial love, ever vigilant in service and protection of Shri Ram.',
    attributes: ['दिव्य धनुष-बाण (Quiver & Bow)', 'स्वर्ण कवच (Golden Armor)', 'वीर मुद्रा (Warrior Stance)', 'लक्ष्मण रेखा (Protective Ring)'],
    image: '/characters/lakshman_ji.png',
    bgGradient: 'radial-gradient(circle at center, rgba(255, 193, 7, 0.3) 0%, rgba(15, 15, 30, 0.95) 75%)',
    borderColor: '#FFE082'
  },
  {
    id: 'bharat',
    nameHindi: 'भक्त भरत जी',
    title: 'पादुका सेवक (Prince Bharat)',
    role: 'निःस्वार्थ प्रेम और त्याग की पराकाष्ठा, जिन्होंने राम की चरण-पादुकाओं को सिंहासन पर रखकर राज्य किया',
    shloka: 'भरतस्य चरित्रं तु श्रुत्वा पापैः प्रमुच्यते। भ्रातृस्नेहो महाभागो धर्मज्ञः सत्यसंगरः॥',
    shlokaMeaning: 'Listening to Bharat’s selfless character liberates one from sin—the epitome of fraternal affection and righteousness.',
    attributes: ['चरण पादुकाएं (Sacred Charan Padukas)', 'मखमली आसन (Velvet Cushion)', 'तपस्वी वेष (Ascetic Robes)', 'अश्रुपूर्ण नयन (Devoted Tears)'],
    image: '/characters/bharat_padukas.png',
    bgGradient: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.3) 0%, rgba(10, 25, 20, 0.95) 75%)',
    borderColor: '#81C784'
  },
  {
    id: 'ravana',
    nameHindi: 'दशानन रावण',
    title: 'लंकापति (King Ravana of Lanka)',
    role: 'महापराक्रमी शिवभक्त व वेदों का ज्ञाता, जिसका अहंकार और अधर्म उसके विनाश का कारण बना',
    shloka: 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्। डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥',
    shlokaMeaning: 'Author of the Shiva Tandava Stotram; immense knowledge clouded by arrogance leading to the victory of Dharma.',
    attributes: ['दस मस्तक (Ten Crowned Heads)', 'रक्त नेत्र (Fiery Red Eyes)', 'अनेक अस्त्र (Multi-arm Weapons)', 'पुष्पक विमान (Pushpak Viman)'],
    image: '/characters/ravana.png',
    bgGradient: 'radial-gradient(circle at center, rgba(213, 0, 0, 0.35) 0%, rgba(20, 5, 5, 0.95) 75%)',
    borderColor: '#FF1744'
  }
]

export default function CharacterGalleryModal({ isOpen, onClose }) {
  const [selectedCharIndex, setSelectedCharIndex] = useState(0)

  if (!isOpen) return null

  const char = CHARACTERS_DATA[selectedCharIndex]

  const handleSelect = (idx) => {
    soundEngine.playTempleBell(1.2)
    setSelectedCharIndex(idx)
  }

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(3, 6, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        padding: '1.2rem',
        pointerEvents: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="glass-panel ornate-border"
          style={{
            maxWidth: '920px',
            width: '100%',
            maxHeight: '92vh',
            borderRadius: '24px',
            padding: '1.8rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            overflowY: 'auto',
            border: `2px solid ${char.borderColor}`,
            boxShadow: `0 0 50px rgba(0,0,0,0.8), 0 0 30px ${char.borderColor}40`
          }}
        >
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 215, 0, 0.25)',
            paddingBottom: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ fontSize: '1.6rem' }}>👑</span>
              <div>
                <h2 className="gold-gradient-text" style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700 }}>
                  Divine Ramayana Characters
                </h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#FFB74D' }}>
                  Sacred forms and divine virtues from the epic Ramayana
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: '#FFD700',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}
            >
              ✕
            </button>
          </div>

          {/* Character Selector Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {CHARACTERS_DATA.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => handleSelect(idx)}
                style={{
                  background: selectedCharIndex === idx
                    ? 'linear-gradient(135deg, #FFD700, #FF9800)'
                    : 'rgba(255, 255, 255, 0.06)',
                  color: selectedCharIndex === idx ? '#100800' : '#FFD700',
                  fontWeight: selectedCharIndex === idx ? 700 : 500,
                  border: selectedCharIndex === idx ? '1px solid #FFE082' : '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '16px',
                  padding: '0.45rem 0.95rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.25s'
                }}
              >
                {c.nameHindi}
              </button>
            ))}
          </div>

          {/* Main Character Showcase Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            background: char.bgGradient,
            borderRadius: '20px',
            padding: '1.4rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Character Image / Render Frame */}
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              minHeight: '320px',
              maxHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              border: `2px solid ${char.borderColor}`,
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 20px ${char.borderColor}40`
            }}>
              <img
                src={char.image}
                alt={char.nameHindi}
                onError={(e) => {
                  // Fallback avatar icon if image is still generating
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Fallback 3D Character Illustration Placeholder */}
              <div style={{
                display: 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4.5rem' }}>
                  {char.id === 'ram' && '🏹'}
                  {char.id === 'sita' && '🌸'}
                  {char.id === 'hanuman' && '🙏'}
                  {char.id === 'lakshman' && '🛡️'}
                  {char.id === 'bharat' && '👑'}
                  {char.id === 'ravana' && '🔥'}
                </div>
                <h3 className="font-devanagari-royal gold-gradient-text" style={{ fontSize: '1.6rem', margin: 0 }}>
                  {char.nameHindi}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#FFE082' }}>
                  {char.title}
                </p>
              </div>
            </div>

            {/* Character Details & Shloka */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <span style={{
                  padding: '0.2rem 0.75rem',
                  borderRadius: '14px',
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFE082',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {char.title}
                </span>
                <h3
                  className="font-devanagari-royal gold-gradient-text"
                  style={{ fontSize: '2.0rem', margin: '0.3rem 0', lineHeight: 1.15 }}
                >
                  {char.nameHindi}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#FFF2A1', lineHeight: 1.4, margin: 0 }}>
                  {char.role}
                </p>
              </div>

              {/* Sacred Sanskrit Shloka */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.45)',
                borderLeft: `4px solid ${char.borderColor}`,
                padding: '0.85rem 1.0rem',
                borderRadius: '12px'
              }}>
                <p style={{
                  fontFamily: "'Rozha One', serif",
                  color: '#FFE082',
                  fontSize: '0.92rem',
                  lineHeight: 1.45,
                  margin: 0
                }}>
                  "{char.shloka}"
                </p>
                <p style={{
                  fontSize: '0.78rem',
                  color: '#CFD8DC',
                  margin: '0.4rem 0 0',
                  lineHeight: 1.35
                }}>
                  {char.shlokaMeaning}
                </p>
              </div>

              {/* Attributes / Divine Symbols */}
              <div>
                <h4 style={{ fontSize: '0.82rem', color: '#FFD700', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Divine Symbols & Attributes:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {char.attributes.map((attr, aIdx) => (
                    <span
                      key={aIdx}
                      style={{
                        padding: '0.25rem 0.7rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 215, 0, 0.25)',
                        fontSize: '0.78rem',
                        color: '#FFE082'
                      }}
                    >
                      ✨ {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
