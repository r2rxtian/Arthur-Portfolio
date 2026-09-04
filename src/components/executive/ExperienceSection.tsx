import React from 'react';
import { experienceData } from '../../data/experience';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="exec-section" id="experience">
      <div className="exec-section-header">
        <div className="exec-section-eyebrow">Career History</div>
        <h2 className="exec-section-title">Leadership & Track Record</h2>
        <p className="exec-section-subtitle">
          Proven history of engineering leadership, team enablement, and shipping distributed software systems.
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
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{exp.location}</span>
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
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
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
