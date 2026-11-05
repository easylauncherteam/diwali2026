const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function scene() {
  const events = {};
  const timers = new Map();
  let timerId = 0;
  const gradient = { addColorStop() {} };
  const ctx = new Proxy({ createRadialGradient: () => gradient, createLinearGradient: () => gradient }, {
    get(target, key) { return key in target ? target[key] : () => {}; }
  });
  const document = {
    hidden: false,
    addEventListener: (name, fn) => { events[name] = fn; },
    getElementById: () => null,
    createElement: () => ({ width: 0, height: 0, getContext: () => ctx })
  };
  const window = { innerWidth: 900, innerHeight: 700, devicePixelRatio: 1, matchMedia: () => ({ matches: false }), addEventListener() {} };
  const sandbox = { window, document, performance: { now: () => 0 }, requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    setInterval: () => 1, clearInterval() {}, setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); } };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('js/fireworks.js', 'utf8'), sandbox);
  const engine = new window.ParticleEngine({ style: {}, getContext: () => ctx });
  return { engine, document, events, timers };
}

function travel(hz) {
  const { engine } = scene();
  engine.particles.push({ x: 0, y: 0, vx: 2, vy: 0, gravity: 0.05, airDrag: 0.98, alpha: 1, decay: 0.001, size: 2, color: '#FFD54F' });
  engine.animate(0);
  for (let i = 1; i <= hz; i++) engine.animate(i * 1000 / hz);
  return engine.particles[0];
}

test('particle travel and lifetime are consistent at 30, 60 and 120 Hz', () => {
  const reference = travel(60);
  for (const hz of [30, 120]) {
    const p = travel(hz);
    assert.ok(Math.abs(p.x - reference.x) < 3, `${hz} Hz x displacement`);
    assert.ok(Math.abs(p.y - reference.y) < 4, `${hz} Hz y displacement`);
    assert.ok(Math.abs(p.alpha - reference.alpha) < 0.002, `${hz} Hz lifetime`);
  }
});

test('particle admission and emitters remain bounded under repeated interaction', () => {
  const { engine } = scene();
  for (let i = 0; i < 500; i++) {
    engine.addSparkler(100, 100);
    engine.spawnLantern(); engine.spawnAnar(); engine.spawnChakri(); engine.spawnSweetShower();
    engine.launchRocket(100, 100);
  }
  assert.ok(engine.particles.length <= engine.maxParticles);
  assert.ok(engine.lanterns.length <= 12);
  assert.ok(engine.anars.length <= 3);
  assert.ok(engine.chakris.length <= 3);
  assert.ok(engine.sweets.length <= 56);
  assert.ok(engine.rockets.length <= 12);
});

test('finale cannot overlap and calm mode reduces its scheduled bursts', () => {
  const { engine, timers } = scene();
  engine.setReducedMotion(true);
  engine.launchFinale();
  const count = timers.size;
  assert.ok(count > 0 && count <= 4);
  engine.launchFinale();
  assert.equal(timers.size, count);
});

test('hidden scenes cancel scheduled finale and do not advance physics on resume', () => {
  const { engine, document, events, timers } = scene();
  engine.launchFinale();
  document.hidden = true; events.visibilitychange();
  assert.equal(timers.size, 0);
  document.hidden = false; events.visibilitychange();
  engine.particles.push({ x: 10, y: 10, vx: 1, vy: 0, alpha: 1, decay: 0.01, size: 2, color: '#fff' });
  engine.animate(100000);
  assert.equal(engine.particles[0].x, 10);
});

test('calm mode emits no core flashes and limits particle velocity', () => {
  const { engine } = scene();
  engine.setReducedMotion(true);
  engine.explode(100, 100, 'chrysanthemum');
  assert.ok(engine.particles.every(p => !p.isCoreFlash));
  assert.ok(engine.particles.every(p => Math.hypot(p.vx, p.vy) <= 2 + 1e-12));
});

test('pooled records cannot retain branching or flash state after reuse', () => {
  const { engine } = scene();
  engine.addParticle({ x: 0, y: 0, alpha: 0.01, decay: 1, isCoreFlash: true, size: 2 });
  engine.animate(0); engine.animate(17);
  assert.equal(engine.particles.length, 0);
  assert.equal(engine.particlePool.length, 1);
  engine.addSparkler(0, 0);
  assert.ok(engine.particles.every(p => !p.isCoreFlash));
});

test('sounds cannot create an audio context before a user gesture', () => {
  let contexts = 0;
  const sandbox = { window: { AudioContext: function () { contexts++; throw new Error('context should not start'); } }, localStorage: { getItem: () => 'false' } };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('js/audio.js', 'utf8'), sandbox);
  assert.doesNotThrow(() => sandbox.window.diwaliAudio.playRocketLaunch(0.5));
  assert.equal(contexts, 0);
});

test('calm mode replaces spinning sweets and ground effects with stationary feedback', () => {
  const { engine } = scene();
  engine.spawnSweetShower();
  engine.setReducedMotion(true);
  assert.equal(engine.sweets.length, 0);
  engine.spawnChakri(100, 100);
  assert.equal(engine.chakris.length, 0);
  engine.spawnSweetShower();
  const initial = engine.sweets.map(s => ({x:s.x, y:s.y, rot:s.rot}));
  engine.animate(0); engine.animate(1000 / 60);
  engine.sweets.forEach((s, i) => {
    assert.equal(s.x, initial[i].x); assert.equal(s.y, initial[i].y); assert.equal(s.rot, initial[i].rot);
    assert.ok(s.alpha < 1);
  });
});

test('settled sweets fade with elapsed time at every refresh rate', () => {
  const results = [30, 60, 120].map(hz => {
    const { engine } = scene();
    engine.sweets.push({x:450,y:660,vx:0,vy:0,rot:0,rotSpeed:0,type:'laddoo',bounces:5,size:26,alpha:1});
    engine.animate(0);
    for (let i = 1; i <= hz / 2; i++) engine.animate(i * 1000 / hz);
    return engine.sweets[0]?.alpha ?? 0;
  });
  assert.ok(Math.max(...results) - Math.min(...results) < 0.03);
});
