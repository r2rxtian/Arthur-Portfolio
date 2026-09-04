import React from 'react';
import { Sparkles } from 'lucide-react';

const items = [
  'Distributed Systems Architecture',
  'Real-Time Event Streaming',
  'Rust & Go Core Services',
  'Agentic AI & LLM Systems',
  'Apache Kafka & Redis Clusters',
  'TypeScript & React 19',
  'Zero-Trust Biometric Security',
  'Cloud Infrastructure & eBPF',
  'Sub-Millisecond Edge Proxies',
  'High-Throughput Analytics',
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
