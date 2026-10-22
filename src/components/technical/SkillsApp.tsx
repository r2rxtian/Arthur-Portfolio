import { useState } from 'react';
import { skillCategoriesData } from '../../data/skills';
import { Cpu } from 'lucide-react';

export function SkillsApp() {
  const [activeId, setActiveId] = useState(skillCategoriesData[0].id);
  const activeCategory = skillCategoriesData.find((category) => category.id === activeId)!;
  return (
    <div className="system-app skills-inspector">
      <div className="inspector-heading"><Cpu size={27} strokeWidth={1.5} /><div><h1>Tech Stack Inspector</h1><p>Capabilities, tools, and working knowledge.</p></div></div>
      <div className="inspector-tabs" role="tablist" aria-label="Skill categories">
        {skillCategoriesData.map((category, index) => (
          <button key={category.id} role="tab" id={`skill-tab-${category.id}`} aria-controls="skill-panel" aria-selected={activeId === category.id} tabIndex={activeId === category.id ? 0 : -1}
            onClick={() => setActiveId(category.id)} onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? skillCategoriesData.length - 1 :
                (index + (event.key === 'ArrowRight' ? 1 : -1) + skillCategoriesData.length) % skillCategoriesData.length;
              setActiveId(skillCategoriesData[next].id);
              document.getElementById(`skill-tab-${skillCategoriesData[next].id}`)?.focus();
            }}>{category.id === 'frontend' ? 'Frontend' : category.id === 'backend' ? 'Backend' : category.id === 'devops' ? 'Cloud & DevOps' : 'Practices'}</button>
        ))}
      </div>
      <div id="skill-panel" className="inspector-panel" role="tabpanel" aria-labelledby={`skill-tab-${activeId}`} tabIndex={0}>
        <h2>{activeCategory.title}</h2><p>{activeCategory.subtitle}</p>
        <dl className="inspector-skills">{activeCategory.items.map((item) => <div key={item.name}><dt>{item.name}</dt><dd>{item.level}</dd></div>)}</dl>
      </div>
      <div className="os-status-bar"><span>{activeCategory.items.length} capabilities</span><span>{activeCategory.title}</span></div>
    </div>
  );
}
