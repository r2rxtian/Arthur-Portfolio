import type { Certificate } from '../types/portfolio';

export const certificatesData: Certificate[] = [
  {
    id: 'freecodecamp-responsive-web-design',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    issuerCode: 'FCC',
    issueDate: 'October 13, 2026',
    credentialUrl: 'https://www.freecodecamp.org/certification/xtian06/responsive-web-design-v9',
    category: 'Web Development',
    summary: 'Developer certification awarded to xtian06 for completing Responsive Web Design, representing approximately 300 hours of work.',
    skills: ['HTML', 'CSS', 'Responsive Web Design'],
    gradient: 'linear-gradient(90deg, #0a0a23 0%, #3b3b4f 100%)',
    accentColor: '#0a0a23',
    badgeLabel: 'DEVELOPER CERTIFICATION',
  },
  {
    id: 'cisco-introduction-to-networks',
    title: 'CCNAv7: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    issuerCode: 'CISCO',
    issueDate: '2024',
    category: 'Networking',
    summary: 'Completed the CCNAv7 Introduction to Networks course through Cisco Networking Academy.',
    skills: ['Networking Fundamentals'],
    gradient: 'linear-gradient(90deg, #087ba7 0%, #269bc3 100%)',
    accentColor: '#087ba7',
    badgeLabel: 'COURSE CERTIFICATE',
  },
];
