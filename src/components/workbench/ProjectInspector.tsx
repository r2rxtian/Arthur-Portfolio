import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, FileCode2, X } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { presentationFor } from './workbenchData';
import { WB_EASE } from './motion';

export function ProjectInspector({ project, onClose, onSource }: { project: Project; onClose: () => void; onSource: () => void }) {
  const reducedMotion = useReducedMotion();
  // Phones show the brief as a bottom sheet, so it rises; elsewhere it slides in from the right.
  const [asSheet] = useState(() => matchMedia('(max-width: 639px)').matches);
  const item = (index: number) => ({
    initial: reducedMotion ? false as const : { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: WB_EASE, delay: 0.05 + index * 0.05 },
  });
  return (
    <motion.aside className="wb-inspector" aria-label="Selected project details"
      initial={reducedMotion ? false : asSheet ? { opacity: 0, y: 60 } : { opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.45, ease: WB_EASE }}>
      <div className="wb-inspector-heading"><span>Project brief</span><button className="wb-icon-button" onClick={onClose} aria-label="Close project brief"><X size={16} /></button></div>
      <div className="wb-inspector-content" key={project.id}>
        <motion.div className="wb-inspector-project" {...item(0)}><span className="wb-caption">Selected project</span><h2>{presentationFor(project.id).name}</h2><p>{project.category}</p></motion.div>
        <motion.section {...item(1)}><h3>My role</h3><p>{project.executive.role}</p></motion.section>
        <motion.section {...item(2)}><h3>Built with</h3><ul className="wb-inspector-stack">{project.technical.techStack.map((tech) => <li key={tech}><i aria-hidden="true" />{tech}</li>)}</ul></motion.section>
        <motion.section {...item(3)}><h3>Implementation</h3><div className="wb-inspector-file"><FileCode2 size={17} /><span>{project.technical.codeSnippet.filename.split('/').at(-1)}<small>{project.technical.codeSnippet.language}</small></span></div>
          <button className="wb-inline-action" onClick={onSource}><Code2 size={14} /> Inspect source</button>
        </motion.section>
        <motion.div className="wb-inspector-note" {...item(4)}><p>The overview, architecture, and source all follow this project.</p></motion.div>
      </div>
    </motion.aside>
  );
}
