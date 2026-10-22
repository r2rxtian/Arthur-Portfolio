import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  viewportMargin?: NonNullable<HTMLMotionProps<'div'>['viewport']>['margin'];
  once?: boolean;
}

/** Small, one-time reveals; scrolling stays directly connected to input. */
export function ScrollReveal({
  children, direction = 'up', delay = 0, duration = 0.7, distance = 20,
  viewportMargin = '0px 0px -24px 0px', once = true, ...props
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const travel = Math.min(distance, 24);
  const x = direction === 'left' ? travel : direction === 'right' ? -travel : 0;
  const y = direction === 'up' ? travel : direction === 'down' ? -travel : 0;
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x, y, scale: direction === 'scale' ? 0.985 : 1 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: viewportMargin, amount: 'some' }}
      transition={{
        type: 'spring', stiffness: 110, damping: 24, mass: 1,
        delay: reducedMotion ? 0 : Math.min(delay, 0.12),
        opacity: { duration: reducedMotion ? 0 : Math.min(duration, 0.45), ease: 'easeOut' },
      }}
      {...props}
    >{children}</motion.div>
  );
}
export default ScrollReveal;
