import React from 'react';
import { skillCategoriesData } from '../../data/skills';

export const SkillsSection: React.FC = () => {
  return (
    <section className="exec-section" id="skills">
      <div className="exec-section-header">
        <div className="exec-section-eyebrow">Competency Matrix</div>
        <h2 className="exec-section-title">Core Skills & Domain Expertise</h2>
        <p className="exec-section-subtitle">
          Comprehensive stack proficiency spanning frontend reactivity, distributed backend infrastructure, and engineering governance.
        </p>
      </div>

      <div className="skills-grid">
        {skillCategoriesData.map((category) => (
          <div key={category.id} className="skills-category-card">
            <div>
              <h3 className="skills-category-title">{category.title}</h3>
              <p className="skills-category-sub">{category.subtitle}</p>
            </div>

            <div className="skills-badge-list">
              {category.items.map((item) => (
                <span
                  key={item.name}
                  className={`skill-badge ${item.highlight ? 'highlight' : ''}`}
                >
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
