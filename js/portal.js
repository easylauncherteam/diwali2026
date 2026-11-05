/**
 * Diwali 2026 Showcase Portal - Client Logic
 * Ambient celestial embers, copy actions, and social sharing.
 * Zero-dependency, modern vanilla JavaScript.
 */

(function () {
  'use strict';

  // --- Ambient Embers Canvas ---
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const PARTICLE_COUNT = prefersReducedMotion ? 20 : 65;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    class EmberParticle {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        this.x = Math.random() * width;
        this.y = isInitial ? Math.random() * height : height + Math.random() * 20;
        this.size = Math.random() * 2.2 + 0.8;
        this.baseAlpha = Math.random() * 0.6 + 0.2;
        this.alpha = this.baseAlpha;
        this.vy = -(Math.random() * 0.7 + 0.3);
        this.vx = (Math.random() - 0.5) * 0.4;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
        // Warm golden / amber festive hue palette
        const hues = [42, 48, 38, 32];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.twinklePhase += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.25;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${Math.max(0, this.alpha)})`;
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`;
        ctx.fill();
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new EmberParticle(true));
      }
    }

    function renderLoop() {
      ctx.clearRect(0, 0, width, height);

      // Reset shadow before drawing
      ctx.shadowBlur = 0;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        renderLoop();
      }
    });

    initParticles();
    renderLoop();
  }

  // --- Toast Notification System ---
  const toast = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // --- Clipboard Copy Actions ---
  document.querySelectorAll('[data-copy-url]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = button.getAttribute('data-copy-url');
      const author = button.getAttribute('data-author') || 'Diwali Site';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast(`✨ Copied link for ${author}!`);
      } catch (err) {
        showToast(`🔗 Link: ${url}`);
      }
    });
  });

  // --- Share Main Showcase Portal ---
  const shareBtn = document.getElementById('share-portal-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Happy Diwali 2026 - Easy Launcher Team Showcase',
        text: 'Explore Diwali wishes and interactive experiences created by the Easy Launcher team! 🪔✨',
        url: window.location.href.split('#')[0]
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User dismissed or aborted share
        }
      } else {
        // Fallback: Copy current portal URL
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareData.url);
          showToast('✨ Portal link copied to clipboard!');
        }
      }
    });
  }

})();

