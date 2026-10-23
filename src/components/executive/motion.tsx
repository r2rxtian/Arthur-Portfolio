import { Fragment, useEffect, useId, useRef, useState, type ElementType, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { EASE_OUT } from './motionUtils';
import { subscribePointer } from './pointer';

interface MaskTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
  stagger?: number;
}

/** Words rise out of a clipped line, one after another. Screen readers get the plain sentence. */
export function MaskText({ text, as: Tag = 'span', className, delay = 0, immediate = false, stagger = 0.045 }: MaskTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reducedMotion = useReducedMotion();
  const shown = immediate || inView;
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="mask-word" aria-hidden="true">
            <motion.span
              className="mask-word-inner"
              initial={reducedMotion ? false : { y: '110%', rotate: 4 }}
              animate={shown ? { y: '0%', rotate: 0 } : undefined}
              transition={{ duration: 0.95, ease: EASE_OUT, delay: delay + index * stagger }}
            >{word}</motion.span>
          </span>
          {/* The gap lives outside the clipped box; trailing spaces inside an inline-block collapse. */}
          {index < words.length - 1 && <span aria-hidden="true"> </span>}
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * Expandable panel whose height animates open and closed. Each instance only grows its own
 * row (callers lay rows out in a single column), so neighbours never stretch with it.
 */
export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className={`exec-disclosure${open ? ' is-open' : ''}`}>
      <button className="exec-disclosure-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        <span>{label}</span><span className="exec-disclosure-icon" aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} className="exec-disclosure-panel"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.6, ease: EASE_OUT }, opacity: { duration: 0.35 } }}>
            <div className="exec-disclosure-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Hover text roll: the label slides up and an identical copy rolls in from below. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll-text">{children}</span>
      <span className="roll-text roll-copy" aria-hidden="true">{children}</span>
    </span>
  );
}

/** Counts up to a numeric value the first time it is seen; non-numeric values render as-is. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const target = /^\d+$/.test(value) ? Number(value) : null;
  const [display, setDisplay] = useState(target === null || reducedMotion ? value : '0');

  useEffect(() => {
    if (!inView || target === null || reducedMotion) return;
    const controls = animate(0, target, { duration: 1.4, ease: EASE_OUT, onUpdate: (latest) => setDisplay(String(Math.round(latest))) });
    return () => controls.stop();
  }, [inView, target, reducedMotion]);

  return <span ref={ref} className={className}>{display}</span>;
}

interface MagneticProps { children: ReactNode; strength?: number; radius?: number; className?: string }

/**
 * Pulls its content toward the cursor. The field reaches `radius` px beyond the element and
 * weakens smoothly with distance, so there is no edge where the pull suddenly cuts out.
 */
export function Magnetic({ children, strength = 0.32, radius = 110, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const spring = { stiffness: 150, damping: 15, mass: 0.6 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  // Exposed as CSS variables so the button's label/icon can drift further than the button itself.
  const innerX = useTransform(x, (value) => `${(value * 0.4).toFixed(2)}px`);
  const innerY = useTransform(y, (value) => `${(value * 0.4).toFixed(2)}px`);

  useEffect(() => {
    if (reducedMotion) return;
    return subscribePointer(({ x: pointerX, y: pointerY, active }) => {
      const element = ref.current;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      // Measure from the resting centre, not the already-displaced one.
      const deltaX = pointerX - (bounds.left + bounds.width / 2 - x.get());
      const deltaY = pointerY - (bounds.top + bounds.height / 2 - y.get());
      const core = Math.max(bounds.width, bounds.height) / 2;
      const distance = Math.hypot(deltaX, deltaY);
      const falloff = active ? Math.min(1, Math.max(0, (core + radius - distance) / radius)) : 0;
      const eased = falloff * falloff * (3 - 2 * falloff); // smoothstep
      x.set(deltaX * strength * eased);
      y.set(deltaY * strength * eased);
    });
  }, [reducedMotion, radius, strength, x, y]);

  return (
    <motion.span ref={ref} className={`magnetic${className ? ` ${className}` : ''}`}
      style={{ x, y, '--mag-x': innerX, '--mag-y': innerY } as never}>
      {children}
    </motion.span>
  );
}

/** Children marked with StaggerItem enter in sequence once the group scrolls into view. */
export function Stagger({ children, gap = 0.06, ...props }: HTMLMotionProps<'div'> & { gap?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: gap } } }}
      {...props}
    >{children}</motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<'span'>) {
  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
        shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_OUT }, transitionEnd: { filter: 'none' } },
      }}
      {...props}
    >{children}</motion.span>
  );
}
