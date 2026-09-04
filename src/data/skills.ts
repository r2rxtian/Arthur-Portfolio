import type { SkillCategory } from '../types/portfolio';

export const skillCategoriesData: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend & Reactive UI',
    subtitle: 'High-performance user interfaces, design systems, and Web APIs',
    items: [
      { name: 'TypeScript', level: 'Expert', category: 'Language', highlight: true },
      { name: 'React 18 / 19', level: 'Expert', category: 'Framework', highlight: true },
      { name: 'Next.js / Vite', level: 'Expert', category: 'Framework', highlight: true },
      { name: 'State Management (Zustand, Redux)', level: 'Advanced', category: 'Architecture' },
      { name: 'Modern CSS & Animations', level: 'Expert', category: 'Styling', highlight: true },
      { name: 'Canvas & WebGL Basics', level: 'Proficient', category: 'Graphics' },
      { name: 'WebSockets & Realtime UX', level: 'Advanced', category: 'Networking' },
      { name: 'Web Performance Optimization', level: 'Expert', category: 'Core' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Systems Architecture',
    subtitle: 'Scalable services, concurrent engines, and data modeling',
    items: [
      { name: 'Node.js / Express', level: 'Expert', category: 'Runtime', highlight: true },
      { name: 'TypeScript / JavaScript', level: 'Expert', category: 'Language', highlight: true },
      { name: 'Microsoft SQL Server / T-SQL', level: 'Expert', category: 'Database', highlight: true },
      { name: 'PostgreSQL / SQL Optimization', level: 'Expert', category: 'Database', highlight: true },
      { name: 'PHP 8.2 (pdo_sqlsrv)', level: 'Advanced', category: 'Language' },
      { name: 'Redis (Caching & Pub/Sub)', level: 'Expert', category: 'Database' },
      { name: 'REST & GraphQL APIs', level: 'Expert', category: 'API Design', highlight: true },
      { name: 'Zod & Schema Validation', level: 'Expert', category: 'Security' },
      { name: 'Apache Kafka / Event Streams', level: 'Advanced', category: 'Streaming' },
    ],
  },
  {
    id: 'devops',
    title: 'Cloud, DevOps & Reliability',
    subtitle: 'Containerization, infrastructure as code, and observability',
    items: [
      { name: 'Docker & Microservices', level: 'Expert', category: 'Containers', highlight: true },
      { name: 'Kubernetes (K8s)', level: 'Advanced', category: 'Orchestration' },
      { name: 'AWS (ECS, S3, RDS, Lambda)', level: 'Advanced', category: 'Cloud', highlight: true },
      { name: 'CI/CD (GitHub Actions)', level: 'Expert', category: 'Automation' },
      { name: 'Prometheus & Grafana', level: 'Advanced', category: 'Observability' },
      { name: 'Terraform / IaC', level: 'Proficient', category: 'Cloud' },
      { name: 'Linux System Administration', level: 'Advanced', category: 'Systems' },
    ],
  },
  {
    id: 'practices',
    title: 'Leadership & Engineering Practices',
    subtitle: 'Methodologies that accelerate product delivery and team quality',
    items: [
      { name: 'System Architecture Design', level: 'Expert', category: 'Architecture', highlight: true },
      { name: 'Technical Leadership & Mentoring', level: 'Expert', category: 'Leadership', highlight: true },
      { name: 'Automated Testing (Unit/E2E)', level: 'Expert', category: 'Quality' },
      { name: 'Agile & Rapid Prototyping', level: 'Expert', category: 'Process' },
      { name: 'Zero-Trust Security & FIDO2', level: 'Advanced', category: 'Security' },
    ],
  },
];
