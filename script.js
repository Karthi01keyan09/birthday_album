/* ══════════════════════════════════════════════════
   3D BIRTHDAY E-ALBUM  |  script.js  (v2 — mobile)
   ══════════════════════════════════════════════════ */
'use strict';

/* ── CONFIG ─────────────────────────────────────── */
const TOTAL_PAGES = 17;  // number of .page elements

const PAGE_LABELS = []; // removed visible labels as requested

const TYPEWRITER_MSG =
`Happy 20th Birthday! 🎂\n\n` +
`Twenty years of you — and the world is so much more beautiful because of it. ` +
`Every smile you share, every laugh you let out makes people around you feel lucky to know you.\n\n` +
`May this new chapter be filled with adventures, joy, and all the love you so generously give.\n\n` +
`Here's to you — always. 💛`;

const TYPE_APOLOGY = Array.from("Sorry for stealing some of your pictures reyy 🙏🤌😅😁");

/* ── DOM ─────────────────────────────────────────── */
const startOverlay = document.getElementById('startOverlay');
const albumScene   = document.getElementById('albumScene');
const openBtn      = document.getElementById('openBtn');
const pages        = document.querySelectorAll('.page');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const navLbl       = document.getElementById('navLbl');
const pgCounter    = document.getElementById('pgCounter');
const bgMusic      = document.getElementById('bgMusic');
const flipAudio    = document.getElementById('flipAudio');
const musicBtn     = document.getElementById('musicBtn');
const confCvs      = document.getElementById('confetti');
const floatDiv     = document.getElementById('floatingBits');
const finalOv      = document.getElementById('finalOverlay');
const foTxt        = document.getElementById('foTxt');
const foBack       = document.getElementById('foBack');
const cCtx         = confCvs.getContext('2d');

/* ── STATE ───────────────────────────────────────── */
let cur       = 0;
let flipping  = false;
let musicOn   = false;
let twDone    = false;
let confPcs   = [];
let rafId     = null;

/* ── RESIZE CANVAS ──────────────────────────────── */
function resizeCvs() {
  confCvs.width  = window.innerWidth;
  confCvs.height = window.innerHeight;
}
resizeCvs();
window.addEventListener('resize', resizeCvs);

/* ════════════════════════════════════════════════════
   OPEN ALBUM
   ════════════════════════════════════════════════════ */
openBtn.addEventListener('click', () => {
  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {});
  musicOn = true;
  musicBtn.classList.add('on');

  startOverlay.classList.add('so-fade-out');
  setTimeout(() => {
    startOverlay.style.display = 'none';
    albumScene.classList.remove('hidden');
    albumScene.classList.add('scene-in');
    burstConf(100);
    spawnParticles();
    updateUI();
  }, 700);
});

/* ════════════════════════════════════════════════════
   INJECT FINAL OVERLAY INTO DOM
   ════════════════════════════════════════════════════ */
// (already in HTML — just wire the back button)
foBack.addEventListener('click', () => {
  finalOv.classList.remove('open');
  albumScene.style.opacity = '1';
  pages.forEach(p => p.classList.remove('flipped'));
  cur = 0;
  apolDone = false;
  document.getElementById('apologyText').innerHTML = '';
  updateUI();
});

/* ════════════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════════════ */
nextBtn.addEventListener('click', () => goNext());
prevBtn.addEventListener('click', () => goPrev());

function goNext() {
  // On the LAST page → show final overlay
  if (cur === TOTAL_PAGES - 1) {
    playFlip();
    showFinal();
    return;
  }
  if (flipping || cur >= TOTAL_PAGES) return;
  flipping = true;
  playFlip();
  pages[cur].classList.add('flipped');
  cur++;
  updateUI();
  
  if (cur === 15) {
    setTimeout(typeApology, 1200);
  }
  
  setTimeout(() => { flipping = false; }, 1850);
}
function goPrev() {
  if (flipping || cur <= 0) return;
  flipping = true;
  playFlip();
  cur--;
  pages[cur].classList.remove('flipped');
  updateUI();
  setTimeout(() => { flipping = false; }, 1850);
}

function updateUI() {
  prevBtn.disabled = cur === 0;
  nextBtn.disabled = false;
  // Labels and counters hidden via CSS or removed as requested
}

/* ════════════════════════════════════════════════════
   FINAL OVERLAY + TYPEWRITER
   ════════════════════════════════════════════════════ */
function showFinal() {
  finalOv.classList.add('open');
  albumScene.style.transition = 'opacity 0.5s';
  albumScene.style.opacity = '0';
  setTimeout(() => { startTypewriter(); burstConf(80); }, 500);
}

function startTypewriter() {
  if (twDone) return;
  twDone = true;
  foTxt.textContent = '';
  const cur2 = document.querySelector('.fo-cur');
  let i = 0;
  (function type() {
    if (i < TYPEWRITER_MSG.length) {
      foTxt.textContent += TYPEWRITER_MSG[i++];
      const ch = TYPEWRITER_MSG[i - 1];
      const d = ch === '\n'  ? 350 :
                ch === '.' || ch === '!' || ch === '?' ? 160 :
                ch === ',' ? 100 : 36 + Math.random() * 22;
      setTimeout(type, d);
    } else {
      if (cur2) cur2.style.animation = 'none';
      burstConf(60);
    }
  })();
}

let apolDone = false;
function typeApology() {
  if (apolDone) return;
  apolDone = true;
  const el = document.getElementById('apologyText');
  el.innerHTML = '';
  let i = 0;
  (function type() {
    if (i < TYPE_APOLOGY.length) {
      if (TYPE_APOLOGY[i] === '\n') el.innerHTML += '<br>';
      else el.innerHTML += TYPE_APOLOGY[i];
      i++;
      setTimeout(type, 110); // somewhat slow, dynamic typing speed
    }
  })();
}

/* ════════════════════════════════════════════════════
   FLIP SOUND
   ════════════════════════════════════════════════════ */// ── FLIP SOUND ────────────────────────────────────
function playFlip() {
  try {
    flipAudio.currentTime = 0;
    flipAudio.volume = 0.25; // "not too loud"
    
    // Match sound to page turning speed (1.8s)
    if (flipAudio.duration > 0) {
      let targetRate = flipAudio.duration / 1.8;
      flipAudio.playbackRate = Math.max(0.3, Math.min(1.5, targetRate));
    }
    
    let playPromise = flipAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => playSynthFlip());
    }
  } catch(e) {
    playSynthFlip();
  }
}

// Programmatic "paper" sound fallback using Web Audio (Realistic Slow Bass Sweep)
function playSynthFlip() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 1.8; // Exactly matches the page flip duration
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate soft brown noise for a deep bassy texture
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise approximation
        lastOut = data[i];
        data[i] *= 3.5; // Compensate gain for softness
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Low-pass filter for deep "low pitch and bass" whoosh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(280, ctx.currentTime + (duration * 0.4));
    filter.frequency.linearRampToValueAtTime(60, ctx.currentTime + duration);
    
    // Smooth, slow envelope curve
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + (duration * 0.3)); // Swell
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration); // Fade out

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  } catch(e) {}
}

/* ════════════════════════════════════════════════════
   MUSIC TOGGLE
   ════════════════════════════════════════════════════ */
musicBtn.addEventListener('click', () => {
  if (musicOn) {
    bgMusic.pause(); musicOn = false;
    musicBtn.textContent = '🔇'; musicBtn.classList.remove('on');
  } else {
    bgMusic.play().catch(() => {}); musicOn = true;
    musicBtn.textContent = '🎵'; musicBtn.classList.add('on');
  }
});

/* ════════════════════════════════════════════════════
   TOUCH SWIPE (for mobile)
   ════════════════════════════════════════════════════ */
let touchX = null;
const book  = document.getElementById('book');

book.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
book.addEventListener('touchend',   e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); }
  touchX = null;
}, { passive: true });

/* Also swipe on the full scene */
document.addEventListener('touchstart', e => {
  if (!albumScene.classList.contains('hidden')) touchX = e.touches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (touchX === null || finalOv.classList.contains('open')) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
  touchX = null;
}, { passive: true });

/* Keyboard (desktop preview) */
document.addEventListener('keydown', e => {
  if (albumScene.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
});

/* ════════════════════════════════════════════════════
   CONFETTI
   ════════════════════════════════════════════════════ */
const CONF_COLORS = ['#f5c842','#e63f7a','#8b5cf6','#0ea5e9','#34d399','#f97316','#ec4899'];

class ConfPiece {
  constructor(bx, by) {
    this.x  = bx; this.y  = by;
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = -(Math.random() * 14 + 4);
    this.w  = Math.random() * 9 + 5;
    this.h  = Math.random() * 5 + 3;
    this.rot   = Math.random() * Math.PI * 2;
    this.dRot  = (Math.random() - 0.5) * 0.18;
    this.color = CONF_COLORS[~~(Math.random() * CONF_COLORS.length)];
    this.grav  = 0.38;
    this.life  = 100 + ~~(Math.random() * 90);
    this.age   = 0;
    this.alpha = 1;
    this.circ  = Math.random() > 0.5;
  }
  update() {
    this.vy += this.grav; this.x += this.vx; this.y += this.vy;
    this.rot += this.dRot; this.age++;
    if (this.age > this.life * 0.65) {
      this.alpha = 1 - (this.age - this.life * 0.65) / (this.life * 0.35);
    }
  }
  draw(c) {
    c.save(); c.globalAlpha = Math.max(0, this.alpha);
    c.translate(this.x, this.y); c.rotate(this.rot); c.fillStyle = this.color;
    if (this.circ) { c.beginPath(); c.arc(0,0,this.w/2,0,Math.PI*2); c.fill(); }
    else { c.fillRect(-this.w/2,-this.h/2,this.w,this.h); }
    c.restore();
  }
  dead() { return this.age >= this.life || this.y > confCvs.height + 20; }
}

function burstConf(n, bx, by) {
  bx = bx ?? confCvs.width / 2;
  by = by ?? confCvs.height * 0.38;
  for (let i = 0; i < n; i++) confPcs.push(new ConfPiece(bx, by));
  if (!rafId) animConf();
}
function animConf() {
  cCtx.clearRect(0, 0, confCvs.width, confCvs.height);
  confPcs = confPcs.filter(p => !p.dead());
  confPcs.forEach(p => { p.update(); p.draw(cCtx); });
  rafId = confPcs.length ? requestAnimationFrame(animConf) : null;
}

/* ════════════════════════════════════════════════════
   FLOATING PARTICLES
   ════════════════════════════════════════════════════ */
const EMOJIS = ['🎈','✨','⭐','🌸','💛','🎀','🎉','💫','🌟','💕','🎊'];
function spawnParticles() {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'fb-particle';
    p.textContent = EMOJIS[~~(Math.random() * EMOJIS.length)];
    p.style.setProperty('--dur',   (5 + Math.random() * 9) + 's');
    p.style.setProperty('--delay', (Math.random() * 10) + 's');
    p.style.setProperty('--left',  (Math.random() * 100) + '%');
    p.style.fontSize = (0.7 + Math.random() * 0.7) + 'rem';
    floatDiv.appendChild(p);
  }
}

/* ── INIT ── */
updateUI();