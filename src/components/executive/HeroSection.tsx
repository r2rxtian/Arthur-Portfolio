import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { profileData } from '../../data/profile';
import { HeroAvatar } from './HeroAvatar';
import { ScrollReveal } from './ScrollReveal';
import { CountUp, Magnetic, MaskText, Roll } from './motion';
import { EASE_OUT, useSpotlight } from './motionUtils';

const clockFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' });

/** Arthur's local time; the colon blinks so the strip reads as live. */
function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);
  const [hours, minutes] = clockFormat.format(now).split(':');
  return <time dateTime={now.toISOString()}>{hours}<span className="exec-clock-colon">:</span>{minutes}</time>;
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const heroSpotlight = useSpotlight<HTMLElement>(420);
  const enter = (delay: number) => ({
    initial: reducedMotion ? false as const : { opacity: 0, y: 18, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
    transition: { duration: reducedMotion ? 0 : 0.9, ease: EASE_OUT, delay: reducedMotion ? 0 : delay },
  });
  return (
    <>
      <section className="exec-hero" id="overview" aria-label="Introduction" ref={heroSpotlight}>
        <div className="exec-hero-glow" aria-hidden="true" />
        <motion.dl className="exec-hero-meta" {...enter(0.8)}>
          <div><dt>Based in</dt><dd>{profileData.location.split(',').slice(0, 2).join(',')}</dd></div>
          <div><dt>Local time</dt><dd><LocalClock /> PHT</dd></div>
          <div><dt>Currently</dt><dd>{profileData.title}</dd></div>
          <div><dt>Studying</dt><dd>BS Computer Science</dd></div>
        </motion.dl>
        <div className="exec-hero-copy">
          <motion.p className="exec-availability" {...enter(0)}>
            <span aria-hidden="true" /> Open to opportunities
          </motion.p>
          <h1 className="exec-hero-title">
            <MaskText text="Thoughtful code." immediate delay={0.1} />
            <MaskText text="Practical impact." immediate delay={0.3} className="exec-hero-accent" />
          </h1>
          <motion.p className="exec-hero-pitch" {...enter(0.55)}>
            {profileData.executivePitch}
          </motion.p>
          <motion.div className="exec-hero-actions" {...enter(0.68)}>
            <Magnetic>
              <motion.a href="#work" className="exec-btn exec-btn-primary" whileTap={{ scale: 0.96 }}>
                <Roll>Explore work</Roll> <ArrowDown size={16} className="exec-bounce" />
              </motion.a>
            </Magnetic>
            <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer" className="exec-text-link exec-underline-link">
              GitHub <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>
        <HeroAvatar />
      </section>
      <ScrollReveal className="exec-metrics" aria-label="Portfolio at a glance" distance={16}>
        {profileData.metrics.map((metric) => (
          <div key={metric.label} className="exec-metric">
            <CountUp value={metric.value} className="exec-metric-value" />
            <span className="exec-metric-label">{metric.label}</span>
            <span className="exec-metric-subtext">{metric.subtext}</span>
          </div>
        ))}
      </ScrollReveal>
    </>
  );
}
