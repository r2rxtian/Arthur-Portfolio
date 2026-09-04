import React from 'react';
import { Sparkles } from 'lucide-react';

const items = [
  'Full-Stack Web Development',
  'Scalable System Design',
  'AI Integration & Automation',
  'Cloud Technologies & DevOps',
  'TypeScript & React',
  'Node.js & Express APIs',
  'Microsoft SQL Server & T-SQL',
  'User-Focused Digital Experiences',
  'Audited Enterprise Systems',
  'Practical Problem Solving',
];

export const TechMarquee: React.FC = () => {
  return (
    <div className="exec-marquee-wrap" aria-hidden="true">
      <div className="exec-marquee-track">
        {[...items, ...items].map((item, idx) => (
          <span key={idx} className="exec-marquee-item">
            <Sparkles size={13} className="exec-marquee-sparkle" />
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
