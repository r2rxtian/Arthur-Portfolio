import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import profileImg from '../../assets/profile.png';
import { profileData } from '../../data/profile';

export function HeroAvatar() {
  const portraitRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ['start start', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const imageY = useTransform(progress, [0, 1], [0, 22]);
  return (
    <motion.figure ref={portraitRef} className="exec-portrait"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 24, delay: reducedMotion ? 0 : 0.12 }}>
      <div className="exec-portrait-image">
        <motion.img src={profileImg} alt={profileData.name} width={400} height={400}
          loading="eager" fetchPriority="high" style={{ y: reducedMotion ? 0 : imageY }} />
      </div>
      <figcaption>
        <span>{profileData.name}</span>
        <span>{profileData.title}</span>
      </figcaption>
    </motion.figure>
  );
}
