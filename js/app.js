/**
 * Diwali Celebration Main Application Controller
 * Handles personalization, DIYA lighting experience, sharing engine, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas & Particle Engine
  const canvas = document.getElementById('fireworks-canvas');
  const engine = new ParticleEngine(canvas);
  window.particleEngine = engine;

  // 2. Initialize Mascot Manager
  const mascots = new MascotManager(engine);
  window.mascotManager = mascots;

  // 3. Audio & Auto-Celebration Setup
  let userInteracted = false;
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundStatusText = document.getElementById('sound-status');
  const floatingMusicPill = document.getElementById('floating-music-pill');

  function updateSoundUI() {
    const isMuted = window.diwaliAudio.isMuted;
    if (soundToggleBtn) {
      soundToggleBtn.setAttribute('aria-pressed', (!isMuted).toString());
      soundToggleBtn.classList.toggle('playing', !isMuted);
    }
    if (soundStatusText) {
      soundStatusText.textContent = isMuted ? 'Muted' : 'Playing';
    }
    if (floatingMusicPill) {
      floatingMusicPill.classList.toggle('hidden', !isMuted);
    }
  }

  function handleFirstInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      window.diwaliAudio.hasUserGesture = true;
      window.diwaliAudio.ensureContext();
      if (!window.diwaliAudio.isMuted) window.diwaliAudio.setMuted(false);
    }
  }

  window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true, capture: true });
  window.addEventListener('keydown', handleFirstInteraction, { once: true, capture: true });

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      handleFirstInteraction();
      const isMuted = window.diwaliAudio.toggleMute();
      updateSoundUI();
    });
  }

  if (floatingMusicPill) {
    floatingMusicPill.addEventListener('click', () => {
      handleFirstInteraction();
      window.diwaliAudio.setMuted(false);
      updateSoundUI();
    });
  }

  updateSoundUI();
  engine.startAutoCelebration();

  // 4. Motion / Performance Controls
  const motionToggleBtn = document.getElementById('motion-toggle');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manualMotion = null;
  function applyMotionPreference() {
    const isReduced = manualMotion ?? motionPreference.matches;
    engine.setReducedMotion(isReduced);
    document.body.classList.toggle('reduced-motion-mode', isReduced);
    document.body.dataset.motion = isReduced ? 'reduce' : 'full';
    if (motionToggleBtn) {
      motionToggleBtn.setAttribute('aria-pressed', String(isReduced));
      motionToggleBtn.classList.toggle('calm-mode', isReduced);
      const label = motionToggleBtn.querySelector('.btn-label');
      if (label) label.textContent = isReduced ? 'Calm Mode' : 'Full Magic';
    }
    if (isReduced) mascots.setDancing(false);
    const danceButton = document.getElementById('btn-action-dance');
    if (danceButton) {
      danceButton.classList.toggle('active', mascots.isDancing);
      danceButton.setAttribute('aria-pressed', String(mascots.isDancing));
    }
  }
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', () => {
      manualMotion = !engine.isReducedMotion;
      applyMotionPreference();
    });
  }
  motionPreference.addEventListener('change', applyMotionPreference);
  applyMotionPreference();

  // 5. Canvas Touch & Sky Interactions
  let activePointer = null;
  let pointerPosition = null;
  let sparkFrame = null;
  function drawPointerSpark() {
    sparkFrame = null;
    if (activePointer !== null && pointerPosition) {
      engine.addSparkler(pointerPosition.x, pointerPosition.y);
    }
  }
  function stopDrawing() {
    activePointer = null;
    pointerPosition = null;
    if (sparkFrame !== null) cancelAnimationFrame(sparkFrame);
    sparkFrame = null;
  }
  canvas.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary || e.button !== 0) return;
    activePointer = e.pointerId;
    handleFirstInteraction();
    pointerPosition = { x: e.clientX, y: e.clientY };
    engine.addSparkler(e.clientX, e.clientY);
  });
  window.addEventListener('pointermove', (e) => {
    if (activePointer !== e.pointerId) return;
    pointerPosition = { x: e.clientX, y: e.clientY };
    if (sparkFrame === null) sparkFrame = requestAnimationFrame(drawPointerSpark);
  }, { passive: true });
  window.addEventListener('pointerup', (e) => {
    if (activePointer !== e.pointerId) return;
    if (e.clientY < window.innerHeight * 0.75) engine.launchRocket(e.clientX, e.clientY, 'peony');
    stopDrawing();
  });
  window.addEventListener('pointercancel', stopDrawing);
  window.addEventListener('blur', stopDrawing);
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-hidden', document.hidden);
    if (document.hidden) stopDrawing();
  });

  // 6. Action Toolbar Buttons
  const btnFirework = document.getElementById('btn-action-firework');
  if (btnFirework) {
    btnFirework.addEventListener('click', () => {
      handleFirstInteraction();
      engine.launchRandomFirework();
    });
  }

  const btnLantern = document.getElementById('btn-action-lantern');
  if (btnLantern) {
    btnLantern.addEventListener('click', () => {
      handleFirstInteraction();
      engine.spawnLantern();
    });
  }

  const btnSweets = document.getElementById('btn-action-sweets');
  if (btnSweets) {
    btnSweets.addEventListener('click', () => {
      handleFirstInteraction();
      engine.spawnSweetShower();
    });
  }

  const btnDance = document.getElementById('btn-action-dance');
  if (btnDance) {
    btnDance.addEventListener('click', () => {
      handleFirstInteraction();
      const dancing = mascots.toggleDance();
      btnDance.classList.toggle('active', dancing);
      btnDance.setAttribute('aria-pressed', String(dancing));
    });
  }

  const btnFinale = document.getElementById('btn-action-finale');
  if (btnFinale) {
    btnFinale.addEventListener('click', () => {
      handleFirstInteraction();
      triggerGrandAartiCelebration(false);
    });
  }

  // 7. Personalization via URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const recipientName = urlParams.get('to') || urlParams.get('name') || '';
  const senderName = urlParams.get('from') || '';
  const customMessage = urlParams.get('msg') || '';
  const styleParam = urlParams.get('theme') || urlParams.get('style') || '1';

  const greetingTitleEl = document.getElementById('greeting-title');
  const greetingSubtitleEl = document.getElementById('greeting-subtitle');
  const greetingSenderEl = document.getElementById('greeting-sender');

  if (recipientName && senderName) {
    greetingTitleEl.innerHTML = `Shubh Deepavali, <span class="recipient-highlight">${escapeHTML(recipientName)}</span>! <span class="title-ornament" aria-hidden="true">🪔✨</span>`;
    greetingSubtitleEl.textContent = customMessage || getWishPresetMessage(styleParam);
    greetingSenderEl.innerHTML = `With heartfelt blessings from <strong>${escapeHTML(senderName)}</strong>`;
    greetingSenderEl.classList.remove('hidden');
  } else if (recipientName) {
    greetingTitleEl.innerHTML = `Shubh Deepavali, <span class="recipient-highlight">${escapeHTML(recipientName)}</span>! <span class="title-ornament" aria-hidden="true">🪔✨</span>`;
    greetingSubtitleEl.textContent = customMessage || getWishPresetMessage(styleParam);
    greetingSenderEl.classList.add('hidden');
  } else {
    greetingTitleEl.innerHTML = `Happy Diwali! <span class="title-ornament" aria-hidden="true">🪔✨</span>`;
    greetingSubtitleEl.textContent = customMessage || "May the divine glow of lights illuminate your life with boundless peace, health, success, and joyful moments with your loved ones.";
    greetingSenderEl.classList.add('hidden');
  }

  // 8. 5 Sacred Diyas Lighting Experience
  const diyas = document.querySelectorAll('.interactive-diya');
  const diyaCountEl = document.getElementById('diyas-lit-count');
  const diyaStatusMessage = document.getElementById('diya-status-message');
  let litDiyasCount = 0;
  let celebrationHideTimer;

  const blessings = [
    { title: "Arogya", desc: "Radiant Health & Vitality 🌿" },
    { title: "Samriddhi", desc: "Abundant Wealth & Prosperity 💰" },
    { title: "Ananda", desc: "Joy, Laughter & Celebration 🎉" },
    { title: "Prem", desc: "Love, Harmony & Sweetness 💖" },
    { title: "Shanti", desc: "Peace & Spiritual Radiance 🕊️" }
  ];

  diyas.forEach((diya, index) => {
    diya.addEventListener('click', () => {
      if (diya.classList.contains('is-lit')) return;
      handleFirstInteraction();
      lightDiya(diya, index);
    });

    diya.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !diya.classList.contains('is-lit')) {
        e.preventDefault();
        handleFirstInteraction();
        lightDiya(diya, index);
      }
    });
  });

  function lightDiya(diya, index) {
    diya.classList.add('is-lit');
    diya.setAttribute('aria-checked', 'true');
    diya.setAttribute('aria-label', diya.getAttribute('aria-label').replace(/^Light /, 'Lit '));
    litDiyasCount++;

    // Audio chime
    if (window.diwaliAudio) {
      window.diwaliAudio.playDiyaChime();
    }

    // Spawn sparks at diya position
    const rect = diya.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    for (let i = 0; i < (engine.isReducedMotion ? 4 : 15); i++) {
      engine.addParticle({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: -(2 + Math.random() * 3),
        alpha: 1,
        decay: 0.02,
        color: '#FFD700',
        size: 2.5,
        gravity: 0.04,
        sparkle: true
      });
    }

    document.body.style.setProperty('--diya-warmth', String(litDiyasCount / 5));

    // Display floating blessing badge
    const blessing = blessings[index % blessings.length];
    showFloatingBlessing(x, y, blessing);

    // Update count UI
    if (diyaCountEl) {
      diyaCountEl.textContent = `${litDiyasCount}/5`;
    }

    if (litDiyasCount === 5) {
      // All diyas lit celebration!
      setTimeout(() => {
        triggerGrandAartiCelebration();
      }, 700);
    } else {
      if (diyaStatusMessage) {
        diyaStatusMessage.textContent = `Lit diya for ${blessing.title}! Light all 5 for the Maha Aarti celebration.`;
      }
    }
  }

  function showFloatingBlessing(x, y, blessing) {
    document.querySelectorAll('.floating-blessing').forEach(badge => badge.remove());
    const badge = document.createElement('div');
    badge.className = 'floating-blessing';
    badge.setAttribute('role', 'status');
    badge.innerHTML = `<strong>${blessing.title}</strong><span>${blessing.desc}</span>`;
    badge.style.left = `${Math.max(120, Math.min(window.innerWidth - 120, x))}px`;
    badge.style.top = `${y}px`;
    document.body.appendChild(badge);

    setTimeout(() => {
      badge.remove();
    }, 2800);
  }

  function triggerGrandAartiCelebration(allLit = true) {
    if (diyaStatusMessage && allLit) {
      diyaStatusMessage.textContent = "🌟 Maha Deepavali Blessing Unlocked! All Diyas Glowing! 🌟";
    }

    const startedFinale = engine.launchFinale();
    if (!startedFinale && !allLit) return;

    // Trigger grand fireworks
    mascots.setDancing(!engine.isReducedMotion);
    if (btnDance) {
      btnDance.classList.toggle('active', mascots.isDancing);
      btnDance.setAttribute('aria-pressed', String(mascots.isDancing));
    }
    if (startedFinale) engine.spawnSweetShower();

    // Show celebration banner
    const celebrationCard = document.getElementById('maha-celebration-toast');
    if (celebrationCard) {
      celebrationCard.textContent = allLit ? '🪔 All five diyas glowing. May your year shine bright!' : '✨ A sky full of light. A heart full of joy. Happy Diwali!';
      celebrationCard.classList.add('visible');
      clearTimeout(celebrationHideTimer);
      celebrationHideTimer = setTimeout(() => {
        celebrationCard.classList.remove('visible');
      }, 6000);
    }
  }

  // 9. Sharing Engine & Modal Setup
  const shareDialog = document.getElementById('share-dialog');
  const btnOpenShare = document.getElementById('btn-open-share');
  const btnFloatingWhatsApp = document.getElementById('btn-floating-whatsapp');
  const btnCloseShare = document.getElementById('btn-close-share');

  const inputFromName = document.getElementById('share-from-name');
  const inputToName = document.getElementById('share-to-name');
  const selectWishStyle = document.getElementById('share-wish-style');
  const previewLinkEl = document.getElementById('share-link-preview');

  const btnShareWhatsApp = document.getElementById('btn-share-whatsapp');
  const btnModalWhatsApp = document.getElementById('btn-modal-whatsapp');
  const btnShareNative = document.getElementById('btn-share-native');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const btnShareTelegram = document.getElementById('btn-share-telegram');
  const copyFeedback = document.getElementById('copy-feedback');

  // Pre-fill user names if present in URL
  if (senderName && inputFromName) inputFromName.value = senderName;
  if (recipientName && inputToName) inputToName.value = recipientName;

  function generateShareURL() {
    const fromVal = inputFromName ? inputFromName.value.trim() : '';
    const toVal = inputToName ? inputToName.value.trim() : '';
    const styleVal = selectWishStyle ? selectWishStyle.value : '1';

    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (toVal) params.set('to', toVal);
    if (fromVal) params.set('from', fromVal);
    if (styleVal) params.set('style', styleVal);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  function getShareMessage(targetUrl) {
    const fromVal = inputFromName ? inputFromName.value.trim() : '';
    const toVal = inputToName ? inputToName.value.trim() : '';
    const styleVal = selectWishStyle ? selectWishStyle.value : '1';
    const wishText = getWishPresetMessage(styleVal);

    let text = `🪔✨ *HAPPY DIWALI!* ✨🪔\n\n`;
    if (toVal && fromVal) {
      text += `Dear ${toVal},\n${fromVal} sent you a magical interactive Diwali celebration!\n\n`;
    } else if (fromVal) {
      text += `${fromVal} sent you a sparkling Diwali celebration!\n\n`;
    } else if (toVal) {
      text += `Dear ${toVal}, wishing you a joyful and sparkling Diwali!\n\n`;
    }

    text += `"${wishText}"\n\n`;
    text += `👉 Tap to light diyas, launch fireworks & celebrate with Golu & Mithoo:\n${targetUrl}\n\n`;
    text += `🎆 Wishing you & your family immense joy, health & prosperity! 💖`;

    return text;
  }

  function updateSharePreview() {
    const shareUrl = generateShareURL();
    if (previewLinkEl) {
      previewLinkEl.textContent = shareUrl;
    }
  }

  if (inputFromName) inputFromName.addEventListener('input', updateSharePreview);
  if (inputToName) inputToName.addEventListener('input', updateSharePreview);
  if (selectWishStyle) selectWishStyle.addEventListener('change', updateSharePreview);

  // Open Share Dialog
  function openShareModal() {
    updateSharePreview();
    if (shareDialog) {
      shareDialog.showModal();
    }
  }

  if (btnOpenShare) {
    btnOpenShare.addEventListener('click', openShareModal);
  }

  // Floating 1-tap WhatsApp button
  if (btnFloatingWhatsApp) {
    btnFloatingWhatsApp.addEventListener('click', () => {
      const shareUrl = generateShareURL();
      const message = getShareMessage(shareUrl);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // WhatsApp Button in Main Bar & Modal
  const handleWhatsAppShare = () => {
    const shareUrl = generateShareURL();
    const message = getShareMessage(shareUrl);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (btnShareWhatsApp) {
    btnShareWhatsApp.addEventListener('click', handleWhatsAppShare);
  }
  if (btnModalWhatsApp) {
    btnModalWhatsApp.addEventListener('click', handleWhatsAppShare);
  }

  // Native Web Share API
  if (btnShareNative) {
    btnShareNative.addEventListener('click', async () => {
      const shareUrl = generateShareURL();
      const message = getShareMessage(shareUrl);
      const toVal = inputToName ? inputToName.value.trim() : '';

      if (navigator.share) {
        try {
          await navigator.share({
            title: toVal ? `Happy Diwali Wishes for ${toVal} 🪔✨` : `Magical Happy Diwali Celebration 🪔✨`,
            text: message,
            url: shareUrl
          });
        } catch (err) {
          // Fallback or user canceled
          if (err.name !== 'AbortError') {
            copyToClipboard(shareUrl);
          }
        }
      } else {
        // Fallback to copy link
        copyToClipboard(shareUrl);
      }
    });
  }

  // Telegram Share
  if (btnShareTelegram) {
    btnShareTelegram.addEventListener('click', () => {
      const shareUrl = generateShareURL();
      const message = getShareMessage(shareUrl);
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Copy Link Button
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      const shareUrl = generateShareURL();
      copyToClipboard(shareUrl);
    });
  }

  function copyToClipboard(text) {
    if (!navigator.clipboard?.writeText) {
      prompt("Copy your personalized Diwali celebration link:", text);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      if (copyFeedback) {
        copyFeedback.classList.add('visible');
        setTimeout(() => {
          copyFeedback.classList.remove('visible');
        }, 2500);
      }
    }).catch(() => {
      // Prompt fallback
      prompt("Copy your personalized Diwali celebration link:", text);
    });
  }

  if (btnCloseShare && shareDialog) {
    btnCloseShare.addEventListener('click', () => {
      shareDialog.close();
      shareDialog.returnValue = '';
    });
  }

  // Close dialog when clicking backdrop
  if (shareDialog) {
    shareDialog.addEventListener('click', (e) => {
      const bounds = shareDialog.getBoundingClientRect();
      if (e.target === shareDialog && (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom)) {
        shareDialog.close();
        shareDialog.returnValue = '';
      }
    });
    shareDialog.addEventListener('close', () => {
      shareDialog.returnValue = '';
    });
  }

  // Utility functions
  function getWishPresetMessage(style) {
    switch (style) {
      case '2':
        return "May your life be bursting with sweets, golden laughter, fun adventures, and endless joy! 🍬🎉";
      case '3':
        return "May the holy festival of lights bring peace, unity, warmth, and boundless love to your family and home. 💖🌸";
      case '4':
        return "May this New Year ignite great victories, new milestones, prosperity, and triumphant success in all your journeys! 🚀🌟";
      case '1':
      default:
        return "May Goddess Lakshmi and Lord Ganesha bless your home with eternal peace, radiant health, and boundless abundance! 🪔✨";
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
