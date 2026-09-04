import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceData } from '../../data/experience';

gsap.registerPlugin(ScrollTrigger);

export const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.timeline-item');
      items.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          x: -20,
          duration: 0.55,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="exec-section" id="experience">
      <div className="exec-section-header">
        <div className="exec-section-eyebrow">
          <span className="exec-num-accent">03</span> // LEADERSHIP & TRACK RECORD
        </div>
        <h2 className="exec-section-title">Leadership & Track Record</h2>
        <p className="exec-section-subtitle">
          Proven history of engineering leadership, cross-functional enablement, and scaling high-velocity distributed systems.
        </p>
      </div>

      <div className="timeline-list">
        {experienceData.map((exp) => (
          <div key={exp.id} className="timeline-item">
            <div className="timeline-dot" />

            <div className="timeline-card">
              <div className="timeline-card-header">
                <div>
                  <h3 className="timeline-role">
                    {exp.role}{' '}
                    <span className="timeline-company">@ {exp.company}</span>
                  </h3>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{exp.location}</span>
                </div>
                <span className="timeline-period">{exp.period}</span>
              </div>

              <p className="timeline-summary">{exp.summary}</p>

              <ul className="timeline-highlights">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="timeline-highlight-item">
                    <span style={{ color: '#10b981', marginTop: 3 }}>•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {exp.skillsUsed.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
