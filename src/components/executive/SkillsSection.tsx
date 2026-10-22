import { skillCategoriesData } from '../../data/skills';
import { ScrollReveal } from './ScrollReveal';

export function SkillsSection() {
  return (
    <section className="exec-section" id="skills" aria-labelledby="skills-heading">
      <ScrollReveal className="exec-section-header">
        <h2 id="skills-heading">A connected skill set<span>.</span></h2>
        <p>From the interface to the infrastructure, with care at every layer.</p>
      </ScrollReveal>
      <div className="skills-grid">
        {skillCategoriesData.map((category, index) => (
          <ScrollReveal key={category.id} delay={index % 2 * 0.05}>
            <div className="skills-category">
              <h3>{category.title}</h3>
              <p>{category.subtitle}</p>
              <div className="skills-list">
                {category.items.map((item) => <span key={item.name} className={item.highlight ? 'is-highlighted' : ''}>{item.name}</span>)}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
