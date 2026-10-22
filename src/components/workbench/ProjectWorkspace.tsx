import { ArrowUpRight, Check, Code2, GitBranch, Layers3 } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { presentationFor } from './workbenchData';
import { ArchitecturePane } from './ArchitecturePane';
import { SourcePane } from './SourcePane';

export type ProjectLens = 'overview' | 'architecture' | 'source';
interface ProjectWorkspaceProps { project: Project; lens: ProjectLens; onLens: (lens: ProjectLens) => void }

export function ProjectWorkspace({ project, lens, onLens }: ProjectWorkspaceProps) {
  const display = presentationFor(project.id);
  const Icon = display.icon;
  return (
    <div className={`wb-project-workspace${lens === 'source' ? ' is-source' : ''}`}>
      <header className="wb-project-header">
        <span className="wb-project-symbol" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
        <div className="wb-project-title-row"><div><h1>{display.name}<span className="wb-project-kind">{display.kind}</span></h1><p>{display.description}.</p></div>
          {project.links.github && <a className="wb-button wb-button-secondary wb-repository-link" href={project.links.github} target="_blank" rel="noopener noreferrer"><GitBranch size={15} /><span>Repository</span><ArrowUpRight size={14} /></a>}
        </div>
      </header>
      <div className="wb-project-tabs" role="tablist" aria-label="Project perspective">
        {(['overview', 'architecture', 'source'] as const).map((tab, index, tabs) => (
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
          </button>
        ))}
      </div>
      <div className="wb-project-panel" id="wb-project-panel" role="tabpanel" aria-labelledby={`wb-tab-${lens}`} tabIndex={0}>
        {lens === 'source' ? <SourcePane key={project.id} project={project} /> : lens === 'architecture' ? <ArchitecturePane key={project.id} project={project} onInspect={() => onLens('source')} /> : (
          <div className="wb-overview" key={project.id}>
            <div className="wb-project-intro"><span className="wb-caption">The project</span><h2>{project.tagline}</h2></div>
            <div className="wb-overview-story">
              <section><h3>The problem</h3><p>{project.executive.businessChallenge}</p></section>
              <section><h3>The approach</h3><p>{project.executive.strategicSolution}</p></section>
            </div>
            <section className="wb-project-outcomes"><h3>What changed</h3><ul>{project.executive.quantifiableImpact.map((impact) => <li key={impact}><Check size={15} strokeWidth={1.8} /><span>{impact}</span></li>)}</ul></section>
            <div className="wb-project-next"><div><Code2 size={20} strokeWidth={1.5} /><div><h3>Curious about the implementation?</h3><p>Explore the layers or go straight to the source.</p></div></div><button className="wb-button wb-button-primary" onClick={() => onLens('architecture')}>Explore architecture <ArrowUpRight size={15} /></button></div>
          </div>
        )}
      </div>
    </div>
  );
}
