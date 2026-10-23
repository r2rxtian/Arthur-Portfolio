import type { Profile } from '../types/portfolio';
import { projectsData } from './projects';
import { certificatesData } from './certificates';

export const profileData: Profile = {
  name: 'Arthur Christian Mendoza David',
  shortName: 'Arthur Christian',
  handle: 'r2rxtian',
  title: 'Intern System Developer',
  executivePitch:
    'Computer Science student at Holy Angel University and Intern System Developer at La Rose Noire Philippines, building practical software and developing skills in problem-solving, automation, and system improvement.',
  technicalPitch:
    'I build web applications and automation tools with JavaScript, TypeScript, PHP, Python, and SQL. As an Intern System Developer at La Rose Noire Philippines, I am gaining professional experience while completing my BS in Computer Science at Holy Angel University.',
  status: 'Open to software development opportunities',
  availability: 'Currently an Intern System Developer',
  location: 'Magalang, Pampanga, Philippines',
  yearsOfExperience: 'Internship since July 2026',
  education: {
    institution: 'Holy Angel University (HAU)',
    degree: 'Bachelor of Science in Computer Science',
    expectedCompletion: 'November 20, 2026',
    field: 'Computer Science / Information Technology',
  },
  languages: ['Filipino', 'English'],
  metrics: [
    { label: 'Portfolio projects', value: String(projectsData.length), subtext: 'Web applications and automation' },
    { label: 'Certifications', value: String(certificatesData.length), subtext: 'Web development and networking' },
    { label: 'Internship started', value: 'Jul 2026', subtext: 'La Rose Noire Philippines' },
    { label: 'Graduation', value: 'Nov 2026', subtext: 'Holy Angel University' },
  ],
  contact: {
    email: 'arthurchristiand@gmail.com',
    phone: '09773326123',
    github: 'https://github.com/r2rxtian',
    linkedin: 'https://www.linkedin.com/in/arthur-christian-david-3974b0425',
    resumeLink: 'http://acdavid.jobs180.com',
    resumeFileName: 'Arthur_Christian_Mendoza_David_CV.txt',
  },
};
