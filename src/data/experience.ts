import type { Experience } from '../types/portfolio';

export const experienceData: Experience[] = [
  {
    id: 'la-rose-noire-internship',
    role: 'System Developer (OJT)',
    company: 'La Rose Noire Philippines',
    location: 'Philippines',
    period: 'July 2026 - October 2026',
    type: 'On-the-Job Training (Completed)',
    summary: 'Completed on-the-job training as a system developer in the manufacturing and production industry, building internal tools focused on automation and system improvement.',
    highlights: [
      'Built the LRN Price List Automation system (PHP 8.2, JavaScript, SQL Server) for Excel upload validation, price adjustments, approvals, and Excel/PDF exports.',
      'Added approval routing, revision history, notifications, and audit logging so published price changes can be traced.',
      'Secured the application with role-based permissions, session authentication, and CSRF protection.',
    ],
    skillsUsed: ['PHP', 'JavaScript', 'SQL Server', 'Software Development', 'System Improvement'],
  },
];
