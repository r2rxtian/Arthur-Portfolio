import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { EASE_OUT } from './motionUtils';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  viewportMargin?: NonNullable<HTMLMotionProps<'div'>['viewport']>['margin'];
  once?: boolean;
}

/** One-time reveals: a short rise that settles out of a soft focus. Scrolling itself is never hijacked. */
export function ScrollReveal({
  children, direction = 'up', delay = 0, duration = 0.9, distance = 28,
  viewportMargin = '0px 0px -10% 0px', once = true, ...props
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const travel = Math.min(distance, 36);
  const x = direction === 'left' ? travel : direction === 'right' ? -travel : 0;
  const y = direction === 'up' ? travel : direction === 'down' ? -travel : 0;
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x, y, scale: direction === 'scale' ? 0.96 : 1, filter: 'blur(6px)' }}
      // Drop the filter once settled: a lingering blur(0px) keeps a filter layer that makes hovers repaint more.
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once, margin: viewportMargin, amount: 'some' }}
      transition={{ duration: reducedMotion ? 0 : duration, ease: EASE_OUT, delay: reducedMotion ? 0 : Math.min(delay, 0.3) }}
      {...props}
    >{children}</motion.div>
  );
}
export default ScrollReveal;
