import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 32,
  className = '',
  viewportMargin = '-50px',
  once = true,
  style,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0 };
      case 'down':
        return { opacity: 0, y: -distance, x: 0 };
      case 'left':
        return { opacity: 0, x: distance, y: 0 };
      case 'right':
        return { opacity: 0, x: -distance, y: 0 };
      case 'scale':
        return { opacity: 0, scale: 0.95, y: 0, x: 0 };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance, x: 0 };
    }
  };

  const getTargetPosition = () => {
    switch (direction) {
      case 'scale':
        return { opacity: 1, scale: 1, y: 0, x: 0 };
      default:
        return { opacity: 1, y: 0, x: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getTargetPosition()}
      viewport={{ once, margin: viewportMargin as any }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
