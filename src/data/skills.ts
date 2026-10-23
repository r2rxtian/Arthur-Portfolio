import type { SkillCategory } from '../types/portfolio';

export const skillCategoriesData: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Web Development',
    subtitle: 'Building interfaces and working with web technologies',
    items: [
      { name: 'HTML', category: 'Markup', highlight: true },
      { name: 'CSS', category: 'Styling', highlight: true },
      { name: 'JavaScript', category: 'Language', highlight: true },
      { name: 'TypeScript', category: 'Language', highlight: true },
    ],
  },
  {
    id: 'backend',
    title: 'Programming & Databases',
    subtitle: 'Application logic, automation, and database management',
    items: [
      { name: 'Python', category: 'Language', highlight: true },
      { name: 'PHP', category: 'Language', highlight: true },
      { name: 'SQL / Database Management', category: 'Database', highlight: true },
    ],
  },
  {
    id: 'support',
    title: 'IT & Communication',
    subtitle: 'Technical support and languages',
    items: [
      { name: 'IT Support', category: 'Technical Support', highlight: true },
      { name: 'Filipino', category: 'Language' },
      { name: 'English', category: 'Language' },
    ],
  },
];
