/**
 * Diwali Celebration Web Audio Engine
 * 100% procedural Web Audio synthesizer - zero external audio dependencies.
 * Provides authentic festive Indian melody, temple bells, fireworks, and mascot sounds.
 */

class DiwaliAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Muted by default to respect user & browser autoplay policies
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.currentStep = 0;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    
    // Raag Yaman / Bhupali inspired festive pentatonic scale frequencies (Sa, Re, Ga, Pa, Dha)
    // C4, D4, E4, G4, A4, C5, D5, E5, G5
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    
    // 32-step uplifting festive melody sequence
    this.melodyPattern = [
      0, 2, 4, 2,  3, 4, 5, 4,
      5, 7, 6, 5,  4, 3, 2, 0,
      2, 4, 5, 7,  8, 7, 5, 4,
      3, 4, 2, 3,  1, 2, 0, -1
    ];
    
    // Rhythm pattern for festive dholak/tabla percussion (1 = hit, 2 = accent, 0 = rest)
    this.percussionPattern = [
      2, 0, 1, 0,  1, 0, 2, 1,
      2, 0, 1, 1,  1, 0, 2, 0,
      2, 0, 1, 0,  1, 1, 2, 1,
      2, 1, 1, 0,  2, 1, 2, 0
    ];

    // Load saved mute preference if available
    try {
      const savedMute = localStorage.getItem('diwali_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {
      // Ignore storage errors in private browsing
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    try {
      localStorage.setItem('diwali_muted', muted ? 'true' : 'false');
    } catch (e) {}

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.85, now + 0.15);
    }

    if (!muted) {
      this.ensureContext();
      if (!this.isMusicPlaying) {
        this.startMusic();
      }
    }
    return this.isMuted;
  }

  toggleMute() {
    return this.setMuted(!this.isMuted);
  }

  startMusic() {
    this.ensureContext();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.currentStep = 0;
    this.scheduleNextBeat();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  scheduleNextBeat() {
    if (!this.isMusicPlaying || !this.ctx) return;

    const tempoBpm = 108; // Energetic joyful festive tempo
    const stepDuration = 60 / tempoBpm / 2; // 8th note duration (~0.138s)

    const noteIdx = this.melodyPattern[this.currentStep % this.melodyPattern.length];
    const percType = this.percussionPattern[this.currentStep % this.percussionPattern.length];

    if (noteIdx >= 0 && !this.isMuted) {
      this.playFluteNote(this.scale[noteIdx % this.scale.length], stepDuration * 1.5);
      // Add subtle sitar drone harmonic on accents
      if (this.currentStep % 8 === 0) {
        this.playSitarPluck(this.scale[0] / 2, stepDuration * 3.5);
      }
    }

    if (percType > 0 && !this.isMuted) {
      this.playFestiveDrum(percType === 2);
    }

    this.currentStep++;
    this.musicTimer = setTimeout(() => this.scheduleNextBeat(), stepDuration * 1000);
  }

  // Soft bamboo flute / bansuri style tone with gentle breath vibrato
  playFluteNote(freq, duration) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const noteGain = this.ctx.createGain();

    // Gentle vibrato at 5Hz
    vibrato.frequency.setValueAtTime(5.2, now);
    vibratoGain.gain.setValueAtTime(4.0, now);
    vibrato.connect(osc.frequency);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.22, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.musicGain);

    vibrato.start(now);
    osc.start(now);

    vibrato.stop(now + duration);
    osc.stop(now + duration);
  }

  // Plucked string / sitar resonance
  playSitarPluck(freq, duration) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.5, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Festive Dholak / Tabla rhythm beat
  playFestiveDrum(isAccent) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Pitch sweep drum tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = isAccent ? 180 : 130;
    const endFreq = isAccent ? 60 : 45;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.09);

    gain.gain.setValueAtTime(isAccent ? 0.28 : 0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sacred Temple Bell (Ghanti) Chime for lighting diyas
  playDiyaChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Twin harmonic frequencies for authentic brass bell chime
    const freqs = [1560, 2340, 3120];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      const amp = 0.2 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 2.4);
    });
  }

  // Rocket ascending launch sound with whistle
  playRocketLaunch(xRatio = 0.5) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.55);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.55);

    if (panner) {
      panner.pan.setValueAtTime((xRatio - 0.5) * 1.5, now);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.sfxGain);
    } else {
      osc.connect(gain);
      gain.connect(this.sfxGain);
    }

    osc.start(now);
    osc.stop(now + 0.58);
  }

  // Deep boom & crackle explosion for firework bursts
  playFireworkBurst(size = 'medium') {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Deep low rumble boom
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    const burstVol = size === 'large' ? 0.35 : 0.22;
    subGain.gain.setValueAtTime(burstVol, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);

    subOsc.start(now);
    subOsc.stop(now + 0.5);

    // 2. Crackle noise burst
    this.playNoiseCrackle(size === 'large' ? 0.4 : 0.25);
  }

  playNoiseCrackle(duration = 0.3) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle spikes
      if (Math.random() < 0.15) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      } else {
        data[i] = 0;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // Chakri (spinning ground wheel) whirring sound
  playChakriSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.4);
    osc.frequency.linearRampToValueAtTime(250, now + 1.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  // Cartoon mascot giggle / chirpy boing sound when tapped
  playMascotGiggle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // Quick cheerful upward arpeggio
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.14);
    });
  }

  // Sweet bounce / boing sound for laddoo drops
  playSweetBounce() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.24);
  }
}

// Global audio engine instance
window.diwaliAudio = new DiwaliAudioEngine();

