/**
 * Diwali Celebration Realistic Web Audio Engine
 * Features:
 * - Sub-bass explosive shockwave & rolling acoustic resonance
 * - Authentic bronze temple bell with natural inharmonic Bessel partials
 * - Granular noise synthesis for sizzling sparklers & anars
 * - Raag Yaman / Bhupali Indian bamboo flute (Bansuri) with realistic breath vibrato
 * - Tanpura acoustic drone harmonic & festive percussion
 */

class DiwaliAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.currentStep = 0;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.droneGain = null;
    
    // Raag Bhupali & Yaman Pentatonic Scale Frequencies (Sa, Re, Ga, Pa, Dha)
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    
    this.melodyPattern = [
      0, 2, 4, 2,  3, 4, 5, 4,
      5, 7, 6, 5,  4, 3, 2, 0,
      2, 4, 5, 7,  8, 7, 5, 4,
      3, 4, 2, 3,  1, 2, 0, -1
    ];
    
    this.percussionPattern = [
      2, 0, 1, 0,  1, 0, 2, 1,
      2, 0, 1, 1,  1, 0, 2, 0,
      2, 0, 1, 0,  1, 1, 2, 1,
      2, 1, 1, 0,  2, 1, 2, 0
    ];

    try {
      const savedMute = localStorage.getItem('diwali_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {}
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
    this.musicGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.startTanpuraDrone();
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

  // Meditative Indian Tanpura Drone (Sa-Pa fundamental harmonics)
  startTanpuraDrone() {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;

    const droneFreqs = [130.81, 196.00]; // Low C3 and G3
    droneFreqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2.2, now);

      osc.connect(filter);
      filter.connect(this.droneGain);
      osc.start(now);
    });
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

    const tempoBpm = 108;
    const stepDuration = 60 / tempoBpm / 2;

    const noteIdx = this.melodyPattern[this.currentStep % this.melodyPattern.length];
    const percType = this.percussionPattern[this.currentStep % this.percussionPattern.length];

    if (noteIdx >= 0 && !this.isMuted) {
      this.playFluteNote(this.scale[noteIdx % this.scale.length], stepDuration * 1.6);
      if (this.currentStep % 8 === 0) {
        this.playSitarPluck(this.scale[0] / 2, stepDuration * 3.8);
      }
    }

    if (percType > 0 && !this.isMuted) {
      this.playFestiveDrum(percType === 2);
    }

    this.currentStep++;
    this.musicTimer = setTimeout(() => this.scheduleNextBeat(), stepDuration * 1000);
  }

  // Realistic Indian Bamboo Flute (Bansuri) with gentle vibrato and breathiness
  playFluteNote(freq, duration) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const noteGain = this.ctx.createGain();

    // 5.2Hz natural finger vibrato
    vibrato.frequency.setValueAtTime(5.2, now);
    vibratoGain.gain.setValueAtTime(4.5, now);
    vibrato.connect(osc.frequency);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.24, now + 0.045);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.musicGain);

    vibrato.start(now);
    osc.start(now);

    vibrato.stop(now + duration);
    osc.stop(now + duration);
  }

  playSitarPluck(freq, duration) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.8, now);
    filter.Q.setValueAtTime(4.5, now);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  playFestiveDrum(isAccent) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = isAccent ? 190 : 135;
    const endFreq = isAccent ? 55 : 42;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.1);

    gain.gain.setValueAtTime(isAccent ? 0.3 : 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Sacred Bronze Temple Bell (Ghanti) with Inharmonic Partial Frequencies
  playDiyaChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const partials = [
      { f: 1560, decay: 2.8, vol: 0.25 },
      { f: 2340, decay: 2.2, vol: 0.18 },
      { f: 3120, decay: 1.6, vol: 0.12 },
      { f: 4680, decay: 1.0, vol: 0.08 }
    ];

    partials.forEach((p) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now);

      gain.gain.setValueAtTime(p.vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  }

  // Realistic Rocket Launch Whistle
  playRocketLaunch(xRatio = 0.5) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.55);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.16);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.56);

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

  // Realistic Firework Explosion with Deep Sub-bass Shockwave & Crackle Tail
  playFireworkBurst(size = 'medium') {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Sub-bass Acoustic Shockwave (40Hz to 28Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.42);

    const burstVol = size === 'large' ? 0.45 : 0.28;
    subGain.gain.setValueAtTime(burstVol, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);

    subOsc.start(now);
    subOsc.stop(now + 0.52);

    // 2. Granular Noise Crackle Burst
    this.playNoiseCrackle(size === 'large' ? 0.45 : 0.28);
  }

  playNoiseCrackle(duration = 0.3) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.18) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      } else {
        data[i] = 0;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1900, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // Chakri whirring sizzle
  playChakriSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(850, now + 0.4);
    osc.frequency.linearRampToValueAtTime(260, now + 1.2);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  // Mascot Giggle Arpeggio
  playMascotGiggle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50];
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

  playSweetBounce() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.22);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }
}

window.diwaliAudio = new DiwaliAudioEngine();
