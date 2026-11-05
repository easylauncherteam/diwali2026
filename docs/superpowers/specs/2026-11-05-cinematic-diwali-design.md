# Cinematic Diwali visual upgrade

## Intent
Enhance the existing interactive Diwali celebration into a polished, immersive scene while retaining Golu and Mithoo, all five diyas, personalized wishes, and sharing. The user selected a rich, cinematic Diwali with playful mascots.

## Direction and approaches
Selected: layered cinematic atmosphere using the existing SVG, Canvas 2D, and CSS architecture. Rich indigo skies and restrained warm gold light will give the playful characters a more tangible setting. This preserves the existing identity and avoids additional downloads or runtime dependencies.

Alternatives considered: a bright, highly animated celebration would amplify the existing energy but reduce visual calm; an understated gold-and-night treatment would simplify the experience but diminish its playful character.

## Visual design
- Add depth through a layered night sky, subtle celestial detail, horizon haze, palace lighting, and a grounded stage. Keep decorative layers non-interactive and hidden from assistive technology.
- Refine title highlights, controls, dialogs, and surfaces around one consistent warm-metal and translucent-indigo palette. Preserve readable text and clear keyboard focus.
- Give mascots contact shadows, soft rim light, and gentler idle motion. Preserve their SVG identity and explicit tap reactions.
- Refine terracotta shading and flame shape, stagger flame timing, and allow only lit diyas to emit light. Use warm reflected light around the diya row.
- Refine fireworks with luminous cores, tapered trails, restrained flashes, and lantern paper shading. Preserve the distinct burst types.

## Motion and performance
Use elapsed time for simulation so speed remains consistent across refresh rates. Clamp elapsed time after suspension; pause rendering and automatic effects while hidden. Use bounded particle and emitter populations, reusable glow sprites where useful, and capped canvas resolution. Preserve the sky behind the transparent canvas instead of progressively obscuring it with an opaque fill.

Synchronize the initial system reduced-motion preference, manual calm control, CSS animations, particle intensity, and finale behavior. Calm mode uses fewer effects, no large flashes, no dancing or spinning, and short opacity-based feedback. Coalesce pointer work to animation frames and end drawing on pointer cancellation or lost focus.

Prevent overlapping finale sequences and duplicate launch calls. Preserve audio initiation inside user gestures.

## Responsive behavior and accessibility
Keep a mobile-first layout with safe-area spacing, usable touch targets, no horizontal overflow at narrow widths, and a scrollable dialog on short screens. Restrict hover motion to devices with hover capability. Keep status announcements, labels, native dialog behavior, and visible keyboard focus.

## Constraints and non-goals
No frameworks, bundlers, runtime packages, external image assets, deployment, or audio redesign. Existing architectural comments remain. No claim of universal 60 FPS; tune against observed behavior and bound expensive work.

## Implementation discretion
Exact colors, light intensity, timing, particle limits, and responsive spacing are the implementer's choices within this direction. Keep effects subordinate to the greeting and controls. No device-specific quality setting is required unless measurement justifies it.

## Verification
Check JavaScript syntax and use deterministic simulation checks for elapsed-time behavior, population bounds, visibility, and calm-mode effects. Inspect the rendered page at desktop and narrow mobile sizes, including personalized greetings, all five lamps, finale, lanterns, interactions, keyboard focus, dialog, and reduced motion. Report any browser or device checks unavailable in this environment.
