import React from 'react';
import { CheckCircle2, ArrowUpRight, Code, Layers, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { projectsData } from '../../data/projects';
import { ScrollReveal } from './ScrollReveal';

export const WorkSection: React.FC = () => {
  return (
    <section className="exec-section" id="work">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={24}>
        <div className="exec-section-header">
          <div className="exec-section-eyebrow">
            <span className="exec-num-accent">01</span>
            <span className="exec-eyebrow-divider">//</span>
            <span>PRODUCTION WORK & SYSTEMS</span>
          </div>
          <h2 className="exec-section-title">Featured Production Systems</h2>
          <p className="exec-section-subtitle">
            Engineered full-stack platforms, transactional audit engines, and real-time architectures built with rigorous schema validation and high-concurrency resilience.
          </p>
        </div>
      </ScrollReveal>

      {/* Projects List */}
      <div className="work-list">
        {projectsData.map((project, idx) => (
          <ScrollReveal
            key={project.id}
            direction="up"
            delay={idx * 0.08}
            distance={36}
            viewportMargin="-40px"
          >
            <div className="work-card group">
              {/* Vibrant Accent Gradient Strip */}
              <div
                className="work-banner"
                style={{ background: project.thumbnailGradient }}
              />

              <div className="work-inner">
                {/* Left Column: Context, Challenge & Solution */}
                <div className="work-left">
                  <div className="work-meta">
                    <span className="work-category">
                      <Layers size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {project.category}
                    </span>
                    <span className="work-role">{project.executive.role}</span>
                    {project.featured && (
                      <span className="work-featured-pill">
                        <Sparkles size={11} color="#f59e0b" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <h3 className="work-title">{project.title}</h3>
                  <p className="work-tagline">{project.tagline}</p>

                  <div className="work-blocks-grid">
                    <div className="work-block">
                      <span className="work-block-title">The Engineering Challenge</span>
                      <p className="work-block-desc">
                        {project.executive.businessChallenge}
                      </p>
                    </div>

                    <div className="work-block">
                      <span className="work-block-title">Strategic Solution</span>
                      <p className="work-block-desc">
                        {project.executive.strategicSolution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Measurable Impact & Tech */}
                <div className="work-right">
                  <div className="work-impact-box">
                    <span className="work-block-title" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <CheckCircle2 size={14} color="#34d399" />
                      <span>Quantifiable Results & Engineering Impact</span>
                    </span>
                    <ul className="work-impact-list">
                      {project.executive.quantifiableImpact.map((impact, impactIdx) => (
                        <li key={impactIdx} className="work-impact-item">
                          <CheckCircle2 size={15} className="work-impact-icon" />
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="work-tech-box">
                    <span
                      className="work-block-title"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}
                    >
                      <Code size={14} color="#38bdf8" />
                      <span>Stack & Architecture</span>
                    </span>
                    <div className="work-tech-wrap">
                      {project.technical.techStack.map((tech) => (
                        <span key={tech} className="work-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Action CTAs for Recruiters */}
                  <div className="work-links">
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-link-btn work-link-primary"
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
                        className="work-link-btn work-link-secondary"
                      >
                        <GithubIcon size={15} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

