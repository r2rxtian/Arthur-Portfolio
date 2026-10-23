import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { EASE_OUT, prefersReducedMotion } from './motionUtils';

type CursorState = 'default' | 'link' | 'text' | 'label';
const INTERACTIVE = 'a, button, summary, [role="button"], label, input, select, textarea';
const TEXT = '.exec-hero-title, .exec-split-head h2, .exec-contact h2, .case-title';

// Blob geometry per state. Only the shape is sprung; position always tracks the pointer exactly.
const shapes: Record<CursorState, { width: number; height: number; borderRadius: number }> = {
  default: { width: 14, height: 14, borderRadius: 7 },
  link: { width: 56, height: 56, borderRadius: 28 },
  text: { width: 4, height: 52, borderRadius: 2 },
  label: { width: 76, height: 76, borderRadius: 38 },
};

function canUseCustomCursor() {
  return typeof window !== 'undefined' && matchMedia('(pointer: fine)').matches && !prefersReducedMotion();
}

/**
 * Inverting blob cursor. It sits exactly on the pointer (no trailing spring, so no lag) and
 * uses difference blending to invert whatever it passes over. It swells over controls, becomes
 * a caret over headlines, turns into a labelled lens on data-cursor="…", and stretches with speed.
 */
export function ExecCursor() {
  const [enabled] = useState(canUseCustomCursor);
  const [state, setState] = useState<CursorState>('default');
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const stateRef = useRef<CursorState>('default');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const press = useSpring(1, { stiffness: 600, damping: 24 });

  // Speed stretch from the raw pointer velocity, smoothed so it eases in and out.
  const stretchOn = useMotionValue(1);
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);
  const speed = useSpring(useTransform([velocityX, velocityY, stretchOn], ([vx, vy, on]: number[]) => Math.min(Math.hypot(vx, vy) / 2600, 0.45) * on), { stiffness: 500, damping: 40 });
  const angle = useTransform([velocityX, velocityY], ([vx, vy]: number[]) => (Math.hypot(vx, vy) > 60 ? Math.atan2(vy, vx) * (180 / Math.PI) : 0));
  const rotate = useTransform([angle, stretchOn], ([a, on]: number[]) => a * on);
  const scaleX = useTransform([speed, press], ([s, p]: number[]) => (1 + s) * p);
  const scaleY = useTransform([speed, press], ([s, p]: number[]) => (1 - s * 0.5) * p);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.dataset.execCursor = 'on';

    function resolve(target: EventTarget | null) {
      const element = target instanceof Element ? target : null;
      const labelled = element?.closest<HTMLElement>('[data-cursor]');
      const interactive = element?.closest(INTERACTIVE);
      // A control nested inside a labelled region keeps the plain link state.
      const nestedControl = interactive && labelled && interactive !== labelled && labelled.contains(interactive);
      let next: CursorState = 'default';
      if (labelled && !nestedControl) next = 'label';
      else if (interactive) next = 'link';
      else if (element?.closest(TEXT)) next = 'text';
      if (next !== stateRef.current) {
        stateRef.current = next;
        setState(next);
        stretchOn.set(next === 'default' ? 1 : 0);
      }
      if (next === 'label') setLabel(labelled?.dataset.cursor ?? '');
    }

    // Content can change under a still cursor (a sheet opening, the page scrolling),
    // so re-read whatever sits at the cursor's position at those moments.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const recheck = () => resolve(document.elementFromPoint(x.get(), y.get()));
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x.set(event.clientX); y.set(event.clientY);
      setVisible(true);
      resolve(event.target);
    };
    const leave = () => setVisible(false);
    const down = () => press.set(0.72);
    const up = () => {
      press.set(1);
      timers.push(setTimeout(recheck, 120), setTimeout(recheck, 900));
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('wheel', recheck, { passive: true, capture: true });
    window.addEventListener('keyup', recheck);
    root.addEventListener('pointerleave', leave);
    return () => {
      delete root.dataset.execCursor;
      timers.forEach(clearTimeout);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('wheel', recheck, { capture: true });
      window.removeEventListener('keyup', recheck);
      root.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y, press, stretchOn]);

  if (!enabled) return null;

  return (
    <div className={`exec-cursor is-${state}${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <motion.div className="exec-cursor-anchor" style={{ x, y }}>
        <motion.div className="exec-cursor-stretch" style={{ scaleX, scaleY, rotate }}>
          <motion.div className="exec-cursor-blob" initial={false} animate={shapes[state]}
            transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.6 }} />
        </motion.div>
        <AnimatePresence>
          {state === 'label' && (
            <motion.span key={label} className="exec-cursor-label" initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.22, ease: EASE_OUT }}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
