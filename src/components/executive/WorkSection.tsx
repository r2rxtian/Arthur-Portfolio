import { projectsData } from '../../data/projects';
import { ScrollReveal } from './ScrollReveal';
import { ProjectCard } from './ProjectCard';

export function WorkSection() {
  return (
    <section className="exec-section" id="work" aria-labelledby="work-heading">
      <ScrollReveal className="exec-section-header">
        <h2 id="work-heading">Selected work<span>.</span></h2>
        <p>Practical systems for real workflows. Built from the database to the details.</p>
      </ScrollReveal>
      <div className="work-grid">
        {projectsData.map((project, index) => (
          <ScrollReveal key={project.id} className={index === 0 ? 'work-featured-wrapper' : ''} delay={index % 2 * 0.05}>
            <ProjectCard project={project} featured={index === 0} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
