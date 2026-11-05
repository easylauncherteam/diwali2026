// Procedural Web Audio API Sound Synthesizer & Hindi Speech Engine for Diwali 3D Experience
// Works 100% offline, zero external file dependencies, ultra-high performance.

class SoundEngine {
  constructor() {
    this.ctx = null
    this.isMuted = false
    this.isAmbientPlaying = false
    this.ambientGain = null
    this.ambientOscillators = []
    this.sceneMusicOscs = []
    this.sceneMusicGain = null
    this.currentSceneTrack = null
    this.speechUtterance = null
    this.speechEnabled = true
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.15,
        this.ctx.currentTime
      )
    }
    if (this.sceneMusicGain && this.ctx) {
      this.sceneMusicGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.22,
        this.ctx.currentTime
      )
    }
    if (window.speechSynthesis && this.isMuted) {
      window.speechSynthesis.cancel()
    }
    return this.isMuted
  }

  // ========================================================
  // NATURAL ENGLISH VOICE NARRATION (Web Speech API)
  // ========================================================
  speakEnglish(text, onEnd) {
    if (this.isMuted) {
      if (onEnd) setTimeout(onEnd, 3500)
      return
    }

    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser')
      if (onEnd) setTimeout(onEnd, 4500)
      return
    }

    try {
      window.speechSynthesis.cancel() // Stop any previous narration

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.94 // Dignified, calm storytelling cadence
      utterance.pitch = 1.0

      // Find best English voice (Natural, Google, or smooth system voice)
      const voices = window.speechSynthesis.getVoices()
      const enVoice = voices.find(v =>
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Guy') || v.name.includes('Zira') || v.name.includes('Samantha')))
      ) || voices.find(v => v.lang.startsWith('en'))

      if (enVoice) {
        utterance.voice = enVoice
      }

      let ended = false
      const finish = () => {
        if (!ended) {
          ended = true
          if (onEnd) onEnd()
        }
      }

      utterance.onend = finish
      utterance.onerror = finish

      // Fallback timer in case speech synthesis gets stuck
      const estimatedDurationMs = Math.max(4000, text.length * 85)
      setTimeout(() => {
        if (!ended) {
          finish()
        }
      }, estimatedDurationMs + 1000)

      this.speechUtterance = utterance
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.error('Speech error:', e)
      if (onEnd) setTimeout(onEnd, 4000)
    }
  }

  // Alias for backward compatibility
  speakHindi(text, onEnd) {
    this.speakEnglish(text, onEnd)
  }

  stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  // ========================================================
  // CINEMATIC SCENE BACKGROUND MUSIC (Procedural Ragas & Atmospheres)
  // ========================================================
  playSceneTheme(sceneIndex) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    // Stop existing scene track smoothly
    this.stopSceneTheme()

    const now = this.ctx.currentTime
    this.sceneMusicGain = this.ctx.createGain()
    this.sceneMusicGain.gain.setValueAtTime(0.001, now)
    this.sceneMusicGain.gain.linearRampToValueAtTime(0.2, now + 2.0)
    this.sceneMusicGain.connect(this.ctx.destination)

    this.currentSceneTrack = sceneIndex

    // Define harmonic modes for each scene:
    // Scene 0 (Dasharath Vanvas): Emotive, sorrowful Raag Shivranjani / Bhairavi
    // Scene 1 (Bharat Milap): Devotional, serene Raag Yaman
    // Scene 2 (Sita Haran): Dark, dramatic Raag Marwa / Todi tension
    // Scene 3 (Hanuman Milap): Uplifting Raag Bhupali & flute
    // Scene 4 (Ravana Dahan): Powerful War drums & brass heroic mode
    // Scene 5 (Ayodhya Return / Finale): Grand Diwali Celebration Aarti & Dhol

    if (sceneIndex === 0) {
      // Dasharath Exile - Gentle mournful drone + bamboo flute sorrow
      const base = [110, 165, 220, 261.6] // A minor
      base.forEach(freq => {
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        g.gain.value = 0.18
        osc.connect(g)
        g.connect(this.sceneMusicGain)
        osc.start(now)
        this.sceneMusicOscs.push(osc)
      })
    } else if (sceneIndex === 1) {
      // Bharat Milap - Serene forest Yaman (peaceful major harmony)
      const base = [130.81, 164.81, 196.0, 246.94] // C major 7th / Yaman
      base.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq, now)
        g.gain.value = 0.16
        osc.connect(g)
        g.connect(this.sceneMusicGain)
        osc.start(now)
        this.sceneMusicOscs.push(osc)
      })
    } else if (sceneIndex === 2) {
      // Sita Haran - Tension diminished drone & stormy tremolo
      const base = [92.5, 130.81, 185.0, 277.18] // Dark diminished chord
      base.forEach(freq => {
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = 'sawtooth'
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 450
        osc.frequency.setValueAtTime(freq, now)
        g.gain.value = 0.14
        osc.connect(filter)
        filter.connect(g)
        g.connect(this.sceneMusicGain)
        osc.start(now)
        this.sceneMusicOscs.push(osc)
      })
    } else if (sceneIndex === 3) {
      // Hanuman Milap - Bright, divine Bhupali (D major pentatonic)
      const base = [146.83, 164.81, 220.0, 293.66, 369.99]
      base.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        g.gain.value = 0.15
        osc.connect(g)
        g.connect(this.sceneMusicGain)
        osc.start(now)
        this.sceneMusicOscs.push(osc)
      })
    } else if (sceneIndex === 4) {
      // Ravana Dahan - War intensity low pulse
      const base = [73.42, 110.0, 146.83, 220.0]
      base.forEach(freq => {
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = 'sawtooth'
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 600
        osc.frequency.setValueAtTime(freq, now)
        g.gain.value = 0.18
        osc.connect(filter)
        filter.connect(g)
        g.connect(this.sceneMusicGain)
        osc.start(now)
        this.sceneMusicOscs.push(osc)
      })
      this.playWarDrumsLoop()
    } else {
      // Scene 5 / Grand Ayodhya: Celestial joyful fanfare
      const base = [130.81, 196.0, 261.63, 329.63, 392.0]
      base.forEach(freq => {
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now)
        g.gain.value = 0.2
        osc.connect(g)
        g.connect(this.sceneMusicGain)
        osc.start(now)
        this.sceneMusicOscs.push(osc)
      })
      this.playTempleBell(1.0)
    }
  }

  stopSceneTheme() {
    if (!this.ctx || this.sceneMusicOscs.length === 0) return
    const now = this.ctx.currentTime
    if (this.sceneMusicGain) {
      this.sceneMusicGain.gain.linearRampToValueAtTime(0.001, now + 0.8)
    }
    const oldOscs = [...this.sceneMusicOscs]
    this.sceneMusicOscs = []
    setTimeout(() => {
      oldOscs.forEach(osc => {
        try { osc.stop() } catch (_) { }
      })
    }, 900)
  }

  // ========================================================
  // SPECIALIZED SCENE SFX
  // ========================================================
  playThunder() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // Low frequency rumble
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 2.5)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(250, now)
    filter.frequency.exponentialRampToValueAtTime(60, now + 2.5)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 2.5)
  }

  playArrowWhoosh() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.4)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  playWarDrumsLoop() {
    if (this.isMuted) return
    const hits = [0, 0.25, 0.5, 0.75, 1.0, 1.25]
    hits.forEach(t => {
      setTimeout(() => {
        this.playDrumHit()
      }, t * 1000)
    })
  }

  playDrumHit() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35)

    gain.gain.setValueAtTime(0.45, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  playChimes() {
    if (this.isMuted) return
    const pitches = [1.2, 1.5, 1.8, 2.0, 2.4]
    pitches.forEach((p, idx) => {
      setTimeout(() => {
        this.playTempleBell(p)
      }, idx * 120)
    })
  }

  // ========================================================
  // ULTRA-REALISTIC PATTAKAS AUDIO SYNTHESIS
  // ========================================================

  // Burning Fuse Sizzle (Cord sparkling sizzle)
  playFuseSizzle(duration = 2.0) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Intermittent tiny snap pulses
      data[i] = Math.random() > 0.85 ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 0.1 - 0.05)
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(4200, now)
    filter.Q.value = 5.0

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.linearRampToValueAtTime(0.25, now + duration * 0.8)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // Ladi Cracker Burst (Rapid staccato pop-pop-crack-pop)
  playLadiBurst(count = 16, intervalMs = 65) {
    if (this.isMuted) return
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.playSingleCrackerPop(i === count - 1)
      }, i * intervalMs + (Math.random() * 20 - 10))
    }
  }

  // Single small cracker pop
  playSingleCrackerPop(isFinale = false) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const duration = isFinale ? 0.35 : 0.12

    // Sharp initial snap noise
    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03))
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = isFinale ? 800 : 1600

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(isFinale ? 0.6 : 0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    // Thud resonance for cracker body
    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(isFinale ? 180 : 320, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + duration)

    oscGain.gain.setValueAtTime(isFinale ? 0.45 : 0.25, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.connect(oscGain)
    oscGain.connect(this.ctx.destination)

    noise.start(now)
    osc.start(now)
    noise.stop(now + duration)
    osc.stop(now + duration)
  }

  // Sutli / Chocolate Bomb Huge Boom
  playBombBoom() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // 1. Massive deep sub-bass shockwave
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(160, now)
    subOsc.frequency.exponentialRampToValueAtTime(22, now + 1.2)

    subGain.gain.setValueAtTime(0.9, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)

    subOsc.connect(subGain)
    subGain.connect(this.ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 1.4)

    // 2. Deafening explosion transient noise
    const duration = 1.0
    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15))
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2400, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + duration)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.85, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // Phuljhadi (Handheld Sparkler) Sizzle
  playPhuljhadi(duration = 3.0) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.7 ? 0.7 : 0.1)
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(4500, now)
    filter.Q.value = 3.0

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.5)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // ========================================================
  // SACRED SHANKH & TEMPLE BELLS
  // ========================================================
  playShankh() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 4.2

    const fundamentalFreq = 220
    const harmonics = [1, 2, 3, 4, 5, 6]
    const gains = [0.45, 0.38, 0.28, 0.18, 0.09, 0.04]

    const masterGain = this.ctx.createGain()
    masterGain.gain.setValueAtTime(0.001, now)
    masterGain.gain.exponentialRampToValueAtTime(0.55, now + 1.2)
    masterGain.gain.setValueAtTime(0.52, now + 2.6)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    masterGain.connect(this.ctx.destination)

    harmonics.forEach((h, index) => {
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()
      osc.type = index % 2 === 0 ? 'sine' : 'triangle'

      osc.frequency.setValueAtTime(fundamentalFreq * h * 0.96, now)
      osc.frequency.exponentialRampToValueAtTime(fundamentalFreq * h * 1.05, now + 0.8)
      osc.frequency.setValueAtTime(fundamentalFreq * h * 1.02, now + 2.5)
      osc.frequency.exponentialRampToValueAtTime(fundamentalFreq * h * 0.98, now + duration)

      oscGain.gain.value = gains[index]
      osc.connect(oscGain)
      oscGain.connect(masterGain)

      osc.start(now)
      osc.stop(now + duration)
    })
  }

  playTempleBell(pitchOffset = 1.0) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 2.8
    const baseFreq = 880 * pitchOffset

    const bellFrequencies = [
      baseFreq * 0.5,
      baseFreq * 1.0,
      baseFreq * 1.2,
      baseFreq * 1.5,
      baseFreq * 2.0,
      baseFreq * 2.7,
      baseFreq * 3.8
    ]

    const bellDecays = [2.4, 2.2, 1.9, 1.5, 1.2, 0.8, 0.5]
    const bellAmps = [0.22, 0.45, 0.28, 0.2, 0.15, 0.09, 0.05]

    bellFrequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(bellAmps[idx] * 0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + bellDecays[idx])

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + bellDecays[idx])
    })
  }

  // Rocket Launch Whoosh
  playRocketLaunch() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 1.4

    const bufferSize = this.ctx.sampleRate * duration
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(350, now)
    filter.frequency.exponentialRampToValueAtTime(3200, now + duration)
    filter.Q.value = 4.5

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.3)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // Aerial Explosion
  playExplosion(type = 'grand') {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 1. Deep Boom
    const boomOsc = this.ctx.createOscillator()
    const boomGain = this.ctx.createGain()

    boomOsc.type = 'sine'
    const startFreq = type === 'grand' ? 140 : 180
    boomOsc.frequency.setValueAtTime(startFreq, now)
    boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.7)

    boomGain.gain.setValueAtTime(type === 'grand' ? 0.65 : 0.45, now)
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95)

    boomOsc.connect(boomGain)
    boomGain.connect(this.ctx.destination)
    boomOsc.start(now)
    boomOsc.stop(now + 0.95)

    // 2. High crackle
    const crackleLen = type === 'grand' ? 1.8 : 0.9
    const bufferSize = Math.floor(this.ctx.sampleRate * crackleLen)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const spike = Math.random() > 0.91 ? (Math.random() * 2 - 1) : (Math.random() * 0.1 - 0.05)
      data[i] = spike
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1200, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.4, now + 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + crackleLen)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + crackleLen)
  }

    // Anaar Fountain Sizzle & Realistic Crackles
    playAnaarSizzle(duration = 4.5) {
      if (this.isMuted) return
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const bufferSize = Math.floor(this.ctx.sampleRate * duration)
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        // Dynamic white noise with intermittent crackling micro-bursts
        const crackle = Math.random() > 0.91 ? (Math.random() * 2 - 1) * 0.95 : (Math.random() * 2 - 1) * 0.42
        data[i] = crackle
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(3200, now)
      filter.frequency.linearRampToValueAtTime(4600, now + duration * 0.4)
      filter.frequency.linearRampToValueAtTime(3000, now + duration)
      filter.Q.value = 2.4

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.42, now + 0.6)
      gain.gain.linearRampToValueAtTime(0.38, now + duration * 0.75)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(now)
      noise.stop(now + duration)
    }

    // Chakri Whir
    playChakriWhir(duration = 3.2) {
      if (this.isMuted) return
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.7)
      osc.frequency.linearRampToValueAtTime(580, now + duration * 0.7)
      osc.frequency.exponentialRampToValueAtTime(100, now + duration)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1800

      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.26, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + duration)
    }

    // Ambient Drone (Om / Tanpura)
    startAmbientDrone() {
      if (this.isAmbientPlaying || this.isMuted) return
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.001, now)
      this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 3.0)
      this.ambientGain.connect(this.ctx.destination)

      const droneFreqs = [138.59, 207.65, 277.18, 415.3]

      droneFreqs.forEach((freq) => {
        const osc = this.ctx.createOscillator()
        const oscGain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq

        const lfo = this.ctx.createOscillator()
        const lfoGain = this.ctx.createGain()
        lfo.frequency.value = 0.2 + Math.random() * 0.3
        lfoGain.gain.value = 1.5
        lfo.connect(osc.frequency)
        lfo.start(now)

        oscGain.gain.value = 0.25
        osc.connect(oscGain)
        oscGain.connect(this.ambientGain)
        osc.start(now)
        this.ambientOscillators.push(osc, lfo)
      })

      this.isAmbientPlaying = true
    }

    stopAmbientDrone() {
      if (!this.isAmbientPlaying || !this.ctx) return
      const now = this.ctx.currentTime
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 1.0)
      }
      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try { osc.stop() } catch (_) { }
        })
        this.ambientOscillators = []
        this.isAmbientPlaying = false
      }, 1100)
    }
  }

  export const soundEngine = new SoundEngine()
