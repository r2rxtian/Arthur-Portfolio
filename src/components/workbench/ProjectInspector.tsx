import { Code2, FileCode2, X } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { presentationFor } from './workbenchData';

export function ProjectInspector({ project, onClose, onSource }: { project: Project; onClose: () => void; onSource: () => void }) {
  return (
    <aside className="wb-inspector" aria-label="Selected project details">
      <div className="wb-inspector-heading"><span>Project brief</span><button className="wb-icon-button" onClick={onClose} aria-label="Close project brief"><X size={16} /></button></div>
      <div className="wb-inspector-content">
        <div className="wb-inspector-project"><span className="wb-caption">Selected project</span><h2>{presentationFor(project.id).name}</h2><p>{project.category}</p></div>
        <section><h3>My role</h3><p>{project.executive.role}</p></section>
        <section><h3>Built with</h3><ul className="wb-inspector-stack">{project.technical.techStack.map((tech) => <li key={tech}>{tech}</li>)}</ul></section>
        <section><h3>Implementation</h3><div className="wb-inspector-file"><FileCode2 size={17} /><span>{project.technical.codeSnippet.filename.split('/').at(-1)}<small>{project.technical.codeSnippet.language}</small></span></div>
          <button className="wb-inline-action" onClick={onSource}><Code2 size={14} /> Inspect source</button>
        </section>
        <div className="wb-inspector-note"><p>The overview, architecture, and source all follow this project.</p></div>
      </div>
    </aside>
  );
}
