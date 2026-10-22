import { ArrowUpRight, Box, ChevronDown, FileStack, MapPin, Search, Trophy, type LucideIcon } from 'lucide-react';
import type { Project } from '../../types/portfolio';

const presentation: Record<string, { title: string; description: string; icon: LucideIcon }> = {
  itms: { title: 'StockHub', description: 'Inventory that stays accountable.', icon: Box },
  'lost-and-found': { title: 'Lost & Found', description: 'A simpler path from lost to recovered.', icon: Search },
  'tennis-lms': { title: 'Tennis Academy', description: 'Structured learning, on and off the court.', icon: Trophy },
  dochubpr: { title: 'DocHubPR', description: 'Every document. Every revision.', icon: FileStack },
  qrs: { title: 'QR Task Check', description: 'Field inspections with a verifiable record.', icon: MapPin },
};

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const display = presentation[project.id];
  const Icon = display?.icon ?? Box;
  return (
    <article className={`work-card${featured ? ' work-card-featured' : ''}`}>
      <div className="work-card-overview">
        <div className="work-card-top">
          <div className="work-project-icon"><Icon size={24} strokeWidth={1.5} /></div>
          <span className="work-category">{project.category}</span>
        </div>
        <h3>{display?.title ?? project.title}</h3>
        <p className="work-short-description">{display?.description ?? project.tagline}</p>
        <p className="work-description">{project.executive.strategicSolution}</p>
        <div className="work-stack" aria-label="Core technologies">
          {project.technical.techStack.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}
        </div>
      </div>
      {featured && (
        <div className="work-featured-outcome">
          <span className="exec-caption">Built for accountability</span>
          <p>{project.executive.quantifiableImpact[0]}</p>
          <span className="work-featured-role">{project.executive.role}</span>
        </div>
      )}
      <div className="work-card-bottom">
        <details className="exec-disclosure">
          <summary>Project details <ChevronDown size={16} /></summary>
          <div className="exec-disclosure-body">
            <h4>{project.title.replaceAll('—', '-')}</h4>
            <p>{project.executive.businessChallenge}</p>
            <h4>Approach</h4>
            <p>{project.technical.architecture}</p>
            <h4>Results</h4>
            <ul>{project.executive.quantifiableImpact.map((impact) => <li key={impact}>{impact}</li>)}</ul>
            <h4>Full stack</h4>
            <p>{project.technical.techStack.join(', ')}</p>
            {!featured && <p className="exec-caption">{project.executive.role}</p>}
          </div>
        </details>
        <div className="work-links">
          {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer"
            className="exec-text-link" aria-label={`View ${display?.title ?? project.title} source code`}>
            Source code <ArrowUpRight size={15} />
          </a>}
          {project.links.demo && <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="exec-text-link">
            Live demo <ArrowUpRight size={15} />
          </a>}
        </div>
      </div>
    </article>
  );
}
