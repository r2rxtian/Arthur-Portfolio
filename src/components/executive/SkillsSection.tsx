import React from 'react';
import { skillCategoriesData } from '../../data/skills';
import { ScrollReveal } from './ScrollReveal';
import { Cpu, Terminal, Database, ShieldCheck } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Cpu size={18} color="#38bdf8" />;
      case 'backend':
        return <Terminal size={18} color="#10b981" />;
      case 'cloud':
        return <Database size={18} color="#f59e0b" />;
      default:
        return <ShieldCheck size={18} color="#a855f7" />;
    }
  };

  return (
    <section className="exec-section" id="skills">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={24}>
        <div className="exec-section-header">
          <div className="exec-section-eyebrow">
            <span className="exec-num-accent">04</span>
            <span className="exec-eyebrow-divider">//</span>
            <span>CORE COMPETENCIES & TECH MATRIX</span>
          </div>
          <h2 className="exec-section-title">Technical Domains & Stack Expertise</h2>
          <p className="exec-section-subtitle">
            Comprehensive stack proficiency spanning frontend reactivity, distributed backend infrastructure, database engines, and engineering governance.
          </p>
        </div>
      </ScrollReveal>

      {/* Skills Grid */}
      <div className="skills-grid">
        {skillCategoriesData.map((category, idx) => (
          <ScrollReveal
            key={category.id}
            direction="up"
            delay={idx * 0.08}
            distance={28}
          >
            <div className="skills-category-card group">
              <div className="skills-category-header">
                <div className="skills-category-icon-wrap">
                  {getCategoryIcon(category.id)}
                </div>
                <div>
                  <h3 className="skills-category-title">{category.title}</h3>
                  <p className="skills-category-sub">{category.subtitle}</p>
                </div>
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
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

