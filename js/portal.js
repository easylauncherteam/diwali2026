/**
 * Diwali 2026 Showcase Portal
 * Minimal, Elegant & Bilingual (English / Hindi)
 * Zero-dependency, modern vanilla JavaScript
 */

(function () {
  'use strict';

  // --- Bilingual Content Dictionary ---
  const i18n = {
    en: {
      docTitle: 'Diwali 2026 Wishes & Celebration Showcase | EasyLauncher',
      navBrandTag: 'Enterprise AI',
      heroPill: 'EasyLauncher Team Showcase',
      heroTitle: 'Festival of Lights',
      heroSubtitle: 'A curated showcase of festive greetings, creative experiments, and joyful Diwali celebrations crafted by our team.',
      shivanshRole: 'Ayodhya 3D Mahotsav',
      shivanshTitle: '🏛️ Grand Ayodhya Celebration',
      shivanshDesc: 'Cinematic 3D celebration of Lord Shri Ram’s return — sacred Saryu river lights, glowing temple spires, and night fireworks.',
      shivamRole: 'Pyrotechnics & 3D Mascots',
      shivamTitle: '🎆 Interactive Festive Carnival',
      shivamDesc: '60 FPS multi-stage pyrotechnic fireworks, cute 3D mascots (Golu & Mithoo), procedural Indian flute & tabla, and diya lighting.',
      harshRole: 'Golden Radiance & Blessings',
      harshTitle: '✨ Sacred Lights & Warmth',
      harshDesc: 'Tranquil celebration illuminated by a sacred diya, ambient twinkling sparkles, and heartfelt blessings for peace and prosperity.',
      riteshRole: 'Festive Greetings',
      riteshTitle: '🪔 Joyful Deepavali Greetings',
      riteshDesc: 'Celebration of light and togetherness, spreading heartfelt wishes for health, happiness, and prosperity for the season.',
      btnExplore: 'Explore Experience',
      brandDesc: 'Enterprise AI Solutions & Bespoke Software Engineering. We architect secure, scalable platforms that perform.',
      btnBrand: 'Visit easylauncher.net',
      quote: '“May the radiant glow of diyas illuminate your life with wisdom, health, peace, and endless prosperity.”',
      quoteAuthor: '— EasyLauncher Engineering Team',
      footerCraft: 'Crafted with festive devotion by the team at',
      copySuccess: '✨ Copied link for {name}!'
    },
    hi: {
      docTitle: 'दीपावली २०२६ | उत्सव एवं शुभकामनाएँ | EasyLauncher',
      navBrandTag: 'एंटरप्राइज AI',
      heroPill: 'EasyLauncher टीम दीपोत्सव',
      heroTitle: 'शुभ दीपावली २०२६',
      heroSubtitle: 'हमारी इंजीनियरिंग टीम द्वारा निर्मित इंटरएक्टिव दीपावली शुभकामनाएँ एवं डिजिटल अनुभवों का पावन संकलन।',
      shivanshRole: 'भव्य अयोध्या ३D महोत्सव',
      shivanshTitle: '🏛️ भव्य अयोध्या दीपोत्सव',
      shivanshDesc: 'प्रभु श्री राम के अयोध्या आगमन का भव्य ३D उत्सव — पावन सरयू तट, मंदिर शिखर और दीपों की अनुपम जगमगाहट।',
      shivamRole: 'आतिशबाजी व ३D शुभंकर',
      shivamTitle: '🎆 इंटरएक्टिव आतिशबाजी व उत्सव',
      shivamDesc: '६० FPS आतिशबाजी, गोलू व मीठू ३D शुभंकर, शास्त्रीय बाँसुरी व तबला संगीत और पावन दीप प्रज्ज्वलन।',
      harshRole: 'स्वर्णिम प्रभा व शुभकामनाएँ',
      harshTitle: '✨ पावन दीप व स्वर्णिम आभा',
      harshDesc: 'पावन दीप की स्वर्णिम ज्योति, टिमटिमाते सितारे और सपरिवार सुख, शांति व समृद्धि की हार्दिक मंगलकामनाएँ।',
      riteshRole: 'दीपावली मंगलकामनाएँ',
      riteshTitle: '🪔 पावन दीपोत्सव संदेश',
      riteshDesc: 'प्रकाश पर्व पर एकता और उल्लास का प्रतीक — स्वास्थ्य, सुख और समृद्धि की असीम शुभकामनाएँ।',
      btnExplore: 'अनुभव देखें',
      brandDesc: 'एंटरप्राइज AI समाधान एवं कस्टम सॉफ्टवेयर इंजीनियरिंग। सुरक्षित एवं तीव्र प्लेटफॉर्म निर्माण।',
      btnBrand: 'easylauncher.net देखें',
      quote: '“दीपों का यह पावन प्रकाश आपके जीवन को ज्ञान, उत्तम स्वास्थ्य, शांति और समृद्धि से आलोकित करे।”',
      quoteAuthor: '— EasyLauncher इंजीनियरिंग टीम',
      footerCraft: 'EasyLauncher टीम द्वारा सप्रेम निर्मित',
      copySuccess: '✨ {name} की वेबसाइट लिंक कॉपी हो गई!'
    }
  };

  let currentLang = 'en';

  function applyLanguage(lang) {
    if (!i18n[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update document title
    document.title = i18n[lang].docTitle;

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });

    // Update active class on language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    try {
      localStorage.setItem('preferred_lang', lang);
    } catch (e) {}
  }

  // Bind language toggle clicks
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });

  // Restore saved language or detect browser preference
  try {
    const saved = localStorage.getItem('preferred_lang');
    if (saved && (saved === 'en' || saved === 'hi')) {
      applyLanguage(saved);
    } else {
      const navLang = (navigator.language || '').toLowerCase();
      if (navLang.startsWith('hi')) {
        applyLanguage('hi');
      }
    }
  } catch (e) {}

  // --- Ambient Embers Canvas (Lightweight & Smooth) ---
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const PARTICLE_COUNT = prefersReducedMotion ? 18 : 50;

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
        this.size = Math.random() * 2 + 0.8;
        this.baseAlpha = Math.random() * 0.5 + 0.2;
        this.alpha = this.baseAlpha;
        this.vy = -(Math.random() * 0.6 + 0.25);
        this.vx = (Math.random() - 0.5) * 0.35;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.025 + 0.01;
        this.hue = Math.random() > 0.3 ? 42 : 36;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.speed;
        this.alpha = this.baseAlpha + Math.sin(this.phase) * 0.2;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 95%, 68%, ${Math.max(0, this.alpha)})`;
        ctx.shadowBlur = this.size * 2.5;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.75)`;
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
      ctx.shadowBlur = 0;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    window.addEventListener('resize', resizeCanvas);

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

  // --- Toast Notification ---
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2600);
  }

  // --- Copy Link Actions ---
  document.querySelectorAll('[data-copy-url]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-copy-url');
      const author = btn.getAttribute('data-author') || 'Website';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const tmpl = i18n[currentLang]?.copySuccess || '✨ Copied link for {name}!';
        showToast(tmpl.replace('{name}', author));
      } catch (err) {
        showToast(`🔗 ${url}`);
      }
    });
  });

})();
