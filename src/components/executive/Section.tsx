import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { MaskText } from './motion';

interface SectionProps { id: string; index: string; eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }

/**
 * Editorial split section: the heading column stays pinned while the content scrolls past it.
 * The oversized index numeral fills with the accent colour as the reader moves through the section.
 */
export function Section({ id, index, eyebrow, title, intro, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="exec-section exec-split" id={id} aria-labelledby={`${id}-heading`}>
      <header className="exec-split-head">
        <div className="exec-split-sticky">
          <motion.span className="exec-split-index" aria-hidden="true" style={{ '--fill': fill } as never}>{index}</motion.span>
          <ScrollReveal distance={10} className="exec-eyebrow"><span>{index}</span>{eyebrow}</ScrollReveal>
          <h2 id={`${id}-heading`}><MaskText text={title} /><span className="exec-dot" aria-hidden="true">.</span></h2>
          {intro && <ScrollReveal delay={0.15}><p className="exec-split-intro">{intro}</p></ScrollReveal>}
        </div>
      </header>
      <div className="exec-split-body">{children}</div>
    </section>
  );
}
