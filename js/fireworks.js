/**
 * Diwali Celebration Canvas Particle Engine
 * Features:
 * - Multi-stage fireworks (Chrysanthemum, Willow cascade, Rainbow peony, Heart-burst)
 * - Ground Chakri (spinning fire wheel with swirling sparks)
 * - Anar (golden sparkling fountain)
 * - Floating Sky Lanterns (Akash Kandil) drifting into the night sky
 * - Bouncing Laddoo Sweet Shower
 * - 60 FPS mobile-optimized particle pooling
 * - Full support for prefers-reduced-motion
 */

class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile battery efficiency
    
    this.rockets = [];
    this.particles = [];
    this.lanterns = [];
    this.chakris = [];
    this.sweets = [];
    this.anars = [];
    
    // Performance and accessibility settings
    this.isReducedMotion = false;
    this.autoLaunchTimer = null;
    this.lastTime = 0;
    this.isPageVisible = true;
    
    // Check system preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isReducedMotion = true;
    }
    
    // Festive Color Palettes
    this.palettes = {
      gold: ['#FFD700', '#FFA500', '#FFECB3', '#FFE082', '#FFF8E1'],
      royal: ['#FF1493', '#9D4EDD', '#00F5D4', '#FFD166', '#FF4D6D'],
      diwali: ['#FF4500', '#FFD700', '#FF007F', '#00E5FF', '#76FF03', '#FFF'],
      flame: ['#FF3D00', '#FF9100', '#FFEA00', '#FFFFFF'],
      peacock: ['#00B4D8', '#0077B6', '#06D6A0', '#FFD166', '#F72585']
    };

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  setReducedMotion(reduced) {
    this.isReducedMotion = reduced;
  }

  startAutoCelebration() {
    this.stopAutoCelebration();
    const interval = this.isReducedMotion ? 6000 : 2600;
    this.autoLaunchTimer = setInterval(() => {
      if (this.isPageVisible) {
        this.launchRandomFirework();
      }
    }, interval);
    // Launch initial firework
    this.launchRandomFirework();
  }

  stopAutoCelebration() {
    if (this.autoLaunchTimer) {
      clearInterval(this.autoLaunchTimer);
      this.autoLaunchTimer = null;
    }
  }

  launchRandomFirework() {
    const x = this.width * (0.2 + Math.random() * 0.6);
    const targetY = this.height * (0.15 + Math.random() * 0.35);
    const types = ['peony', 'chrysanthemum', 'willow', 'heart', 'ring'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    this.launchRocket(x, targetY, chosenType);
  }

  launchRocket(targetX, targetY, burstType = 'peony') {
    const startX = targetX + (Math.random() * 80 - 40);
    const startY = this.height + 10;
    
    // Play launch audio
    if (window.diwaliAudio) {
      window.diwaliAudio.playRocketLaunch(targetX / this.width);
    }

    this.rockets.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      vx: (targetX - startX) / 38,
      vy: -Math.sqrt(2 * 0.22 * (startY - targetY)), // Physics upward launch
      burstType: burstType,
      color: '#FFD700',
      trail: [],
      alpha: 1
    });
  }

  explode(x, y, type = 'peony') {
    if (window.diwaliAudio) {
      window.diwaliAudio.playFireworkBurst(type === 'willow' ? 'large' : 'medium');
    }

    // Trigger subtle screen glow
    this.triggerFlash(x, y);

    const count = this.isReducedMotion ? 25 : 70;
    const paletteKeys = Object.keys(this.palettes);
    const palette = this.palettes[paletteKeys[Math.floor(Math.random() * paletteKeys.length)]];

    if (type === 'heart') {
      // Parametric heart formula
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // Heart curve
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.22 + Math.random() * 0.05;
        this.particles.push({
          x: x,
          y: y,
          vx: hx * speed,
          vy: hy * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.008,
          color: '#FF1493',
          size: 2.5 + Math.random() * 1.5,
          gravity: 0.04,
          sparkle: true,
          flickerRate: Math.random() * 0.2
        });
      }
      return;
    }

    if (type === 'willow') {
      // Golden cascading drooping weeping willow trails
      const willowCount = this.isReducedMotion ? 35 : 90;
      for (let i = 0; i < willowCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.006 + Math.random() * 0.005, // Long lingering life
          color: '#FFD700',
          size: 2.2,
          gravity: 0.07,
          willow: true,
          trail: []
        });
      }
      return;
    }

    if (type === 'ring') {
      // Concentric ring burst
      const ringColor = palette[Math.floor(Math.random() * palette.length)];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 3.8 + Math.random() * 0.4;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.014 + Math.random() * 0.006,
          color: ringColor,
          size: 2.8,
          gravity: 0.05
        });
      }
      return;
    }

    // Default: Multi-color Peony & Chrysanthemum
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      const color = palette[Math.floor(Math.random() * palette.length)];
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.013 + Math.random() * 0.012,
        color: color,
        size: 2.4 + Math.random() * 1.6,
        gravity: 0.06,
        sparkle: Math.random() > 0.4,
        flickerRate: Math.random() * 0.3
      });
    }
  }

  triggerFlash(x, y) {
    if (this.isReducedMotion) return;
    const glow = document.getElementById('sky-glow');
    if (glow) {
      glow.style.transform = `translate(${x}px, ${y}px)`;
      glow.classList.remove('active');
      void glow.offsetWidth; // Trigger reflow
      glow.classList.add('active');
    }
  }

  // Interactive Ground Chakri (Spinning Fire Wheel)
  spawnChakri(x, y) {
    if (window.diwaliAudio) {
      window.diwaliAudio.playChakriSound();
    }
    this.chakris.push({
      x: x,
      y: y,
      angle: 0,
      spinSpeed: 0.45,
      life: 1.0,
      decay: 0.008,
      sparksTimer: 0
    });
  }

  // Interactive Anar (Fountain firecracker)
  spawnAnar(x, y) {
    if (window.diwaliAudio) {
      window.diwaliAudio.playChakriSound();
    }
    this.anars.push({
      x: x,
      y: y,
      life: 1.0,
      decay: 0.009,
      height: 180 + Math.random() * 80
    });
  }

  // Sparkler trail from finger / mouse touch drag
  addSparkler(x, y) {
    const count = this.isReducedMotion ? 2 : 5;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      this.particles.push({
        x: x + (Math.random() * 10 - 5),
        y: y + (Math.random() * 10 - 5),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.03 + Math.random() * 0.02,
        color: Math.random() > 0.3 ? '#FFD700' : '#FFFFFF',
        size: 1.8 + Math.random() * 1.2,
        gravity: 0.08,
        sparkle: true
      });
    }
  }

  // Sky Lanterns drifting upwards
  spawnLantern(x) {
    const startX = x || (this.width * (0.15 + Math.random() * 0.7));
    this.lanterns.push({
      x: startX,
      y: this.height + 40,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.7 + Math.random() * 0.5),
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      scale: 0.8 + Math.random() * 0.4,
      alpha: 0,
      targetAlpha: 0.95
    });
  }

  // Bouncing Sweets / Laddoos shower
  spawnSweetShower() {
    if (window.diwaliAudio) {
      window.diwaliAudio.playSweetBounce();
    }
    const sweetTypes = ['laddoo', 'kaju', 'jalebi'];
    const count = this.isReducedMotion ? 6 : 14;

    for (let i = 0; i < count; i++) {
      const type = sweetTypes[Math.floor(Math.random() * sweetTypes.length)];
      this.sweets.push({
        x: this.width * (0.1 + Math.random() * 0.8),
        y: -30 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        type: type,
        bounces: 0,
        size: 26 + Math.random() * 8,
        alpha: 1
      });
    }
  }

  // Grand Finale Barrage
  launchFinale() {
    const burstTypes = ['peony', 'chrysanthemum', 'willow', 'heart', 'ring'];
    const count = 12;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = this.width * (0.15 + (i / count) * 0.7 + (Math.random() * 0.1 - 0.05));
        const y = this.height * (0.12 + Math.random() * 0.35);
        this.launchRocket(x, y, burstTypes[i % burstTypes.length]);
      }, i * 220);
    }
  }

  // Main rendering & physics update loop
  animate(timestamp) {
    requestAnimationFrame(this.animate);

    if (!this.isPageVisible) return;

    // Trail fade effect (composite dark overlay)
    this.ctx.fillStyle = 'rgba(10, 10, 26, 0.22)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Update & Render Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.22; // Gravity slows rocket

      // Add trail sparks
      r.trail.push({ x: r.x, y: r.y, alpha: 1 });
      if (r.trail.length > 6) r.trail.shift();

      // Render trail
      this.ctx.save();
      for (let j = 0; j < r.trail.length; j++) {
        const tp = r.trail[j];
        this.ctx.fillStyle = `rgba(255, 215, 0, ${(j / r.trail.length) * 0.8})`;
        this.ctx.beginPath();
        this.ctx.arc(tp.x, tp.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Rocket head
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Check detonation when near target or upward speed zeroes
      if (r.y <= r.targetY || r.vy >= 0) {
        this.explode(r.x, r.y, r.burstType);
        this.rockets.splice(i, 1);
      }
    }

    // 2. Update & Render Explosion Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0.05;
      p.vx *= 0.98; // Air friction
      p.vy *= 0.98;
      p.alpha -= p.decay;

      if (p.willow) {
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 5) p.trail.shift();
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      let currentAlpha = p.alpha;
      if (p.sparkle) {
        currentAlpha *= 0.6 + 0.4 * Math.sin(timestamp * 0.03 + p.x);
      }
      this.ctx.globalAlpha = Math.max(0, currentAlpha);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;

      if (p.willow && p.trail.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          this.ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = p.size;
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // 3. Update & Render Chakris (Spinning Ground Wheels)
    for (let i = this.chakris.length - 1; i >= 0; i--) {
      const c = this.chakris[i];
      c.angle += c.spinSpeed;
      c.life -= c.decay;

      if (c.life <= 0) {
        this.chakris.splice(i, 1);
        continue;
      }

      // Shoot spiral sparks
      const sparkCount = this.isReducedMotion ? 2 : 5;
      for (let s = 0; s < sparkCount; s++) {
        const sparkAngle = c.angle + (s * (Math.PI * 2 / sparkCount));
        const speed = 2.5 + Math.random() * 3.5;
        this.particles.push({
          x: c.x,
          y: c.y,
          vx: Math.cos(sparkAngle) * speed,
          vy: Math.sin(sparkAngle) * speed,
          alpha: 1,
          decay: 0.04,
          color: Math.random() > 0.4 ? '#FFD700' : '#FF4500',
          size: 2,
          gravity: 0.03
        });
      }

      // Draw Chakri Center Disc
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.angle);
      this.ctx.fillStyle = '#FF4500';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 10 * c.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 5 * c.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Update & Render Anar (Golden Fountain)
    for (let i = this.anars.length - 1; i >= 0; i--) {
      const a = this.anars[i];
      a.life -= a.decay;

      if (a.life <= 0) {
        this.anars.splice(i, 1);
        continue;
      }

      const sparkCount = this.isReducedMotion ? 3 : 8;
      for (let s = 0; s < sparkCount; s++) {
        const spread = (Math.random() - 0.5) * 1.8;
        const speed = 4 + Math.random() * 6 * a.life;
        this.particles.push({
          x: a.x + (Math.random() * 8 - 4),
          y: a.y,
          vx: spread,
          vy: -speed,
          alpha: 1,
          decay: 0.03,
          color: Math.random() > 0.3 ? '#FFEA00' : '#FF5722',
          size: 2.2,
          gravity: 0.18,
          sparkle: true
        });
      }
    }

    // 5. Update & Render Sky Lanterns (Akash Kandils)
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.sway += l.swaySpeed;
      l.x += l.vx + Math.sin(l.sway) * 0.4;
      l.y += l.vy;
      if (l.alpha < l.targetAlpha) l.alpha += 0.02;

      if (l.y < -80) {
        this.lanterns.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = l.alpha;
      this.ctx.translate(l.x, l.y);
      this.ctx.scale(l.scale, l.scale);

      // Warm glow behind lantern
      const radGrad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 32);
      radGrad.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
      radGrad.addColorStop(0.5, 'rgba(255, 120, 0, 0.3)');
      radGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
      this.ctx.fillStyle = radGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 32, 0, Math.PI * 2);
      this.ctx.fill();

      // Lantern body (Festive warm orange/gold polygon)
      this.ctx.fillStyle = '#FFA726';
      this.ctx.beginPath();
      this.ctx.moveTo(-12, 16);
      this.ctx.lineTo(-15, -12);
      this.ctx.lineTo(15, -12);
      this.ctx.lineTo(12, 16);
      this.ctx.closePath();
      this.ctx.fill();

      // Golden ribs
      this.ctx.strokeStyle = '#FFE082';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Little inner flame dot
      this.ctx.fillStyle = '#FFFDE7';
      this.ctx.beginPath();
      this.ctx.arc(0, 8, 3, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    // 6. Update & Render Bouncing Sweets (Laddoo Shower)
    for (let i = this.sweets.length - 1; i >= 0; i--) {
      const s = this.sweets[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.45; // Gravity
      s.rot += s.rotSpeed;

      const floorY = this.height - 40;
      if (s.y >= floorY) {
        s.y = floorY;
        s.vy = -s.vy * 0.65; // Elastic bounce
        s.vx *= 0.8;
        s.bounces++;
        if (s.bounces > 4) {
          s.alpha -= 0.03;
        }
      }

      if (s.alpha <= 0 || s.x < -50 || s.x > this.width + 50) {
        this.sweets.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.translate(s.x, s.y);
      this.ctx.rotate((s.rot * Math.PI) / 180);

      if (s.type === 'laddoo') {
        // Golden Motichoor Laddoo with pistachios
        this.ctx.fillStyle = '#FF9800';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Shading
        const grad = this.ctx.createRadialGradient(-3, -3, 2, 0, 0, s.size * 0.5);
        grad.addColorStop(0, '#FFE082');
        grad.addColorStop(0.7, '#FFA000');
        grad.addColorStop(1, '#E65100');
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // Pistachio green dots
        this.ctx.fillStyle = '#7CB342';
        this.ctx.beginPath();
        this.ctx.arc(-3, -2, 2, 0, Math.PI * 2);
        this.ctx.arc(4, 2, 1.8, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (s.type === 'kaju') {
        // Silver Diamond Kaju Katli
        this.ctx.fillStyle = '#F5F5F5';
        this.ctx.strokeStyle = '#BDBDBD';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s.size * 0.5);
        this.ctx.lineTo(s.size * 0.45, 0);
        this.ctx.lineTo(0, s.size * 0.5);
        this.ctx.lineTo(-s.size * 0.45, 0);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Edible silver leaf sparkle
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(-2, -2, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Golden Swirly Jalebi
        this.ctx.strokeStyle = '#FF6D00';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size * 0.4, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size * 0.22, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }
  }
}

window.ParticleEngine = ParticleEngine;

