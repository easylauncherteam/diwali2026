/**
 * Diwali Celebration Mascot Characters Engine: "Golu & Mithoo"
 * Cute, funny, expressive 3D-styled cartoon characters celebrating Diwali.
 * Features:
 * - Dynamic eye-tracking cursor/touch
 * - Physics spring bounce & spin animations
 * - Interactive tap reactions (giggles, backflips, rocket launches, laddoo tossing)
 * - Synchronized festive dance to the music beat
 * - Contextual speech bubbles with warm & funny Diwali messages
 */

class MascotManager {
  constructor(engine) {
    this.engine = engine;
    this.goluEl = document.getElementById('character-golu');
    this.mithooEl = document.getElementById('character-mithoo');
    this.bubbleGolu = document.getElementById('bubble-golu');
    this.bubbleMithoo = document.getElementById('bubble-mithoo');
    
    this.isDancing = false;
    this.speechTimer = null;
    this.lastSpeechMascot = null;

    this.goluQuotes = [
      "Happy Diwali! May your life be as sweet as motichoor laddoo! 🪔✨",
      "Pass the kaju katli please, I promise zero calories! 😋🍬",
      "Tap the sky to launch magical fireworks! 🎆",
      "Light all 5 sacred diyas for a grand surprise! ✨",
      "Wishing you abundant health, wealth and joy! 💛",
      "Wooohoo! Look at those sparks fly! 🎇"
    ];

    this.mithooQuotes = [
      "BADA DHAMAKA incoming! Tap me for rockets! 🚀💥",
      "Spreading joy, light, and happy vibes everywhere! 🪔",
      "Whoosh! Let's brighten up the entire universe! 🌌✨",
      "Did somebody say celebration? Let's dance! 💃🕺",
      "May Goddess Lakshmi bless your home today and always! 🌸",
      "Phuljhadi power activated! 💥✨"
    ];

    this.initInteractions();
    this.initEyeTracking();
    this.startAmbientDialogue();
  }

  initInteractions() {
    if (this.goluEl) {
      this.goluEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.reactGolu();
      });
      this.goluEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.reactGolu();
        }
      });
    }

    if (this.mithooEl) {
      this.mithooEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.reactMithoo();
      });
      this.mithooEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.reactMithoo();
        }
      });
    }
  }

  // Smooth eye tracking towards pointer/touch
  initEyeTracking() {
    const updatePupils = (clientX, clientY) => {
      const pupils = document.querySelectorAll('.mascot-pupil');
      pupils.forEach(pupil => {
        const eye = pupil.parentElement;
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = clientX - eyeCenterX;
        const deltaY = clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const maxDist = 3.5; // Maximum pupil travel in px
        const dist = Math.min(maxDist, Math.hypot(deltaX, deltaY) / 35);

        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;

        pupil.style.transform = `translate(${px}px, ${py}px)`;
      });
    };

    window.addEventListener('pointermove', (e) => {
      updatePupils(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updatePupils(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Golu Reaction: Physics bounce flip, giggle sound, laddoo burst, speech
  reactGolu() {
    if (window.diwaliAudio) {
      window.diwaliAudio.playMascotGiggle();
    }

    this.goluEl.classList.remove('bounce-action');
    void this.goluEl.offsetWidth; // Reflow
    this.goluEl.classList.add('bounce-action');

    // Spawn 2-3 bouncing sweets
    if (this.engine) {
      const rect = this.goluEl.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.engine.sweets.push({
            x: x + (Math.random() * 40 - 20),
            y: rect.top - 10,
            vx: (Math.random() - 0.5) * 5,
            vy: -(6 + Math.random() * 4), // Pops up out of Golu!
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            type: 'laddoo',
            bounces: 0,
            size: 26,
            alpha: 1
          });
        }, i * 100);
      }
    }

    const randomQuote = this.goluQuotes[Math.floor(Math.random() * this.goluQuotes.length)];
    this.showSpeech(this.bubbleGolu, randomQuote);
  }

  // Mithoo Reaction: 360 spin, rocket launch into sky, dialogue
  reactMithoo() {
    if (window.diwaliAudio) {
      window.diwaliAudio.playMascotGiggle();
    }

    this.mithooEl.classList.remove('spin-action');
    void this.mithooEl.offsetWidth;
    this.mithooEl.classList.add('spin-action');

    // Launch a rocket straight from Mithoo's position up into the sky!
    if (this.engine) {
      const rect = this.mithooEl.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = window.innerHeight * 0.22;
      this.engine.launchRocket(targetX, targetY, 'heart');
    }

    const randomQuote = this.mithooQuotes[Math.floor(Math.random() * this.mithooQuotes.length)];
    this.showSpeech(this.bubbleMithoo, randomQuote);
  }

  showSpeech(bubbleEl, text) {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.add('visible');

    if (bubbleEl._hideTimer) {
      clearTimeout(bubbleEl._hideTimer);
    }

    bubbleEl._hideTimer = setTimeout(() => {
      bubbleEl.classList.remove('visible');
    }, 4200);
  }

  startAmbientDialogue() {
    // Mascots occasionally say something cute if user is idle
    setInterval(() => {
      if (document.hidden) return;
      // 50% chance each 14 seconds
      if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
          const q = this.goluQuotes[Math.floor(Math.random() * this.goluQuotes.length)];
          this.showSpeech(this.bubbleGolu, q);
        } else {
          const q = this.mithooQuotes[Math.floor(Math.random() * this.mithooQuotes.length)];
          this.showSpeech(this.bubbleMithoo, q);
        }
      }
    }, 14000);
  }

  toggleDance() {
    this.isDancing = !this.isDancing;
    if (this.isDancing) {
      this.goluEl.classList.add('dancing');
      this.mithooEl.classList.add('dancing');
      this.showSpeech(this.bubbleGolu, "Bhangra time! Let's celebrate together! 💃");
    } else {
      this.goluEl.classList.remove('dancing');
      this.mithooEl.classList.remove('dancing');
    }
    return this.isDancing;
  }
}

window.MascotManager = MascotManager;

