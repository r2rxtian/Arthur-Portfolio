import { ChevronDown } from 'lucide-react';
import { experienceData } from '../../data/experience';
import { ScrollReveal } from './ScrollReveal';

export function ExperienceSection() {
  return (
    <section className="exec-section" id="experience" aria-labelledby="experience-heading">
      <ScrollReveal className="exec-section-header">
        <h2 id="experience-heading">Experience<span>.</span></h2>
        <p>Building software, improving systems, and working with people.</p>
      </ScrollReveal>
      <div className="experience-list">
        {experienceData.map((experience) => (
          <ScrollReveal key={experience.id}>
            <article className="experience-row">
              <div className="experience-period">
                <span>{experience.period}</span>
                <span>{experience.type}</span>
              </div>
              <div className="experience-content">
                <h3>{experience.role}</h3>
                <p className="experience-company">{experience.company}</p>
                <p className="experience-summary">{experience.summary}</p>
                <details className="exec-disclosure">
                  <summary>Contributions <ChevronDown size={16} /></summary>
                  <div className="exec-disclosure-body">
                    <ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                    <p>{experience.skillsUsed.join(', ')}</p>
                    <p className="exec-caption">{experience.location}</p>
                  </div>
                </details>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
