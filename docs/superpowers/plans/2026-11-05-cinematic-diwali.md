# Cinematic Diwali Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver the approved cinematic visual upgrade with consistent physics and accessible motion.
**Architecture:** Preserve existing static HTML, CSS, SVG and Canvas 2D classes. Improve the renderer in place and share motion state through the existing engine.
**Tech Stack:** Vanilla JavaScript, CSS, SVG, Canvas 2D; Node built-in test runner for development checks only.
**Spec:** docs/superpowers/specs/2026-11-05-cinematic-diwali-design.md

## Global Constraints
No frameworks, bundlers, runtime packages, external image assets, deployment, or audio redesign. Existing architectural comments remain.

## Review Focus
- High refresh rates: particle displacement and lifetime must follow elapsed time.
- Hidden/resumed tab: no simulation catch-up or queued fireworks barrage.
- Repeated effects: bounded particles, emitters, lanterns, sweets and finale timers.
- System/manual calm mode: synchronized state, subdued bursts and no dancing.
- Narrow/short screens: no overflow, usable controls and scrollable dialog.

### Task 1: Renderer and physics
Files: js/fireworks.js; tests/engine.test.cjs.
- [x] Add behavior tests for elapsed-time movement, hidden resume, population bounds and reduced-motion finale; run and observe failures.
- [x] Use clamped elapsed frame units for every simulation; destination-out canvas fading; reusable glow sprites; bounded effects and pooled particle records; single guarded finale scheduler and cancellable illumination.
- [x] Run behavior tests and syntax checks.

### Task 2: Interaction and motion consistency
Files: js/app.js, js/characters.js.
- [x] Synchronize system preference and manual toggle; centralize celebration trigger and idempotent dance state.
- [x] Coalesce pointer effects and eye tracking; stop interactions on cancellation/blur. Route diya particles through bounded admission.
- [x] Check personalized wishes, dialog, all lamps and finale in browser.

### Task 3: Cinematic scene
Files: css/style.css, index.html.
- [x] Layer atmosphere and celestial detail; refine stage, metallic highlights, lamps, mascot depth, surfaces, transitions and focus rings.
- [x] Add safe-area and narrow/short viewport handling; apply complete calm and hidden-page animation overrides.
- [x] Inspect desktop/mobile and reduced motion; adjust from observed results.

### Task 4: Verification and review
- [x] Run complete behavior suite, JavaScript syntax checks and git diff whitespace checks.
- [x] Review final changes for lifecycle, rendering, accessibility and responsive regressions; fix material findings.
- [x] Record completed checks and limitations; leave changes reviewable in the supplied workspace.

## Execution decisions
User approved implementation in the supplied workspace. Work in place, leave changes uncommitted, and do not create extra approval gates or relocate files. Visual styling uses browser inspection rather than implementation-mirroring tests.


## Verification record
- `node --test`: nine checks passed, including refresh-rate physics, bounded populations, finale admission, hidden-tab cancellation, pooled-state reuse, audio gesture gating, calm feedback and sweet lifetimes.
- `node --check` on all four JavaScript files and `git diff --check`: passed.
- Browser inspected at 1440×1000, 390×844 and 320×568; mobile widths had no horizontal overflow, short dialog scrolled.
- Exercised all five lamps, manual finale plus lamp-completion overlap, system reduced-motion emulation, manual calm mode, personalized URL theme and generated sharing link. No share was sent.
- Browser warning/error log empty during checks. Physical-device frame-rate profiling and Safari/Firefox testing were not performed.
- Independent code review identified three issues; reproduced and fixed calm sweets/spinning, sweet fading timing, and all-lit status during an active finale.
