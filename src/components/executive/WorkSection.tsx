import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { Section } from './Section';
import { WorkPreview } from './WorkPreview';
import { CaseStudy } from './CaseStudy';
import { workPresentation } from './workPresentation';
import { EASE_OUT } from './motionUtils';

/**
 * Projects as an editorial index. Rows never expand in place, so opening one can't
 * disturb its neighbours: details open in a dedicated case-study sheet instead.
 */
export function WorkSection() {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  function open(id: string, trigger: HTMLElement) {
    returnFocus.current = trigger;
    setHovered(null);
    setOpenId(id);
  }

  return (
    <Section id="work" index="01" eyebrow="Work" title="Selected work"
      intro="Practical systems for real workflows. Built from the database to the details. Open any project for the full case study.">
      <ol className="work-index" onPointerLeave={() => setHovered(null)}>
        {projectsData.map((project, index) => {
          const display = workPresentation(project);
          return (
            <motion.li key={project.id} className="work-index-item"
              initial={reducedMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: (index % 3) * 0.06 }}>
              <button className="work-row" data-cursor="Open" aria-haspopup="dialog"
                style={{ '--project-tone': project.thumbnailGradient } as never}
                onPointerEnter={() => setHovered(project.id)} onFocus={() => setHovered(null)}
                onClick={(event) => open(project.id, event.currentTarget)}>
                <span className="work-row-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="work-row-main">
                  <motion.span className="work-row-title" layoutId={`case-title-${project.id}`}>{display.title}</motion.span>
                  <span className="work-row-description">{display.description}</span>
                </span>
                <span className="work-row-meta">
                  <span>{project.category}</span>
                  <span>{project.technical.techStack.slice(0, 2).join(' · ')}</span>
                </span>
                <span className="work-row-arrow" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.5} /></span>
              </button>
            </motion.li>
          );
        })}
      </ol>
      <WorkPreview projectId={openId ? null : hovered} />
      <CaseStudy projectId={openId} onNavigate={setOpenId}
        onClose={() => { setOpenId(null); requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true })); }} />
    </Section>
  );
}
