import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { projectsData } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export const WorkSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.work-card');
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 35,
          duration: 0.65,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="exec-section" id="work">
      <div className="exec-section-header">
        <div className="exec-section-eyebrow">
          <span className="exec-num-accent">01</span> // PRODUCTION WORK
        </div>
        <h2 className="exec-section-title">Featured Work & Systems</h2>
        <p className="exec-section-subtitle">
          Mission-critical production systems engineered to resolve throughput bottlenecks, eliminate latency spikes, and drive measurable enterprise value.
        </p>
      </div>

      <div className="work-list">
        {projectsData.map((project) => (
          <div key={project.id} className="work-card">
            <div
              className="work-banner"
              style={{ background: project.thumbnailGradient }}
            />

            <div className="work-inner">
              {/* Left Column: Context & Solution */}
              <div className="work-left">
                <div className="work-meta">
                  <span className="work-category">{project.category}</span>
                  <span className="work-role">{project.executive.role}</span>
                </div>

                <h3 className="work-title">{project.title}</h3>
                <p className="work-tagline">{project.tagline}</p>

                <div className="work-block">
                  <span className="work-block-title">The Business Challenge</span>
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

              {/* Right Column: Measurable Impact & Tech */}
              <div className="work-right">
                <div>
                  <span className="work-block-title" style={{ display: 'block', marginBottom: 12 }}>
                    Quantifiable Business Impact
                  </span>
                  <ul className="work-impact-list">
                    {project.executive.quantifiableImpact.map((impact, idx) => (
                      <li key={idx} className="work-impact-item">
                        <CheckCircle size={16} className="work-impact-icon" />
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span
                    className="work-block-title"
                    style={{ display: 'block', marginBottom: 8 }}
                  >
                    Architecture & Tech Stack
                  </span>
                  <div className="work-tech-wrap">
                    {project.technical.techStack.map((tech) => (
                      <span key={tech} className="work-tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="work-links">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-link-btn"
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
                      className="work-link-btn"
                      style={{ color: '#64748b' }}
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
