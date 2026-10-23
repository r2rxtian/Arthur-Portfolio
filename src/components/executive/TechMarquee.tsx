import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion';
import { projectsData } from '../../data/projects';

// Every technology that actually ships in a project, in order of first appearance.
const items = [...new Set(projectsData.flatMap((project) => project.technical.techStack))];

/** A drifting stack strip. Scrolling speeds it up and flips its direction, then it eases back to cruise. */
export function TechMarquee() {
  const reducedMotion = useReducedMotion();
  const offset = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    const extra = boost.get();
    if (extra < 0) direction.current = -1;
    else if (extra > 0) direction.current = 1;
    offset.set(offset.get() - direction.current * (delta / 1000) * (1.6 + Math.abs(extra)));
  });

  return (
    <div className="exec-marquee" aria-hidden="true" data-cursor="Scroll">
      <motion.div className="exec-marquee-track" style={{ x }}>
        {[...items, ...items].map((item, index) => (
          <span key={index} className="exec-marquee-item">{item}<i /></span>
        ))}
      </motion.div>
    </div>
  );
}
