import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillCategoriesData } from '../../data/skills';

gsap.registerPlugin(ScrollTrigger);

export const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.skills-category-card');
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 25,
          duration: 0.55,
          ease: 'power2.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="exec-section" id="skills">
      <div className="exec-section-header">
        <div className="exec-section-eyebrow">
          <span className="exec-num-accent">04</span> // CORE COMPETENCIES & TECH MATRIX
        </div>
        <h2 className="exec-section-title">Technical Domains & Stack Expertise</h2>
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
