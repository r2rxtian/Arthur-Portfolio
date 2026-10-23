export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Full-Stack' | 'Systems & Cloud' | 'AI & Data' | 'Frontend Engineering';
  featured: boolean;
  thumbnailGradient: string;
  executive: {
    businessChallenge: string;
    strategicSolution: string;
    quantifiableImpact: string[];
    role: string;
  };
  technical: {
    architecture: string;
    techStack: string[];
    keyFeatures: string[];
    codeSnippet: {
      filename: string;
      language: string;
      code: string;
    };
  };
  links: {
    demo?: string;
    github?: string;
    docs?: string;
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  summary: string;
  highlights: string[];
  skillsUsed: string[];
}

export interface SkillItem {
  name: string;
  level?: 'Expert' | 'Advanced' | 'Proficient';
  category: string;
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  items: SkillItem[];
}

export interface Profile {
  name: string;
  shortName: string;
  handle: string;
  title: string;
  executivePitch: string;
  technicalPitch: string;
  status: string;
  availability: string;
  location: string;
  yearsOfExperience: string;
  education: { institution: string; degree: string; expectedCompletion: string; field: string };
  languages: string[];
  metrics: Array<{
    label: string;
    value: string;
    subtext: string;
  }>;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    phone: string;
    resumeLink: string;
    resumeFileName: string;
    meetingUrl?: string;
  };
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerCode: 'FCC' | 'CISCO';
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  category: 'Web Development' | 'Networking';
  summary: string;
  skills: string[];
  gradient: string;
  accentColor: string;
  badgeLabel?: string;
}

