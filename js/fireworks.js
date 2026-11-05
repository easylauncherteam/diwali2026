/**
 * Diwali Celebration Realistic Pyrotechnics & Particle Engine
 * Features:
 * - Optical Bloom & Additive Blending (globalCompositeOperation = 'lighter')
 * - Real-world atmospheric drag, gravity, and terminal velocity
 * - Multi-stage fireworks: Chrysanthemums with delay pistils, Willow golden brocades with glittering lingering charcoal trails, Peonies, Heart bursts
 * - Dendritic branching sparks for realistic Sparklers (Phuljhadi)
 * - Authentic Anar (Fountain firecracker) with intense volcanic spray
 * - Authentic Ground Chakri with centrifugal sparks
 * - Volumetric Glowing Sky Lanterns with internal candle flicker
 * - Dynamic scene flash illumination
 * - 60 FPS mobile-optimized particle pooling
 */

class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.rockets = [];
    this.particles = [];
    this.particlePool = [];
    this.maxParticles = window.innerWidth < 600 ? 650 : 1100;
    this.glowSprites = new Map();
    this.lastTimestamp = null;
    this.finaleTimers = new Set();
    this.finaleActive = false;
    this.illuminationTimer = null;
    this.smokeParticles = [];
    this.lanterns = [];
    this.chakris = [];
    this.anars = [];
    this.sweets = [];
    
    // Performance & Accessibility
    this.isReducedMotion = false;
    this.autoLaunchTimer = null;
    this.isPageVisible = !document.hidden;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isReducedMotion = true;
    }
    
    // Photorealistic Pyrotechnic Color Palettes
    this.palettes = {
      goldBrocade: ['#FFE082', '#FFD54F', '#FFCA28', '#FFB300', '#FFA000', '#FFF8E1'],
      crimsonRuby: ['#FF1744', '#FF5252', '#FF8A80', '#D50000', '#FFCDD2'],
      peacockRoyal: ['#00E5FF', '#18FFFF', '#00B0FF', '#76FF03', '#FFD600'],
      festiveFlame: ['#FF3D00', '#FF6E40', '#FF9100', '#FFD600', '#FFFFFF'],
      amethystRose: ['#E040FB', '#EA80FC', '#FF4081', '#FF80AB', '#FFFFFF'],
      emeraldGlow: ['#00E676', '#69F0AE', '#B9F6CA', '#FFEA00', '#FFFFFF']
    };

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      this.lastTimestamp = null;
      if (!this.isPageVisible) {
        this.cancelFinale();
        this.clearIllumination();
      }
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.width < 600 ? 1.5 : 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  setReducedMotion(reduced) {
    if (this.isReducedMotion === reduced) return;
    this.isReducedMotion = reduced;
    this.cancelFinale();
    this.clearIllumination();
    if (reduced) {
      this.rockets.length = 0;
      this.anars.length = 0;
      this.chakris.length = 0;
      this.sweets.length = 0;
      this.lanterns.length = 0;
      while (this.particles.length) this.recycleParticle(this.particles.length - 1);
    }
    if (this.autoLaunchTimer) this.startAutoCelebration();
  }

  // Reuse particle records and bound all particle-producing interactions.
  addParticle(properties) {
    const limit = this.isReducedMotion ? 150 : this.maxParticles;
    if (!this.isPageVisible || this.particles.length >= limit) return;
    const particle = this.particlePool.pop() || {};
    Object.assign(particle, properties);
    if (this.isReducedMotion) {
      const speed = Math.hypot(particle.vx || 0, particle.vy || 0);
      if (speed > 2) {
        particle.vx *= 2 / speed;
        particle.vy *= 2 / speed;
      }
      particle.decay = Math.max(particle.decay, 0.025);
      particle.flicker = false;
      particle.size = Math.min(particle.size, 1.6);
    }
    this.particles.push(particle);
  }

  recycleParticle(index) {
    const particle = this.particles[index];
    this.particles[index] = this.particles[this.particles.length - 1];
    this.particles.pop();
    for (const key of Object.keys(particle)) delete particle[key];
    if (this.particlePool.length < this.maxParticles) this.particlePool.push(particle);
  }

  // Cache tiny optical bloom textures instead of blurring every spark each frame.
  getGlowSprite(color) {
    if (this.glowSprites.has(color)) return this.glowSprites.get(color);
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 48;
    const ctx = sprite.getContext('2d');
    const tint = color.length === 4 ? '#' + [...color.slice(1)].map(c => c + c).join('') : color;
    const gradient = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
    gradient.addColorStop(0, '#fff8e5');
    gradient.addColorStop(0.12, color);
    gradient.addColorStop(0.35, tint + '80');
    gradient.addColorStop(1, tint + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 48, 48);
    if (this.glowSprites.size < 48) this.glowSprites.set(color, sprite);
    return sprite;
  }

  cancelFinale() {
    this.finaleTimers.forEach(timer => clearTimeout(timer));
    this.finaleTimers.clear();
    this.finaleActive = false;
  }

  clearIllumination() {
    clearTimeout(this.illuminationTimer);
    const glow = document.getElementById('sky-glow');
    if (glow) glow.classList.remove('active');
  }

  startAutoCelebration() {
    this.stopAutoCelebration();
    const interval = this.isReducedMotion ? 6000 : 2800;
    this.autoLaunchTimer = setInterval(() => {
      if (this.isPageVisible) {
        this.launchRandomFirework();
      }
    }, interval);
    if (this.isPageVisible) this.launchRandomFirework();
  }

  stopAutoCelebration() {
    if (this.autoLaunchTimer) {
      clearInterval(this.autoLaunchTimer);
      this.autoLaunchTimer = null;
    }
  }

  launchRandomFirework() {
    const x = this.width * (0.2 + Math.random() * 0.6);
    const targetY = this.height * (0.12 + Math.random() * 0.32);
    const types = ['brocade', 'peony', 'chrysanthemum', 'heart', 'ring'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    this.launchRocket(x, targetY, chosenType);
  }

  launchRocket(targetX, targetY, burstType = 'brocade') {
    if (!this.isPageVisible || this.rockets.length >= (this.isReducedMotion ? 3 : 12)) return;
    if (this.isReducedMotion) {
      this.explode(targetX, targetY, 'peony');
      return;
    }
    const startX = targetX + (Math.random() * 60 - 30);
    const startY = this.height + 15;
    
    if (window.diwaliAudio) {
      window.diwaliAudio.playRocketLaunch(targetX / this.width);
    }

    const distY = startY - targetY;
    const vy = -Math.sqrt(2 * 0.24 * distY);
    const flightTime = Math.abs(vy / 0.24);
    const vx = (targetX - startX) / flightTime;

    this.rockets.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      vx: vx,
      vy: vy,
      gravity: 0.24,
      burstType: burstType,
      trail: [],
      hue: Math.floor(Math.random() * 360)
    });
  }

  explode(x, y, type = 'brocade') {
    if (!this.isPageVisible) return;
    if (window.diwaliAudio) {
      window.diwaliAudio.playFireworkBurst(type === 'brocade' ? 'large' : 'medium');
    }

    this.triggerDynamicIllumination(x, y, type);

    const paletteKeys = Object.keys(this.palettes);
    const palette = this.palettes[paletteKeys[Math.floor(Math.random() * paletteKeys.length)]];

    // 1. Imperial Gold Brocade / Willow (Cascading glittering charcoal trails)
    if (type === 'brocade') {
      const count = this.isReducedMotion ? 40 : 100;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.0 + Math.random() * 5.2;
        this.addParticle({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          decay: 0.005 + Math.random() * 0.005, // Long lingering hang-time
          color: '#FFD54F',
          size: 2.2,
          gravity: 0.055,
          airDrag: 0.985,
          trail: [],
          isBrocade: true,
          flicker: Math.random() > 0.3
        });
      }
      this.addCentralCoreFlash(x, y, '#FFF8E1');
      return;
    }

    // 2. Romantic Heart-Shaped Burst
    if (type === 'heart') {
      const count = this.isReducedMotion ? 30 : 75;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.24 + Math.random() * 0.05;
        this.addParticle({
          x: x,
          y: y,
          vx: hx * speed,
          vy: hy * speed,
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.006,
          color: Math.random() > 0.2 ? '#FF1744' : '#FFD54F',
          size: 2.6,
          gravity: 0.038,
          airDrag: 0.98,
          trail: [],
          flicker: true
        });
      }
      this.addCentralCoreFlash(x, y, '#FF8A80');
      return;
    }

    // 3. Chrysanthemum with Delay Crackling Pistils (Dragon's Eggs)
    if (type === 'chrysanthemum') {
      const count = this.isReducedMotion ? 35 : 90;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 5.8;
        const color = palette[Math.floor(Math.random() * palette.length)];
        this.addParticle({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          decay: 0.011 + Math.random() * 0.008,
          color: color,
          size: 2.5,
          gravity: 0.048,
          airDrag: 0.978,
          trail: [],
          flicker: true,
          hasPistil: Math.random() > 0.45,
          pistilTriggered: false
        });
      }
      this.addCentralCoreFlash(x, y, '#FFFFFF');
      return;
    }

    // 4. Concentric Dual Ring Burst
    if (type === 'ring') {
      const count = this.isReducedMotion ? 30 : 70;
      const ringColor1 = palette[0];
      const ringColor2 = palette[2] || '#FFD700';
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 4.2 + (Math.random() * 0.3 - 0.15);
        this.addParticle({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          decay: 0.013 + Math.random() * 0.005,
          color: i % 2 === 0 ? ringColor1 : ringColor2,
          size: 2.8,
          gravity: 0.04,
          airDrag: 0.982,
          trail: []
        });
      }
      return;
    }

    // 5. Peony Spherical Starburst (Multi-color vibrant festival explosion)
    const count = this.isReducedMotion ? 30 : 80;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 5.4;
      const color = palette[Math.floor(Math.random() * palette.length)];
      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        decay: 0.012 + Math.random() * 0.01,
        color: color,
        size: 2.6,
        gravity: 0.05,
        airDrag: 0.976,
        trail: [],
        flicker: Math.random() > 0.35
      });
    }
    this.addCentralCoreFlash(x, y, '#FFFFFF');
  }

  addCentralCoreFlash(x, y, color) {
    if (this.isReducedMotion) return;
    this.addParticle({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      alpha: 1.0,
      decay: 0.12,
      color: color,
      size: 24,
      isCoreFlash: true
    });
  }

  triggerDynamicIllumination(x, y, type) {
    if (this.isReducedMotion) return;
    const glow = document.getElementById('sky-glow');
    if (glow) {
      glow.style.transform = `translate(${x}px, ${y}px)`;
      clearTimeout(this.illuminationTimer);
      glow.style.setProperty('--burst-color', type === 'heart' ? '255, 100, 125' : '255, 192, 92');
      glow.classList.add('active');
      this.illuminationTimer = setTimeout(() => glow.classList.remove('active'), 160);
    }
  }

  addSparkler(x, y) {
    const count = this.isReducedMotion ? 2 : 5;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.2;
      this.addParticle({
        x: x + (Math.random() * 6 - 3),
        y: y + (Math.random() * 6 - 3),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        decay: 0.035 + Math.random() * 0.025,
        color: Math.random() > 0.3 ? '#FFE082' : '#FFFFFF',
        size: 1.6 + Math.random() * 1.2,
        gravity: 0.08,
        airDrag: 0.96,
        trail: [],
        branchTimer: 0,
        canBranch: Math.random() > 0.5
      });
    }
  }

  spawnAnar(x, y) {
    if (!this.isPageVisible || this.anars.length >= 3) return;
    if (window.diwaliAudio) {
      window.diwaliAudio.playChakriSound();
    }
    this.anars.push({
      x: x || this.width * 0.5,
      y: y || this.height - 50,
      life: 1.0,
      decay: 0.007,
      coneSpread: 0.42
    });
  }

  spawnChakri(x, y) {
    if (this.isReducedMotion) {
      this.addSparkler(x ?? this.width * 0.5, y ?? this.height - 60);
      return;
    }
    if (!this.isPageVisible || this.chakris.length >= 3) return;
    if (window.diwaliAudio) {
      window.diwaliAudio.playChakriSound();
    }
    this.chakris.push({
      x: x || this.width * 0.5,
      y: y || this.height - 60,
      angle: 0,
      spinSpeed: 0.52,
      life: 1.0,
      decay: 0.007,
      radius: 12
    });
  }

  spawnLantern(x) {
    if (!this.isPageVisible || this.lanterns.length >= 12) return;
    const startX = x || (this.width * (0.15 + Math.random() * 0.7));
    this.lanterns.push({
      x: startX,
      y: this.isReducedMotion ? this.height * 0.4 : this.height + 45,
      life: 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.65 + Math.random() * 0.4),
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.018 + Math.random() * 0.015,
      tilt: 0,
      scale: 0.85 + Math.random() * 0.35,
      alpha: 0,
      targetAlpha: 0.95,
      flameFlicker: Math.random() * 10
    });
  }

  spawnSweetShower() {
    if (!this.isPageVisible || this.sweets.length >= 56) return;
    if (window.diwaliAudio) {
      window.diwaliAudio.playSweetBounce();
    }
    const sweetTypes = ['laddoo', 'kaju', 'jalebi'];
    const count = this.isReducedMotion ? 6 : 14;

    for (let i = 0; i < count && this.sweets.length < 56; i++) {
      const type = sweetTypes[Math.floor(Math.random() * sweetTypes.length)];
      this.sweets.push({
        x: this.width * (0.1 + Math.random() * 0.8),
        y: this.isReducedMotion ? this.height * (0.25 + Math.random() * 0.25) : -30 - Math.random() * 180,
        vx: (Math.random() - 0.5) * 3.8,
        vy: Math.random() * 2.2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        type: type,
        bounces: 0,
        size: 26 + Math.random() * 8,
        alpha: 1.0
      });
    }
  }

  launchFinale() {
    if (!this.isPageVisible || this.finaleActive) return false;
    this.finaleActive = true;
    const types = ['brocade', 'peony', 'chrysanthemum', 'heart', 'ring'];
    const count = this.isReducedMotion ? 3 : 12;
    for (let i = 0; i < count; i++) {
      const timer = setTimeout(() => {
        this.finaleTimers.delete(timer);
        if (this.isPageVisible) {
          const x = this.width * (0.18 + Math.random() * 0.64);
          const y = this.height * (0.12 + Math.random() * 0.28);
          this.launchRocket(x, y, types[i % types.length]);
        }
      }, i * (this.isReducedMotion ? 900 : 280));
      this.finaleTimers.add(timer);
    }
    const endTimer = setTimeout(() => {
      this.finaleTimers.delete(endTimer);
      this.finaleActive = false;
    }, this.isReducedMotion ? 3200 : 5000);
    this.finaleTimers.add(endTimer);
    return true;
  }

  animate(timestamp) {
    requestAnimationFrame(this.animate);
    if (!this.isPageVisible) return;
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
      return;
    }
    // Frame units at 60 Hz, clamped to avoid a catch-up burst after a stall.
    const dt = Math.min(Math.max((timestamp - this.lastTimestamp) / (1000 / 60), 0), 2);
    this.lastTimestamp = timestamp;
    if (!dt) return;

    // Erase alpha, preserving the atmospheric layers beneath the canvas.
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = `rgba(0, 0, 0, ${1 - Math.pow(0.72, dt)})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over';

    // 1. Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.x += r.vx * dt;
      r.y += r.vy * dt + r.gravity * dt * (dt - 1) / 2;
      r.vy += r.gravity * dt;

      r.trail.push({ x: r.x, y: r.y, alpha: 1.0 });
      if (r.trail.length > 7) r.trail.shift();

      this.ctx.save();
      this.ctx.globalCompositeOperation = 'lighter';
      for (let j = 1; j < r.trail.length; j++) {
        const t = r.trail[j];
        const previous = r.trail[j - 1];
        const ratio = j / r.trail.length;
        this.ctx.strokeStyle = `rgba(255, 203, 126, ${ratio * 0.75})`;
        this.ctx.lineWidth = 0.4 + ratio * 1.8;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(previous.x, previous.y);
        this.ctx.lineTo(t.x, t.y);
        this.ctx.stroke();
      }
      this.ctx.drawImage(this.getGlowSprite('#FFD54F'), r.x - 9, r.y - 9, 18, 18);
      this.ctx.fillStyle = '#FFF7DF';
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 1.4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      if (r.y <= r.targetY || r.vy >= 0) {
        this.explode(r.x, r.y, r.burstType);
        this.rockets.splice(i, 1);
      }
    }

    // 2. Explosion Particles
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.isCoreFlash) {
        this.ctx.globalAlpha = 1;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          this.recycleParticle(i);
          continue;
        }
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * (1.5 - p.alpha));
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(255, 215, 0, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * (1.5 - p.alpha), 0, Math.PI * 2);
        this.ctx.fill();
        continue;
      }

      const drag = p.airDrag ?? 0.98;
      const gravity = p.gravity ?? 0.05;
      const damping = Math.pow(drag, dt);
      const travel = drag === 1 ? dt : (1 - damping) / (1 - drag);
      p.x += p.vx * travel;
      p.y += p.vy * travel + (drag === 1 ? gravity * dt * (dt - 1) / 2 : gravity * (dt - travel) / (1 - drag));
      p.vx *= damping;
      p.vy = p.vy * damping + gravity * travel;
      p.alpha -= p.decay * dt;

      if (p.canBranch && !this.isReducedMotion) {
        p.branchTimer += dt;
        if (p.branchTimer > 6 && Math.random() > 0.6) {
          p.canBranch = false;
          const branchAngle = Math.atan2(p.vy, p.vx) + (Math.random() * 1.2 - 0.6);
          this.addParticle({
            x: p.x,
            y: p.y,
            vx: Math.cos(branchAngle) * 1.5,
            vy: Math.sin(branchAngle) * 1.5,
            alpha: p.alpha * 0.8,
            decay: p.decay * 1.5,
            color: '#FFFFFF',
            size: 1.2,
            gravity: 0.08,
            airDrag: 0.94,
            trail: []
          });
        }
      }

      if (!this.isReducedMotion && p.hasPistil && !p.pistilTriggered && p.alpha < 0.4) {
        p.pistilTriggered = true;
        for (let s = 0; s < 3; s++) {
          const sAngle = Math.random() * Math.PI * 2;
          this.addParticle({
            x: p.x,
            y: p.y,
            vx: Math.cos(sAngle) * 1.8,
            vy: Math.sin(sAngle) * 1.8,
            alpha: 0.9,
            decay: 0.05,
            color: '#FFFFFF',
            size: 1.5,
            gravity: 0.06,
            airDrag: 0.95,
            trail: []
          });
        }
      }

      if (p.isBrocade && p.trail) {
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 5) p.trail.shift();
      }

      if (p.alpha <= 0) {
        this.recycleParticle(i);
        continue;
      }

      let renderAlpha = p.alpha;
      if (p.flicker) {
        renderAlpha *= 0.65 + 0.35 * Math.sin(timestamp * 0.012 + p.x);
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, renderAlpha);
      const glowSize = p.size * 7;
      this.ctx.drawImage(this.getGlowSprite(p.color), p.x - glowSize / 2, p.y - glowSize / 2, glowSize, glowSize);

      if (p.isBrocade && p.trail && p.trail.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          this.ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        this.ctx.strokeStyle = '#ffcf72';
        this.ctx.lineWidth = Math.max(0.5, p.size * p.alpha);
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
      } else {
        this.ctx.globalAlpha = Math.max(0, renderAlpha);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.ctx.restore();

    // 3. Anar (Fountain)
    for (let i = this.anars.length - 1; i >= 0; i--) {
      const a = this.anars[i];
      a.life -= a.decay * dt;

      if (a.life <= 0) {
        this.anars.splice(i, 1);
        continue;
      }

      a.emission = (a.emission || 0) + (this.isReducedMotion ? 1 : 6) * dt;
      const sparkCount = Math.floor(a.emission);
      a.emission -= sparkCount;
      for (let s = 0; s < sparkCount; s++) {
        const spread = (Math.random() - 0.5) * a.coneSpread * 2;
        const speed = 4.5 + Math.random() * 7.5 * a.life;
        this.addParticle({
          x: a.x + (Math.random() * 8 - 4),
          y: a.y,
          vx: spread * 2.2,
          vy: -speed,
          alpha: 1.0,
          decay: 0.028,
          color: Math.random() > 0.3 ? '#FFF59D' : '#FF7043',
          size: 2.2,
          gravity: 0.22,
          airDrag: 0.98,
          flicker: true
        });
      }
    }

    // 4. Ground Chakri
    for (let i = this.chakris.length - 1; i >= 0; i--) {
      const c = this.chakris[i];
      c.angle += c.spinSpeed * dt;
      c.life -= c.decay * dt;

      if (c.life <= 0) {
        this.chakris.splice(i, 1);
        continue;
      }

      c.emission = (c.emission || 0) + (this.isReducedMotion ? 1 : 5) * dt;
      const sparkCount = Math.floor(c.emission);
      c.emission -= sparkCount;
      for (let s = 0; s < sparkCount; s++) {
        const sparkAngle = c.angle + (s * (Math.PI * 2 / sparkCount));
        const speed = 2.8 + Math.random() * 4.2;
        this.addParticle({
          x: c.x,
          y: c.y,
          vx: Math.cos(sparkAngle) * speed,
          vy: Math.sin(sparkAngle) * speed * 0.7,
          alpha: 1.0,
          decay: 0.04,
          color: Math.random() > 0.3 ? '#FFE082' : '#FF5722',
          size: 2.0,
          gravity: 0.04,
          airDrag: 0.96
        });
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.scale(1, 0.45);
      this.ctx.rotate(c.angle);
      this.ctx.fillStyle = '#FF5722';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 14 * c.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFD54F';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 6 * c.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 5. Sky Lanterns
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      if (this.isReducedMotion) {
        l.life -= 0.008 * dt;
      } else {
        l.sway += l.swaySpeed * dt;
        l.tilt = Math.sin(l.sway) * 0.08;
        l.x += (l.vx + Math.sin(l.sway) * 0.35) * dt;
        l.y += l.vy * dt;
        l.flameFlicker += 0.15 * dt;
      }

      l.alpha = Math.min(l.targetAlpha, l.alpha + 0.02 * dt);

      if (l.y < -90 || l.life <= 0) {
        this.lanterns.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = l.alpha * l.life;
      this.ctx.translate(l.x, l.y);
      this.ctx.rotate(l.tilt);
      this.ctx.scale(l.scale, l.scale);

      const halo = this.ctx.createRadialGradient(0, 0, 2, 0, 0, 36);
      halo.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
      halo.addColorStop(0.4, 'rgba(255, 120, 20, 0.3)');
      halo.addColorStop(1, 'rgba(255, 100, 0, 0)');
      this.ctx.fillStyle = halo;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 36, 0, Math.PI * 2);
      this.ctx.fill();

      const paperGrad = this.ctx.createLinearGradient(-17, 0, 17, 0);
      paperGrad.addColorStop(0, '#92351d');
      paperGrad.addColorStop(0.25, '#f18c40');
      paperGrad.addColorStop(0.5, '#ffe2a0');
      paperGrad.addColorStop(0.75, '#ee8b3d');
      paperGrad.addColorStop(1, '#92351d');
      this.ctx.fillStyle = paperGrad;

      this.ctx.beginPath();
      this.ctx.moveTo(-13, 16);
      this.ctx.quadraticCurveTo(-20, -7, -15, -15);
      this.ctx.quadraticCurveTo(0, -20, 15, -15);
      this.ctx.quadraticCurveTo(20, -7, 13, 16);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.strokeStyle = 'rgba(255, 236, 179, 0.7)';
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();

      this.ctx.strokeStyle = 'rgba(105, 42, 18, 0.28)';
      this.ctx.lineWidth = 0.7;
      for (let rib = -8; rib <= 8; rib += 8) {
        this.ctx.beginPath();
        this.ctx.moveTo(rib, -13);
        this.ctx.quadraticCurveTo(rib * 1.3, 0, rib * 0.8, 15);
        this.ctx.stroke();
      }
      const flameOffset = Math.sin(l.flameFlicker) * 1.0;
      this.ctx.fillStyle = '#FFFDE7';
      this.ctx.shadowColor = '#FFE082';
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(flameOffset, 7, 3.2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    // 6. Sweets
    for (let i = this.sweets.length - 1; i >= 0; i--) {
      const s = this.sweets[i];
      if (this.isReducedMotion) {
        s.alpha -= 0.015 * dt;
      } else {
        s.x += s.vx * dt;
        s.rot += s.rotSpeed * dt;
        // Integrate collisions in bounded substeps so floor contact does not jitter.
        const steps = Math.ceil(dt);
        const step = dt / steps;
        const floorY = this.height - 40;
        for (let collisionStep = 0; collisionStep < steps; collisionStep++) {
          if (s.settled) break;
          s.y += s.vy * step + 0.21 * step * step;
          s.vy += 0.42 * step;
          if (s.y >= floorY && s.vy > 0) {
            s.y = floorY;
            s.vy = -s.vy * 0.65;
            s.vx *= 0.82;
            s.bounces++;
            if (Math.abs(s.vy) < 0.8 || s.bounces > 4) {
              s.settled = true;
              s.vy = 0;
              s.rotSpeed = 0;
            }
          }
        }
        if (s.bounces > 4 || s.settled) s.alpha -= 0.025 * dt;
      }

      if (s.alpha <= 0 || s.x < -60 || s.x > this.width + 60) {
        this.sweets.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.translate(s.x, s.y);
      this.ctx.rotate((s.rot * Math.PI) / 180);

      if (s.type === 'laddoo') {
        const grad = this.ctx.createRadialGradient(-3, -3, 2, 0, 0, s.size * 0.5);
        grad.addColorStop(0, '#FFE082');
        grad.addColorStop(0.6, '#FFA000');
        grad.addColorStop(1, '#D84315');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Small, deterministic motichoor grains give the sweet a tangible surface.
        this.ctx.fillStyle = 'rgba(129, 60, 10, 0.3)';
        for (let grain = 0; grain < 13; grain++) {
          const angle = grain * 2.39996;
          const radius = Math.sqrt((grain + 0.5) / 13) * s.size * 0.43;
          this.ctx.beginPath();
          this.ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.9, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.fillStyle = '#7CB342';
        this.ctx.beginPath();
        this.ctx.arc(-4, -2, 2.2, 0, Math.PI * 2);
        this.ctx.arc(5, 3, 2.0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.ctx.beginPath();
        this.ctx.arc(-2, -4, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (s.type === 'kaju') {
        this.ctx.fillStyle = '#FAFAFA';
        this.ctx.strokeStyle = '#CFD8DC';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s.size * 0.5);
        this.ctx.lineTo(s.size * 0.45, 0);
        this.ctx.lineTo(0, s.size * 0.5);
        this.ctx.lineTo(-s.size * 0.45, 0);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#ECEFF1';
        this.ctx.beginPath();
        this.ctx.arc(-3, -3, 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.strokeStyle = '#FF6D00';
        this.ctx.lineWidth = 4.5;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size * 0.4, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size * 0.2, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }
  }
}

window.ParticleEngine = ParticleEngine;
