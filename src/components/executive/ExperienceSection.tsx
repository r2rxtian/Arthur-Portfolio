import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { experienceData } from '../../data/experience';
import { profileData } from '../../data/profile';
import { ScrollReveal } from './ScrollReveal';
import { Section } from './Section';
import { Disclosure } from './motion';

export function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // The rail fills as the reader travels through the timeline.
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="experience" index="03" eyebrow="Journey" title="Experience"
      intro="Building software, improving systems, and working with people.">
      <div className="experience-timeline" ref={timelineRef}>
        <span className="experience-rail" aria-hidden="true">
          <motion.span className="experience-rail-fill" style={{ scaleY: reducedMotion ? 1 : fill }} />
        </span>
        {experienceData.map((experience) => (
          <ScrollReveal key={experience.id} direction="left" distance={24}>
            <article className="experience-row">
              <span className="experience-node" aria-hidden="true" />
              <p className="experience-period"><span>{experience.period}</span><span>{experience.type}</span></p>
              <h3>{experience.role}</h3>
              <p className="experience-company">{experience.company} <i>·</i> {experience.location}</p>
              <p className="experience-summary">{experience.summary}</p>
              <Disclosure label="Contributions">
                <ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                <ul className="experience-skills">{experience.skillsUsed.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </Disclosure>
            </article>
          </ScrollReveal>
        ))}
        <ScrollReveal direction="left" distance={24}>
          <article className="experience-row is-education">
            <span className="experience-node" aria-hidden="true" />
            <p className="experience-period"><span>{profileData.education.expectedCompletion}</span><span>Education · expected completion</span></p>
            <h3>{profileData.education.degree}</h3>
            <p className="experience-company">{profileData.education.institution}</p>
            <p className="experience-summary">{profileData.education.field}</p>
          </article>
        </ScrollReveal>
      </div>
    </Section>
  );
}
