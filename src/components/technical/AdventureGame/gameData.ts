import { projectsData } from '../../../data/projects';

export interface ShrineMilestone {
  id: string;
  projectId: string;
  name: string;
  title: string;
  subtitle: string;
  x: number; // tile coordinate
  y: number; // tile coordinate
  color: string;
  glowColor: string;
  glyph: string;
  npcName: string;
  npcRole: string;
  npcQuote: string;
  discovered: boolean;
}

export const shrinesData: ShrineMilestone[] = [
  {
    id: 'shrine-nexus',
    projectId: 'nexus-edge',
    name: 'The Cloud Spire',
    title: 'NexusEdge Gateway',
    subtitle: 'Distributed Edge Caching & GeoDNS Proxy',
    x: 6,
    y: 6,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    glyph: '⚡',
    npcName: 'Archon of the Edge',
    npcRole: 'Systems Warden',
    npcQuote: '“To conquer global latency, we shattered the monolith and distributed routing logic to 18 worldwide edge rings.”',
    discovered: false,
  },
  {
    id: 'shrine-chronos',
    projectId: 'chronos-ai',
    name: 'The Stream Obelisk',
    title: 'Chronos Realtime Analytics',
    subtitle: 'High-Throughput Kafka Stream & ML Anomaly Engine',
    x: 18,
    y: 6,
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    glyph: '🔮',
    npcName: 'Chronos Oracle',
    npcRole: 'Data Sentinel',
    npcQuote: '“Twelve million transactions flowed across our brokers every minute. Sub-50ms inference saved $1.8M from fraud.”',
    discovered: false,
  },
  {
    id: 'shrine-hyperion',
    projectId: 'hyperion-studio',
    name: 'The Canvas Forge',
    title: 'Hyperion Design Studio',
    subtitle: 'Real-Time Multiplayer CRDT Design Workspace',
    x: 6,
    y: 16,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    glyph: '🎨',
    npcName: 'Hyperion Artisan',
    npcRole: 'UI Alchemist',
    npcQuote: '“Bridging design and engineering requires seamless live state synchronization. CRDTs over WebSockets made that real.”',
    discovered: false,
  },
  {
    id: 'shrine-synapse',
    projectId: 'synapse-auth',
    name: 'The Cryptographic Citadel',
    title: 'Synapse Identity & Vault',
    subtitle: 'Zero-Knowledge Biometric Passkeys & Enclave Store',
    x: 18,
    y: 16,
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    glyph: '🛡️',
    npcName: 'Cyber Sentinel',
    npcRole: 'Security Arbiter',
    npcQuote: '“Passkeys eliminate credential theft entirely. With zero plain-text secrets, account takeovers dropped to absolute zero.”',
    discovered: false,
  },
  {
    id: 'portal-citadel',
    projectId: '',
    name: 'The Grand Architect Portal',
    title: 'Arthur Christian — Architect Core',
    subtitle: 'Quest Destination & Executive Gateway',
    x: 12,
    y: 11,
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    glyph: '👑',
    npcName: 'Arthur Christian',
    npcRole: 'Lead Architect',
    npcQuote: '“You have inspected all core architectural milestones! Ready to scale your next production system together?”',
    discovered: false,
  },
];

export const getProjectForShrine = (projectId: string) => {
  return projectsData.find((p) => p.id === projectId) || null;
};
