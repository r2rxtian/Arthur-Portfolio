import { skillCategoriesData } from '../../data/skills';
import { ScrollReveal } from './ScrollReveal';
import { Section } from './Section';
import { Stagger, StaggerItem } from './motion';

export function SkillsSection() {
  return (
    <Section id="skills" index="04" eyebrow="Toolkit" title="A connected skill set"
      intro="Web development, programming, databases, and IT support.">
      <div className="skills-list-rows">
        {skillCategoriesData.map((category, index) => (
          <ScrollReveal key={category.id} delay={index * 0.06}>
            <div className="skills-category">
              <div className="skills-category-head">
                <span className="skills-count" aria-hidden="true">{String(category.items.length).padStart(2, '0')}</span>
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
              </div>
              <Stagger className="skills-list" gap={0.035}>
                {category.items.map((item) => <StaggerItem key={item.name} className={item.highlight ? 'is-highlighted' : ''}>{item.name}</StaggerItem>)}
              </Stagger>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
