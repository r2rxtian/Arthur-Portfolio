import { profileData } from './profile';
import { experienceData } from './experience';
import { projectsData } from './projects';
import { skillCategoriesData } from './skills';
import { certificatesData } from './certificates';

export function buildResumeText() {
  const { education, contact } = profileData;
  return [
    profileData.name, profileData.title,
    `Location: ${profileData.location}`,
    `Email: ${contact.email}`, `Mobile: ${contact.phone}`,
    `GitHub: ${contact.github}`, `LinkedIn: ${contact.linkedin}`, `ResumeLink: ${contact.resumeLink}`,
    '', 'PROFILE', profileData.executivePitch,
    '', 'EXPERIENCE',
    ...experienceData.flatMap((experience) => [
      '', `${experience.role} at ${experience.company} (${experience.period})`,
      experience.summary, ...experience.highlights.map((highlight) => `- ${highlight}`),
    ]),
    '', 'EDUCATION', education.degree, education.institution,
    `Expected completion: ${education.expectedCompletion}`, `Field of study: ${education.field}`,
    '', 'CERTIFICATIONS',
    ...certificatesData.flatMap((certificate) => [
      '', `${certificate.title} - ${certificate.issuer} (${certificate.issueDate})`,
      certificate.summary, ...(certificate.credentialUrl ? [certificate.credentialUrl] : []),
    ]),
    '', 'PROJECTS',
    ...projectsData.flatMap((project) => ['', project.title, project.tagline, project.links.github ?? '']),
    '', 'SKILLS',
    ...skillCategoriesData.filter((category) => category.id !== 'support').map((category) => `${category.title}: ${category.items.map((item) => item.name).join(', ')}`),
    'IT Support', '', 'LANGUAGES', profileData.languages.join(', '),
  ].join('\n');
}
