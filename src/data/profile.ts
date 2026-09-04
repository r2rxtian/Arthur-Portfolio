import type { Profile } from '../types/portfolio';

export const profileData: Profile = {
  name: 'Arthur Christian',
  handle: 'r2rxtian',
  title: 'Senior Full-Stack Engineer & Systems Architect',
  executivePitch:
    'Product-minded software architect specializing in building high-throughput distributed systems, modern reactive web applications, and developer platforms that deliver measurable business growth.',
  technicalPitch:
    'Polyglot software engineer focused on TypeScript, React, Node.js, Go, and cloud-native architectures. Obsessed with high performance, developer ergonomics, and microsecond-level optimizations.',
  status: 'Open for Select Senior/Lead Opportunities',
  availability: 'Immediate (Full-Time or Strategic Advisory)',
  location: 'Remote / Global',
  yearsOfExperience: '6+',
  metrics: [
    {
      label: 'Production Systems',
      value: '15+',
      subtext: 'Built & maintained globally',
    },
    {
      label: 'Performance Uplift',
      value: '4.8x',
      subtext: 'Average latency reduction',
    },
    {
      label: 'Active Users Served',
      value: '2.4M+',
      subtext: 'Across high-scale platforms',
    },
    {
      label: 'Service Availability',
      value: '99.99%',
      subtext: 'SLO adherence across services',
    },
  ],
  contact: {
    email: 'arthur.engineer@example.com',
    github: 'https://github.com/r2rxtian',
    linkedin: 'https://linkedin.com/in/arthurchristian',
    resumeFileName: 'Arthur_Christian_CV.pdf',
    meetingUrl: 'https://cal.com/arthur-dev',
  },
};
