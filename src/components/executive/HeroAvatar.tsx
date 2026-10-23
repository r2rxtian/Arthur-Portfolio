import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import profileImg from '../../assets/profile.png';
import { profileData } from '../../data/profile';
import { EASE_OUT } from './motionUtils';
import { subscribePointer } from './pointer';

export function HeroAvatar() {
  const portraitRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ['start start', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const imageY = useTransform(progress, [0, 1], [0, 36]);

  // Tilt follows the cursor anywhere on screen (relative to the portrait's centre), so it never
  // snaps back at the photo's edge; it just leans less as the cursor heads away.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltSpring = { stiffness: 70, damping: 18, mass: 0.8 };
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [9, -9]), tiltSpring);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-12, 12]), tiltSpring);
  const sheenX = useTransform(rotateY, [-12, 12], ['10%', '90%']);
  const sheenY = useTransform(rotateX, [9, -9], ['0%', '60%']);

  useEffect(() => {
    if (reducedMotion) return;
    return subscribePointer(({ x, y, active }) => {
      const frame = frameRef.current;
      if (!frame || !active) { pointerX.set(0); pointerY.set(0); return; }
      const bounds = frame.getBoundingClientRect();
      const clamp = (value: number) => Math.max(-1, Math.min(1, value));
      pointerX.set(clamp((x - (bounds.left + bounds.width / 2)) / (innerWidth * 0.5)));
      pointerY.set(clamp((y - (bounds.top + bounds.height / 2)) / (innerHeight * 0.5)));
    });
  }, [reducedMotion, pointerX, pointerY]);

  return (
    <figure ref={portraitRef} className="exec-portrait">
      <motion.div ref={frameRef} className="exec-portrait-frame" data-cursor="Hello"
        style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}>
        <motion.div className="exec-portrait-image"
          initial={reducedMotion ? false : { clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
          transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.25 }}>
          <motion.img src={profileImg} alt={profileData.name} width={400} height={400}
            loading="eager" fetchPriority="high"
            initial={reducedMotion ? false : { scale: 1.25 }} animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.25 }}
            style={{ y: reducedMotion ? 0 : imageY }} />
          <motion.span className="exec-portrait-sheen" aria-hidden="true" style={{ '--sheen-x': sheenX, '--sheen-y': sheenY } as never} />
        </motion.div>
      </motion.div>
      <motion.figcaption initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 }}>
        <span>{profileData.name}</span>
        <span>{profileData.title}</span>
      </motion.figcaption>
    </figure>
  );
}
