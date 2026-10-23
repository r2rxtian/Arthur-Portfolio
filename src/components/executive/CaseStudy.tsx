import { useEffect, useMemo, useRef, useState, type UIEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { projectsData } from '../../data/projects';
import type { Project } from '../../types/portfolio';
import { highlight } from '../workbench/highlight';
import { workPresentation } from './workPresentation';
import { EASE_OUT } from './motionUtils';
import { useContainerMomentum } from '../../hooks/useMomentum';

const SHEET_EASE = [0.76, 0, 0.24, 1] as const;

interface CaseStudyProps { projectId: string | null; onClose: () => void; onNavigate: (id: string) => void }

/**
 * Full case study in a sheet that rises over the page. The project title travels from its
 * index row into the sheet (shared layoutId), and the rest of the page is made inert while open.
 */
export function CaseStudy({ projectId, onClose, onNavigate }: CaseStudyProps) {
  const reducedMotion = useReducedMotion();
  const index = projectsData.findIndex((project) => project.id === projectId);
  const project = index >= 0 ? projectsData[index] : null;
  const previous = projectsData[(index - 1 + projectsData.length) % projectsData.length];
  const next = projectsData[(index + 1) % projectsData.length];
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [solidToolbar, setSolidToolbar] = useState(false);
  const isOpen = project !== null;

  // Remember which project the sheet was opened from: only that title shares a layoutId with
  // its index row. Otherwise next/previous would fly titles in from the list behind the sheet.
  const [session, setSession] = useState<{ open: boolean; origin: string | null }>({ open: false, origin: null });
  if (session.open !== isOpen) setSession({ open: isOpen, origin: isOpen ? projectId : session.origin });

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const hero = element.querySelector<HTMLElement>('.case-hero');
    progress.set(element.scrollTop / Math.max(1, element.scrollHeight - element.clientHeight));
    // The toolbar floats over the cover, then turns solid once the cover has scrolled away.
    const solid = element.scrollTop > (hero?.offsetHeight ?? 400) - 76;
    if (solid !== solidToolbar) setSolidToolbar(solid);
  }

  // Lock page scroll and take the page out of the tab order while the sheet is open.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const page = document.querySelector<HTMLElement>('.exec-container');
    const toggle = document.querySelector<HTMLElement>('.perspective-toggle-wrapper');
    root.classList.add('is-sheet-open');
    page?.setAttribute('inert', '');
    toggle?.setAttribute('inert', '');
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.classList.remove('is-sheet-open');
      page?.removeAttribute('inert');
      toggle?.removeAttribute('inert');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      // Leave arrow keys alone inside the code block, where they scroll horizontally.
      if ((event.target as HTMLElement | null)?.closest('pre')) return;
      if (event.key === 'ArrowRight') onNavigate(next.id);
      if (event.key === 'ArrowLeft') onNavigate(previous.id);
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [isOpen, next.id, previous.id, onClose, onNavigate]);

  // The sheet glides with its own momentum; each project opens at the top.
  const resetScroll = useContainerMomentum(scrollRef, contentRef, isOpen);
  useEffect(() => { resetScroll(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  return createPortal(
    <AnimatePresence>
      {project && (
        // data-lenis-prevent: the page's momentum scroller leaves the overlay alone.
        <motion.div key="case" className="case-layer" data-lenis-prevent initial="closed" animate="open" exit="closed">
          <motion.div className="case-backdrop" onClick={onClose}
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }} transition={{ duration: 0.5 }} />
          <motion.div className="case-sheet" role="dialog" aria-modal="true" aria-labelledby="case-title"
            variants={{ closed: { y: reducedMotion ? 0 : '104%', opacity: reducedMotion ? 0 : 1 }, open: { y: 0, opacity: 1 } }}
            transition={{ duration: reducedMotion ? 0.2 : 0.8, ease: SHEET_EASE }}>
            <div className={`case-toolbar${solidToolbar ? ' is-solid' : ''}`}>
              <span className="case-counter">{String(index + 1).padStart(2, '0')} <i>/</i> {String(projectsData.length).padStart(2, '0')}
                <span className="case-counter-title">{workPresentation(project).title}</span>
              </span>
              <div className="case-toolbar-actions">
                <button className="case-icon-button" onClick={() => onNavigate(previous.id)} aria-label={`Previous project: ${workPresentation(previous).title}`}><ArrowLeft size={18} /></button>
                <button className="case-icon-button" onClick={() => onNavigate(next.id)} aria-label={`Next project: ${workPresentation(next).title}`}><ArrowRight size={18} /></button>
                <button ref={closeRef} className="case-icon-button case-close" onClick={onClose} aria-label="Close case study"><X size={18} /></button>
              </div>
              <motion.span className="case-progress" style={{ scaleX: progress }} aria-hidden="true" />
            </div>
            {/* Native scrollbar is hidden (the progress line replaces it) so the cover runs edge to edge. */}
            <div className="case-scroll" ref={scrollRef} onScroll={handleScroll}>
              {/* No exit animation: the next project swaps in immediately, so the sheet never blanks. */}
              <div ref={contentRef}>
                <CaseBody key={project.id} project={project} next={next} shared={project.id === session.origin}
                  onNext={() => onNavigate(next.id)} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

interface CaseBodyProps { project: Project; next: Project; shared: boolean; onNext: () => void }

function CaseBody({ project, next, shared, onNext }: CaseBodyProps) {
  const display = workPresentation(project);
  const Icon = display.icon;
  const lines = useMemo(() => highlight(project.technical.codeSnippet.code, project.technical.codeSnippet.language), [project]);
  // On first open the sheet is still rising, so content waits for it; when paging between
  // projects the sheet is already up, so content follows almost immediately.
  const base = shared ? 0.3 : 0.04;
  const rise = (order: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: base + order * 0.05 } },
  });

  return (
    <article className="case-body">
      {/* Every cover shares one frame: ink base, fixed height, the project's colour as a glow. */}
      <header className="case-hero" style={{ '--project-tone': project.thumbnailGradient } as never}>
        <motion.span className="case-hero-tone" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }} />
        <motion.div className="case-hero-art" aria-hidden="true" initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.9, ease: EASE_OUT, delay: base }}>
          <Icon size={168} strokeWidth={0.6} />
        </motion.div>
        <div className="case-hero-copy">
          <motion.p className="case-kicker" {...rise(0)}>{project.category} <i>·</i> {project.executive.role}</motion.p>
          {shared
            ? <motion.h2 id="case-title" className="case-title" layoutId={`case-title-${project.id}`}>{display.title}</motion.h2>
            : <motion.h2 id="case-title" className="case-title" {...rise(0)}>{display.title}</motion.h2>}
          <motion.p className="case-tagline" {...rise(1)}>{project.tagline}</motion.p>
        </div>
      </header>

      <div className="case-grid">
        <div className="case-story">
          <motion.section {...rise(2)}><h3><span>01</span>The problem</h3><p>{project.executive.businessChallenge}</p></motion.section>
          <motion.section {...rise(3)}><h3><span>02</span>The approach</h3><p>{project.executive.strategicSolution}</p></motion.section>
          <motion.section {...rise(4)}><h3><span>03</span>What changed</h3>
            <ul className="case-results">{project.executive.quantifiableImpact.map((impact) => <li key={impact}><Check size={16} strokeWidth={2} /><span>{impact}</span></li>)}</ul>
          </motion.section>
        </div>
        <motion.aside className="case-aside" {...rise(3)}>
          <div><h4>Role</h4><p>{project.executive.role}</p></div>
          <div><h4>Stack</h4><ul className="case-stack">{project.technical.techStack.map((tech) => <li key={tech}>{tech}</li>)}</ul></div>
          {(project.links.github || project.links.demo || project.links.docs) && <div><h4>Links</h4>
            {project.links.github && <a className="case-link" href={project.links.github} target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={15} /></a>}
            {project.links.demo && <a className="case-link" href={project.links.demo} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={15} /></a>}
            {project.links.docs && <a className="case-link" href={project.links.docs} target="_blank" rel="noopener noreferrer">Documentation <ArrowUpRight size={15} /></a>}
          </div>}
        </motion.aside>
      </div>

      <motion.section className="case-architecture" {...rise(5)}>
        <h3><span>04</span>Under the hood</h3>
        <p>{project.technical.architecture}</p>
        <ol className="case-features">{project.technical.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ol>
      </motion.section>

      <motion.section className="case-code" {...rise(6)}>
        <div className="case-code-bar"><span><i /><i /><i /></span><code>{project.technical.codeSnippet.filename}</code><small>{project.technical.codeSnippet.language}</small></div>
        <pre tabIndex={0} aria-label={`${project.technical.codeSnippet.filename} excerpt`}><code>{lines.map((tokens, line) => (
          <span key={line} className="case-code-line"><span className="case-code-number" aria-hidden="true">{line + 1}</span>
            {tokens.map((token, part) => token.type === 'plain' ? token.text : <span key={part} className={`tok-${token.type}`}>{token.text}</span>)}
          </span>
        ))}</code></pre>
      </motion.section>

      <button className="case-next" onClick={onNext} data-cursor="Next">
        <span className="case-next-label">Next project</span>
        <span className="case-next-title">{workPresentation(next).title}</span>
        <ArrowRight size={34} strokeWidth={1.2} />
      </button>
    </article>
  );
}
