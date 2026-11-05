// ============================================================
// Happy Diwali - Harsh Trivedi Personalized Wish Platform
// ============================================================

// API endpoint for saving images (if needed)
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.origin + '/api')
    : 'https://www.surajrana.dev/happydiwali/api';

let userUploadedImage = null;

// Festive Diwali Wishes in English
const diwaliWishes = [
    {
        text: "🪔 May the divine light of Diwali illuminate your life with peace, prosperity, joy and good health! ✨<br><br>🌟 Happy Diwali 🌟",
        color: "#ff5722"
    },
    {
        text: "🎆 May Goddess Lakshmi bless you and your family with boundless happiness, fortune and eternal success! 🎆<br><br>🪔 Wishing You A Very Happy Diwali 🪔",
        color: "#ff6f00"
    },
    {
        text: "✨ May this festival of lights brighten your path to success, bring warmth to your home and endless smiles! ✨<br><br>🎇 Shubh Deepavali 🎇",
        color: "#d84315"
    },
    {
        text: "🪔 Wishing you a festival full of sweet memories, skies full of fireworks, homes full of diyas and hearts full of love! 🪔<br><br>✨ Happy Diwali ✨",
        color: "#e65100"
    },
    {
        text: "🌟 May the divine glow of diyas bring hope, harmony and everlasting prosperity to your life! 🌟<br><br>🪔 Warm Festive Greetings 🪔",
        color: "#bf360c"
    }
];

function getRandomWishForUser(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % diwaliWishes.length;
    return diwaliWishes[index];
}

// ============================================================
// Music & Authentic Cracker Sounds Engine
// ============================================================
let soundEnabled = true;
let musicStarted = false;

// Preloaded Audio Pool for gentle ambient cracker sounds
function createAudioPool(src, count, vol = 0.08) {
    const pool = [];
    for (let i = 0; i < count; i++) {
        const a = new Audio(src);
        a.volume = vol;
        a.preload = 'auto';
        pool.push(a);
    }
    return {
        idx: 0,
        play: function(customVol) {
            if (!soundEnabled) return;
            const a = pool[this.idx];
            this.idx = (this.idx + 1) % pool.length;
            a.volume = (customVol !== undefined) ? customVol : vol;
            a.currentTime = 0;
            a.play().catch(() => {});
        }
    };
}

const bombAudio = createAudioPool('audio/bomb.wav', 6, 0.08);
const rocketAudio = createAudioPool('audio/rocket.wav', 4, 0.05);
const ladiAudio = createAudioPool('audio/ladi.wav', 3, 0.08);

// Web Audio API context for browser compatibility
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playCrackerBlastSound() {
    if (!soundEnabled) return;
    bombAudio.play(0.08 + Math.random() * 0.03);
}

function playRocketLaunchSound() {
    if (!soundEnabled) return;
    rocketAudio.play(0.05);
}

function playLadiSound() {
    if (!soundEnabled) return;
    ladiAudio.play(0.08);
}

// Helper to update Sound Toggle button text and icon
function updateSoundButton(isPlaying) {
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');
    if (isPlaying) {
        if (soundIcon) soundIcon.textContent = '🔊';
        if (soundText) soundText.textContent = 'Music: ON';
    } else {
        if (soundIcon) soundIcon.textContent = '🔇';
        if (soundText) soundText.textContent = 'Music: OFF';
    }
}

// Start Music reliably
function startMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic || !soundEnabled) return;
    
    getAudioContext();
    bgMusic.volume = 1.0;
    
    const promise = bgMusic.play();
    if (promise !== undefined) {
        promise.then(() => {
            musicStarted = true;
            updateSoundButton(true);
        }).catch((err) => {
            // Autoplay blocked prior to interaction
            console.log('Autoplay waiting for first touch/click');
        });
    }
}

// Global user interaction listener to start music immediately on first touch/click
function handleFirstInteraction() {
    if (!musicStarted && soundEnabled) {
        startMusic();
    }
}
['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
    window.addEventListener(evt, handleFirstInteraction, { passive: true });
    document.addEventListener(evt, handleFirstInteraction, { passive: true });
});

// Toggle Sound (Single-click responsive toggle)
function toggleSound() {
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) return;
    
    if (bgMusic.paused) {
        soundEnabled = true;
        getAudioContext();
        bgMusic.volume = 1.0;
        bgMusic.play().then(() => {
            musicStarted = true;
            updateSoundButton(true);
        }).catch(() => {});
    } else {
        soundEnabled = false;
        bgMusic.pause();
        updateSoundButton(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}

// ============================================================
// English Voice Greeting (Speech Synthesis)
// ============================================================
let voicesList = [];
function initVoices() {
    if ('speechSynthesis' in window) {
        voicesList = window.speechSynthesis.getVoices();
    }
}
if ('speechSynthesis' in window) {
    initVoices();
    window.speechSynthesis.onvoiceschanged = initVoices;
}

function speakWishVoice() {
    if (!('speechSynthesis' in window) || !soundEnabled) return;
    
    try {
        window.speechSynthesis.cancel();
        initVoices();
        
        // Pick best natural English voice
        let selectedVoice = voicesList.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online')));
        if (!selectedVoice) {
            selectedVoice = voicesList.find(v => v.lang.startsWith('en'));
        }
        
        const greetingText = "Harsh Trivedi wishes you and your family a very Happy and Prosperous Diwali!";
        const utterance = new SpeechSynthesisUtterance(greetingText);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = 'en-US';
        }
        
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        
        // Gentle ducking of background music while greeting plays
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.volume = 0.3;
            utterance.onend = () => { if (bgMusic) bgMusic.volume = 1.0; };
            utterance.onerror = () => { if (bgMusic) bgMusic.volume = 1.0; };
        }
        
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.error('Speech error:', e);
    }
}

// ============================================================
// Falling Flower Petals Shower
// ============================================================
let petalsInterval = null;
function startFlowerPetals() {
    const container = document.getElementById('flowerPetals');
    if (!container || petalsInterval) return;
    
    const petalClasses = ['marigold-orange', 'marigold-yellow', 'rose-red', 'rose-pink'];
    
    function spawnPetal() {
        const petal = document.createElement('div');
        const randClass = petalClasses[Math.floor(Math.random() * petalClasses.length)];
        petal.className = `petal ${randClass}`;
        
        const size = 12 + Math.random() * 18;
        petal.style.width = size + 'px';
        petal.style.height = (size * 1.35) + 'px';
        petal.style.left = (Math.random() * 100) + 'vw';
        
        const duration = 5.5 + Math.random() * 5;
        petal.style.animationDuration = duration + 's';
        
        container.appendChild(petal);
        setTimeout(() => {
            if (petal.parentNode === container) {
                container.removeChild(petal);
            }
        }, duration * 1000);
    }
    
    for (let i = 0; i < 18; i++) {
        setTimeout(spawnPetal, i * 160);
    }
    petalsInterval = setInterval(spawnPetal, 400);
}

// ============================================================
// Spectacular High-Density Fireworks Engine (Sky Full of Crackers)
// ============================================================
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const festiveColors = [
    '#ffd700', // Gold
    '#ff6f00', // Saffron
    '#ff1744', // Ruby Red
    '#00e676', // Emerald Green
    '#00e5ff', // Sky Blue
    '#e040fb', // Magenta
    '#ff9100', // Deep Orange
    '#ffffff', // Sparkling White
    '#ffff00'  // Bright Yellow
];

class Rocket {
    constructor(startX, targetX, targetY, color) {
        this.x = startX;
        this.y = canvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        const dist = Math.hypot(targetX - startX, targetY - canvas.height);
        const speed = 14 + Math.random() * 5;
        this.vx = ((targetX - startX) / dist) * speed;
        this.vy = ((targetY - canvas.height) / dist) * speed;
        this.trail = [];
        this.exploded = false;
        playRocketLaunchSound();
    }
    
    update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 1.0 });
        if (this.trail.length > 8) this.trail.shift();
        
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.vy < 0 && this.y <= this.targetY) {
            this.exploded = true;
            createExplosion(this.x, this.y, this.color);
        }
    }
    
    draw() {
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const p = this.trail[i];
            ctx.fillStyle = this.color;
            ctx.globalAlpha = (i / this.trail.length) * 0.8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class FireworkParticle {
    constructor(x, y, color, isHeavy = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = isHeavy ? (Math.random() * 5 + 1) : (Math.random() * 8 + 2);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.018 + 0.012;
        this.size = Math.random() * 3 + 1.8;
        this.gravity = isHeavy ? 0.12 : 0.09;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
}

let particles = [];
let rockets = [];

function createExplosion(x, y, forcedColor) {
    playCrackerBlastSound();
    
    const count = 75;
    const primary = forcedColor || festiveColors[Math.floor(Math.random() * festiveColors.length)];
    const secondary = festiveColors[Math.floor(Math.random() * festiveColors.length)];
    const isWillow = Math.random() > 0.6; // Golden willow cascade
    
    for (let i = 0; i < count; i++) {
        const c = isWillow ? '#ffd700' : (Math.random() > 0.4 ? primary : secondary);
        particles.push(new FireworkParticle(x, y, c, isWillow));
    }
}

function launchRocket(targetX, targetY) {
    const startX = targetX + (Math.random() - 0.5) * 120;
    const color = festiveColors[Math.floor(Math.random() * festiveColors.length)];
    rockets.push(new Rocket(startX, targetX, targetY, color));
}

// Barrage of multiple rockets (Sky Full of Fireworks!)
function launchBarrage() {
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * (canvas.width * 0.85) + (canvas.width * 0.075);
            const y = Math.random() * (canvas.height * 0.5) + 60;
            launchRocket(x, y);
        }, i * 160);
    }
}

function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw();
        if (r.exploded) rockets.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        } else {
            p.update();
            p.draw();
        }
    }

    requestAnimationFrame(animateFireworks);
}

// Continuous rapid fireworks in the sky
setInterval(launchBarrage, 1100);
animateFireworks();

// Click anywhere on screen to burst fireworks instantly
document.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    getAudioContext();
    createExplosion(e.clientX, e.clientY);
    setTimeout(() => {
        createExplosion(e.clientX + (Math.random() - 0.5) * 80, e.clientY + (Math.random() - 0.5) * 60);
    }, 120);
});

// ============================================================
// Application Flow (Gift Box -> Pushpak Viman -> Harsh Trivedi Card)
// ============================================================
let vimanTimeout = null;
let vimanSkipped = false;

window.addEventListener('DOMContentLoaded', () => {
    const senderName = "Harsh Trivedi";
    console.log('=== DIWALI WISH INITIALIZED FOR: ' + senderName + ' ===');
    showGift(senderName);
    
    // Auto start music immediately on load
    startMusic();
});

window.addEventListener('load', () => {
    startMusic();
});

function showGift(name) {
    const nameForm = document.getElementById('nameForm');
    const giftContainer = document.getElementById('giftContainer');
    const giftBox = document.getElementById('giftBox');
    
    if (nameForm) {
        nameForm.classList.add('hidden');
        nameForm.style.display = 'none';
    }
    
    if (giftContainer) {
        giftContainer.classList.remove('hidden');
    }
    
    if (giftBox) {
        giftBox.onclick = () => {
            openGift(name);
        };
    }
}

function showWishCard(name, userWish) {
    if (vimanSkipped) return;
    vimanSkipped = true;
    if (vimanTimeout) clearTimeout(vimanTimeout);
    
    const vimanContainer = document.getElementById('boatAnimationContainer');
    const wishContainer = document.getElementById('wishContainer');
    const displayName = document.getElementById('displayName');
    const wishText = document.querySelector('.hindi-wish');
    
    if (vimanContainer) vimanContainer.classList.add('hidden');
    if (wishContainer) wishContainer.classList.remove('hidden');
    
    if (displayName) {
        displayName.textContent = name;
        displayName.style.color = userWish ? userWish.color : '#e65100';
    }
    if (wishText && userWish) {
        wishText.innerHTML = userWish.text;
    }
    
    // Start falling flower petals shower!
    startFlowerPetals();
    
    // Gentle celebratory cracker
    playLadiSound();
    
    // Grand celebratory fireworks
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const x = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
            const y = Math.random() * (canvas.height * 0.5) + 60;
            createExplosion(x, y);
        }, i * 180);
    }
}

function skipBoatAnimation() {
    const senderName = "Harsh Trivedi";
    const userWish = getRandomWishForUser(senderName);
    showWishCard(senderName, userWish);
}

function openGift(name) {
    vimanSkipped = false;
    getAudioContext();
    
    // Ensure music is playing at full 100% volume
    startMusic();
    
    // Gentle opening cracker
    playCrackerBlastSound();
    
    const giftBox = document.getElementById('giftBox');
    const giftContainer = document.getElementById('giftContainer');
    const vimanContainer = document.getElementById('boatAnimationContainer');
    const userWish = getRandomWishForUser(name);
    
    giftBox.classList.add('opening');
    
    // Fireworks on opening
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
            const y = Math.random() * (canvas.height * 0.55) + 50;
            createExplosion(x, y);
        }, i * 110);
    }
    
    setTimeout(() => {
        giftContainer.classList.add('hidden');
        vimanContainer.classList.remove('hidden');
        
        // Continuous festive fireworks during Pushpak Viman arrival
        launchBarrage();
        setTimeout(launchBarrage, 2000);
        setTimeout(launchBarrage, 4500);
        
        // Transition to wish card after Pushpak Viman scene (8.5 seconds)
        vimanTimeout = setTimeout(() => {
            showWishCard(name, userWish);
        }, 8500);
    }, 900);
}
