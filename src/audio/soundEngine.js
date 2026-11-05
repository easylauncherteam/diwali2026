// Procedural Web Audio API Sound Synthesizer for Diwali Ayodhya Experience
// Works 100% offline, zero external file dependencies, high performance.

class SoundEngine {
  constructor() {
    this.ctx = null
    this.isMuted = false
    this.isAmbientPlaying = false
    this.ambientGain = null
    this.ambientOscillators = []
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
    return this.isMuted
  }

  // Sacred Shankhnaad (Conch Shell sound with resonant harmonics)
  playShankh() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 3.8

    // Fundamental frequency around 220Hz (A3), with vibrato and natural swell
    const fundamentalFreq = 220
    const harmonics = [1, 2, 3, 4, 5, 6]
    const gains = [0.4, 0.35, 0.25, 0.15, 0.08, 0.04]

    const masterGain = this.ctx.createGain()
    masterGain.gain.setValueAtTime(0.001, now)
    // Swell attack, sustain, and gentle release
    masterGain.gain.exponentialRampToValueAtTime(0.5, now + 1.2)
    masterGain.gain.setValueAtTime(0.48, now + 2.4)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    masterGain.connect(this.ctx.destination)

    harmonics.forEach((h, index) => {
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()
      osc.type = index % 2 === 0 ? 'sine' : 'triangle'

      // Pitch glide like a traditional conch blower increasing breath pressure
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

  // Divine Temple Bell (Bronze Ghanti with pure metallic shimmer)
  playTempleBell(pitchOffset = 1.0) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 2.5
    const baseFreq = 880 * pitchOffset // A5

    // Inharmonic bell spectrum
    const bellFrequencies = [
      baseFreq * 0.5, // hum
      baseFreq * 1.0, // prime
      baseFreq * 1.2, // tierce
      baseFreq * 1.5, // quint
      baseFreq * 2.0, // nominal
      baseFreq * 2.7, // supernominal
      baseFreq * 3.8
    ]

    const bellDecays = [2.2, 2.0, 1.8, 1.4, 1.2, 0.8, 0.5]
    const bellAmps = [0.2, 0.4, 0.25, 0.18, 0.15, 0.08, 0.05]

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

  // Firework Launch Rocket Whoosh
  playRocketLaunch() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 1.2

    // Noise buffer for hiss
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
    filter.frequency.setValueAtTime(400, now)
    filter.frequency.exponentialRampToValueAtTime(2800, now + duration)
    filter.Q.value = 4.0

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // Firework Aerial Explosion (Low sub rumble + high sparkle crackle)
  playExplosion(type = 'grand') {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 1. Deep Boom (Sub Bass Oscillator)
    const boomOsc = this.ctx.createOscillator()
    const boomGain = this.ctx.createGain()

    boomOsc.type = 'sine'
    const startFreq = type === 'grand' ? 140 : 180
    boomOsc.frequency.setValueAtTime(startFreq, now)
    boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.6)

    boomGain.gain.setValueAtTime(type === 'grand' ? 0.6 : 0.4, now)
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)

    boomOsc.connect(boomGain)
    boomGain.connect(this.ctx.destination)
    boomOsc.start(now)
    boomOsc.stop(now + 0.9)

    // 2. High frequency crackle burst
    const crackleLen = type === 'grand' ? 1.6 : 0.8
    const bufferSize = Math.floor(this.ctx.sampleRate * crackleLen)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Sporadic crackle spikes
      const spike = Math.random() > 0.92 ? (Math.random() * 2 - 1) : (Math.random() * 0.1 - 0.05)
      data[i] = spike
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1200, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.35, now + 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + crackleLen)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + crackleLen)
  }

  // Sparkling Anaar / Fountain Sizzle
  playAnaarSizzle() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 2.5

    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.8
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3200, now)
    filter.Q.value = 2.0

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4)
    gain.gain.linearRampToValueAtTime(0.28, now + 1.8)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // Chakri Spinning Whir and Sparks
  playChakriWhir() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const duration = 2.8

    // Rotating pitch oscillator
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.6)
    osc.frequency.linearRampToValueAtTime(520, now + 2.0)
    osc.frequency.exponentialRampToValueAtTime(100, now + duration)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1600

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.22, now + 0.4)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + duration)
  }

  // Devotional Festive Ambient Drone (Tanpura & Om Drone)
  startAmbientDrone() {
    if (this.isAmbientPlaying || this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0.001, now)
    this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 3.0)
    this.ambientGain.connect(this.ctx.destination)

    // Tanpura Sa & Pa chords (C# tonic: ~138.59Hz, 207.65Hz, 277.18Hz)
    const droneFreqs = [138.59, 207.65, 277.18, 415.3]

    droneFreqs.forEach((freq) => {
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq

      // Subtle LFO modulation for warm shimmer
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
        try {
          osc.stop()
        } catch (_) {}
      })
      this.ambientOscillators = []
      this.isAmbientPlaying = false
    }, 1100)
  }
}

export const soundEngine = new SoundEngine()

