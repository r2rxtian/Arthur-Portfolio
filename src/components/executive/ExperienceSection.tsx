import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { experienceData } from '../../data/experience';
import { ScrollReveal } from './ScrollReveal';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="exec-section" id="experience">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={24}>
        <div className="exec-section-header">
          <div className="exec-section-eyebrow">
            <span className="exec-num-accent">03</span>
            <span className="exec-eyebrow-divider">//</span>
            <span>LEADERSHIP & TRACK RECORD</span>
          </div>
          <h2 className="exec-section-title">Career Milestones & Engineering Impact</h2>
          <p className="exec-section-subtitle">
            Proven history of engineering delivery, cross-functional ownership, and building reliable, user-focused digital systems.
          </p>
        </div>
      </ScrollReveal>

      {/* Interactive Timeline Container */}
      <div className="timeline-container">
        {/* Luminous Animated Track Line */}
        <div className="timeline-track-line" />

        <div className="timeline-list">
          {experienceData.map((exp, idx) => (
            <ScrollReveal
              key={exp.id}
              direction="left"
              delay={idx * 0.1}
              distance={28}
              className="timeline-reveal-wrapper"
            >
              <div className="timeline-item">
                {/* Glowing Node Dot */}
                <div className="timeline-dot-wrap">
                  <div className="timeline-dot" />
                  <div className="timeline-dot-ring" />
                </div>

                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div>
                      <div className="timeline-role-row">
                        <Briefcase size={16} color="#38bdf8" />
                        <h3 className="timeline-role">
                          {exp.role} <span className="timeline-company">@ {exp.company}</span>
                        </h3>
                      </div>
                      <div className="timeline-meta-row">
                        <span className="timeline-location">
                          <MapPin size={12} style={{ display: 'inline', marginRight: 3 }} />
                          {exp.location}
                        </span>
                        <span className="timeline-period-badge">
                          <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="timeline-summary">{exp.summary}</p>

                  <ul className="timeline-highlights">
                    {exp.highlights.map((highlight, highlightIdx) => (
                      <li key={highlightIdx} className="timeline-highlight-item">
                        <CheckCircle2 size={14} className="timeline-highlight-check" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="timeline-skills-wrap">
                    {exp.skillsUsed.map((skill) => (
                      <span key={skill} className="timeline-skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

