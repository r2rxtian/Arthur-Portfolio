import React from 'react';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { projectsData } from '../../data/projects';

export const CaseStudiesSection: React.FC = () => {
  return (
    <section className="exec-section" id="case-studies">
      <div className="exec-section-header">
        <div className="exec-section-eyebrow">Production Portfolio</div>
        <h2 className="exec-section-title">Featured Case Studies</h2>
        <p className="exec-section-subtitle">
          Real-world systems engineered to resolve business-critical bottlenecks, scale throughput, and lower operational overhead.
        </p>
      </div>

      <div className="case-studies-list">
        {projectsData.map((project) => (
          <div key={project.id} className="case-study-card">
            <div
              className="case-study-banner"
              style={{ background: project.thumbnailGradient }}
            />

            <div className="case-study-inner">
              {/* Left Column: Context & Solution */}
              <div className="case-study-left">
                <div className="case-study-meta">
                  <span className="case-study-category">{project.category}</span>
                  <span className="case-study-role">{project.executive.role}</span>
                </div>

                <h3 className="case-study-title">{project.title}</h3>
                <p className="case-study-tagline">{project.tagline}</p>

                <div className="case-study-block">
                  <span className="case-study-block-title">The Business Challenge</span>
                  <p className="case-study-block-desc">
                    {project.executive.businessChallenge}
                  </p>
                </div>

                <div className="case-study-block">
                  <span className="case-study-block-title">Strategic Solution</span>
                  <p className="case-study-block-desc">
                    {project.executive.strategicSolution}
                  </p>
                </div>
              </div>

              {/* Right Column: Measurable Impact & Tech */}
              <div className="case-study-right">
                <div>
                  <span className="case-study-block-title" style={{ display: 'block', marginBottom: 12 }}>
                    Quantifiable Business Impact
                  </span>
                  <ul className="impact-list">
                    {project.executive.quantifiableImpact.map((impact, idx) => (
                      <li key={idx} className="impact-item">
                        <CheckCircle size={16} className="impact-icon" />
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span
                    className="case-study-block-title"
                    style={{ display: 'block', marginBottom: 8 }}
                  >
                    Architecture & Tech Stack
                  </span>
                  <div className="case-study-tech-wrap">
                    {project.technical.techStack.map((tech) => (
                      <span key={tech} className="case-study-tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="case-study-links">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-study-link-btn"
                    >
                      <span>Live Deployment</span>
                      <ArrowUpRight size={15} />
                    </a>
                  )}

                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-study-link-btn"
                      style={{ color: '#cbd5e1' }}
                    >
                      <GithubIcon size={15} />
                      <span>Source Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
