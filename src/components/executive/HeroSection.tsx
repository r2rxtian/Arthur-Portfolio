import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { profileData } from '../../data/profile';
import { HeroAvatar } from './HeroAvatar';
import { ScrollReveal } from './ScrollReveal';

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reducedMotion ? false as const : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      type: 'spring' as const, stiffness: 110, damping: 24, delay: reducedMotion ? 0 : delay,
      opacity: { duration: reducedMotion ? 0 : 0.45 },
    },
  });
  return (
    <>
      <section className="exec-hero" id="overview" aria-label="Introduction">
        <div className="exec-hero-copy">
          <motion.p className="exec-availability" {...enter(0)}>
            <span aria-hidden="true" /> Open to opportunities
          </motion.p>
          <motion.h1 className="exec-hero-title" {...enter(0.06)}>
            Thoughtful code.<br /><span>Practical impact.</span>
          </motion.h1>
          <motion.p className="exec-hero-pitch" {...enter(0.12)}>
            I'm Arthur, a computer science graduate building practical software through full-stack development, automation, and user-focused design.
          </motion.p>
          <motion.div className="exec-hero-actions" {...enter(0.18)}>
            <motion.a href="#work" className="exec-btn exec-btn-primary" whileTap={{ scale: 0.97 }}>
              Explore Work <ArrowDown size={16} />
            </motion.a>
            <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer" className="exec-text-link">
              GitHub <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>
        <HeroAvatar />
      </section>
      <ScrollReveal className="exec-metrics" aria-label="Engineering impact" distance={12}>
        {profileData.metrics.map((metric) => (
          <div key={metric.label} className="exec-metric">
            <span className="exec-metric-value">{metric.value}</span>
            <span className="exec-metric-label">{metric.label}</span>
          </div>
        ))}
      </ScrollReveal>
    </>
  );
}
