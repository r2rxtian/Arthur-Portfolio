import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, Check, Code2, GitBranch, Layers3 } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { presentationFor } from './workbenchData';
import { ArchitecturePane } from './ArchitecturePane';
import { SourcePane } from './SourcePane';
import { WB_EASE } from './motion';
import { useContainerMomentum } from '../../hooks/useMomentum';

export type ProjectLens = 'overview' | 'architecture' | 'source';
interface ProjectWorkspaceProps { project: Project; lens: ProjectLens; onLens: (lens: ProjectLens) => void }
const lenses = ['overview', 'architecture', 'source'] as const;

// Lens panels slide in the direction of travel along the tab strip.
const panel: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28, filter: 'blur(3px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: WB_EASE } },
  exit: (direction: number) => ({ opacity: 0, x: direction * -20, filter: 'blur(3px)', transition: { duration: 0.2, ease: 'easeIn' } }),
};
const rise: Variants = {
  enter: { opacity: 0, y: 14 },
  center: (index: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: WB_EASE, delay: 0.08 + index * 0.06 } }),
};

export function ProjectWorkspace({ project, lens, onLens }: ProjectWorkspaceProps) {
  const reducedMotion = useReducedMotion();
  const display = presentationFor(project.id);
  const Icon = display.icon;
  const [travel, setTravel] = useState({ lens, direction: 1 });
  if (travel.lens !== lens) setTravel({ lens, direction: lenses.indexOf(lens) > lenses.indexOf(travel.lens) ? 1 : -1 });
  const direction = travel.direction;

  // The panel scrolls with momentum and starts at the top for each project and lens.
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const resetScroll = useContainerMomentum(panelRef, panelContentRef, true);
  useEffect(() => { resetScroll(); }, [project.id, lens]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`wb-project-workspace${lens === 'source' ? ' is-source' : ''}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.header key={project.id} className="wb-project-header"
          initial={reducedMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.35, ease: WB_EASE }}>
          <motion.span className="wb-project-symbol" aria-hidden="true" initial={reducedMotion ? false : { rotate: -90, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
            <Icon size={20} strokeWidth={1.5} />
          </motion.span>
          <div className="wb-project-title-row"><div><h1>{display.name}<span className="wb-project-kind">{display.kind}</span></h1><p>{display.description}.</p></div>
            {project.links.github && <a className="wb-button wb-button-secondary wb-repository-link" href={project.links.github} target="_blank" rel="noopener noreferrer"><GitBranch size={15} /><span>Repository</span><ArrowUpRight size={14} /></a>}
          </div>
        </motion.header>
      </AnimatePresence>
      <div className="wb-project-tabs" role="tablist" aria-label="Project perspective">
        {lenses.map((tab, index, tabs) => (
          <button key={tab} id={`wb-tab-${tab}`} role="tab" aria-selected={lens === tab} aria-controls="wb-project-panel" tabIndex={lens === tab ? 0 : -1}
            onClick={() => onLens(tab)} onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
              onLens(tabs[next]);
              requestAnimationFrame(() => document.getElementById(`wb-tab-${tabs[next]}`)?.focus());
            }}>
            {tab === 'overview' ? <Layers3 size={15} /> : tab === 'architecture' ? <GitBranch size={15} /> : <Code2 size={15} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {lens === tab && <motion.span className="wb-tab-indicator" layoutId="wb-tab-indicator" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          </button>
        ))}
      </div>
      <div ref={panelRef} className="wb-project-panel" id="wb-project-panel" role="tabpanel" aria-labelledby={`wb-tab-${lens}`} tabIndex={0}>
        <div ref={panelContentRef} className="wb-panel-content">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={`${project.id}-${lens}`} className="wb-lens" custom={direction} variants={reducedMotion ? undefined : panel}
            initial="enter" animate="center" exit="exit">
            {lens === 'source' ? <SourcePane project={project} /> : lens === 'architecture' ? <ArchitecturePane project={project} onInspect={() => onLens('source')} /> : (
              <div className="wb-overview">
                <motion.div className="wb-project-intro" variants={rise} custom={0}><span className="wb-caption">The project</span><h2>{project.tagline}</h2></motion.div>
                <div className="wb-overview-story">
                  <motion.section variants={rise} custom={1}><h3><span className="wb-step">01</span>The problem</h3><p>{project.executive.businessChallenge}</p></motion.section>
                  <motion.section variants={rise} custom={2}><h3><span className="wb-step">02</span>The approach</h3><p>{project.executive.strategicSolution}</p></motion.section>
                </div>
                <motion.section className="wb-project-outcomes" variants={rise} custom={3}><h3>What changed</h3><ul>{project.executive.quantifiableImpact.map((impact) => <li key={impact}><Check size={15} strokeWidth={1.8} /><span>{impact}</span></li>)}</ul></motion.section>
                <motion.div className="wb-project-next" variants={rise} custom={4}><div><Code2 size={20} strokeWidth={1.5} /><div><h3>Curious about the implementation?</h3><p>Explore the layers or go straight to the source.</p></div></div><button className="wb-button wb-button-primary" onClick={() => onLens('architecture')}>Explore architecture <ArrowUpRight size={15} /></button></motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
