/**
 * One window-level pointer feed for every executive effect.
 *
 * Effects used to listen on their own element, so they froze or snapped the moment the
 * cursor crossed that element's box. Here every effect reads the same global pointer and
 * eases toward it each frame, fading out with distance instead of stopping at an edge.
 */
export interface PointerState { x: number; y: number; active: boolean }
type Listener = (pointer: PointerState) => void;

const pointer: PointerState = { x: -9999, y: -9999, active: false };
const listeners = new Set<Listener>();
let bound = false;

function emit() { listeners.forEach((listener) => listener(pointer)); kickSpotlights(); }

function bind() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true;
    emit();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { pointer.active = false; emit(); });
  // Scrolling moves elements under a still cursor, so positions need refreshing too.
  window.addEventListener('scroll', () => { emit(); }, { passive: true });
}

export function subscribePointer(listener: Listener) {
  bind();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/* ---------- Spotlights ---------- */

interface Spot { element: HTMLElement; reach: number; x: number; y: number; strength: number; primed: boolean }
const spots = new Set<Spot>();
let frame = 0;

function tick() {
  frame = 0;
  let moving = false;
  for (const spot of spots) {
    const bounds = spot.element.getBoundingClientRect();
    if (bounds.bottom < -spot.reach || bounds.top > innerHeight + spot.reach) continue;
    const targetX = pointer.x - bounds.left;
    const targetY = pointer.y - bounds.top;
    // How far the cursor sits outside the box: 0 inside, growing outside.
    const outsideX = Math.max(bounds.left - pointer.x, 0, pointer.x - bounds.right);
    const outsideY = Math.max(bounds.top - pointer.y, 0, pointer.y - bounds.bottom);
    const targetStrength = pointer.active ? Math.max(0, 1 - Math.hypot(outsideX, outsideY) / spot.reach) : 0;
    if (!spot.primed && pointer.active) { spot.x = targetX; spot.y = targetY; spot.primed = true; }

    spot.x += (targetX - spot.x) * 0.14;
    spot.y += (targetY - spot.y) * 0.14;
    spot.strength += (targetStrength - spot.strength) * 0.1;
    spot.element.style.setProperty('--mx', `${spot.x.toFixed(1)}px`);
    spot.element.style.setProperty('--my', `${spot.y.toFixed(1)}px`);
    spot.element.style.setProperty('--spot', spot.strength.toFixed(3));
    if (Math.abs(targetX - spot.x) > 0.3 || Math.abs(targetY - spot.y) > 0.3 || Math.abs(targetStrength - spot.strength) > 0.002) moving = true;
  }
  if (moving) frame = requestAnimationFrame(tick);
}

function kickSpotlights() { if (!frame && spots.size) frame = requestAnimationFrame(tick); }

/** Registers an element whose CSS reads --mx/--my (eased cursor position) and --spot (0–1 proximity). */
export function registerSpotlight(element: HTMLElement, reach = 140) {
  bind();
  const spot: Spot = { element, reach, x: 0, y: 0, strength: 0, primed: false };
  spots.add(spot);
  return () => { spots.delete(spot); };
}
