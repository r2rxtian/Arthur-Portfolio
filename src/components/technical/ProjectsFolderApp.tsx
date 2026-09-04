import React from 'react';
import { ExternalLink, Code2, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { projectsData } from '../../data/projects';
import { useOS } from '../../context/OSContext';

export const ProjectsFolderApp: React.FC = () => {
  const { openWindow } = useOS();

  return (
    <div className="explorer-container">
      {projectsData.map((project) => (
        <div key={project.id} className="explorer-card">
          <div
            style={{
              height: 48,
              borderRadius: 8,
              background: project.thumbnailGradient,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <Sparkles size={16} style={{ marginRight: 8 }} />
            <span>{project.title}</span>
          </div>

          <div className="explorer-card-header">
            <span className="explorer-card-badge">{project.category}</span>
          </div>

          <p className="explorer-card-desc">{project.tagline}</p>

          <div className="explorer-card-tech">
            {project.technical.techStack.map((tech) => (
              <span key={tech} className="explorer-tech-tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="explorer-card-actions">
            <button
              onClick={() => openWindow('ide')}
              className="explorer-btn explorer-btn-primary"
              title="Inspect code in Mock IDE"
            >
              <Code2 size={14} />
              <span>Inspect Code</span>
            </button>

            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-btn explorer-btn-secondary"
                title="View GitHub Repository"
              >
                <GithubIcon size={14} />
                <span>Repo</span>
              </a>
            )}

            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-btn explorer-btn-secondary"
                title="Open Live Deployment"
              >
                <ExternalLink size={14} />
                <span>Demo</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
