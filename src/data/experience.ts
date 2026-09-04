import type { Experience } from '../types/portfolio';

export const experienceData: Experience[] = [
  {
    id: 'exp-1',
    role: 'Lead Systems & Full-Stack Architect',
    company: 'Apex Cloud Technologies',
    location: 'Remote / San Francisco, CA',
    period: '2023 - Present',
    type: 'Full-time',
    summary:
      'Directing core architecture and cloud reliability initiatives across 6 cross-functional engineering squads delivering high-concurrency SaaS infrastructure.',
    highlights: [
      'Led migration of monolithic Ruby/Node services into decoupled Go/TypeScript microservices, slashing cloud infrastructure costs by $180k/yr.',
      'Designed and rolled out internal developer platform (IDP) reducing staging deployment lead time from 45 minutes to under 3 minutes.',
      'Mentored 14 senior and mid-level engineers in distributed systems design, concurrency primitives, and observability standards.',
    ],
    skillsUsed: ['TypeScript', 'Go', 'Kubernetes', 'Kafka', 'PostgreSQL', 'Redis', 'AWS'],
  },
  {
    id: 'exp-2',
    role: 'Senior Full-Stack Engineer',
    company: 'Veloce Data Systems',
    location: 'New York, NY (Hybrid)',
    period: '2021 - 2023',
    type: 'Full-time',
    summary:
      'Engineered real-time analytics streaming pipelines and dynamic dashboard interfaces for high-frequency trading and fintech intelligence clients.',
    highlights: [
      'Engineered WebSocket event dispatcher processing over 120,000 tick updates per second with sub-10ms UI render cycle.',
      'Refactored client-side state pipeline into custom lightweight stores, cutting frontend memory utilization by 44%.',
      'Spearheaded SOC2 Type II compliance audit for application layer data ingestion and encryption at rest.',
    ],
    skillsUsed: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'TimescaleDB', 'Docker'],
  },
  {
    id: 'exp-3',
    role: 'Software Engineer',
    company: 'Synthetix Interactive',
    location: 'Austin, TX',
    period: '2019 - 2021',
    type: 'Full-time',
    summary:
      'Developed customer-facing interactive web applications, component libraries, and internal administrative tooling.',
    highlights: [
      'Built custom design system component library adopted across 12 internal and customer-facing web products.',
      'Implemented end-to-end automated testing suites boosting release confidence and lowering production hotfix count by 60%.',
    ],
    skillsUsed: ['JavaScript / TypeScript', 'React', 'CSS Modules', 'GraphQL', 'Jest', 'Cypress'],
  },
];
