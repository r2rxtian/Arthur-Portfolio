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
    id: 'shrine-itms',
    projectId: 'itms',
    name: 'The Stock Vault',
    title: 'StockHub ITMS',
    subtitle: 'Serializable Transactions & Audited Warehouse Movement',
    x: 6,
    y: 6,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    glyph: '📦',
    npcName: 'Warehouse Warden',
    npcRole: 'Inventory Lead',
    npcQuote: '“Stock levels can only change through strictly audited operations. Row-level serializable locks guarantee zero inventory drift.”',
    discovered: false,
  },
  {
    id: 'shrine-lostfound',
    projectId: 'lost-and-found',
    name: 'The Recovery Nexus',
    title: 'Lost & Found System',
    subtitle: 'Deterministic Attribute Matching & Claim Verification',
    x: 18,
    y: 6,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    glyph: '🔍',
    npcName: 'Recovery Sentinel',
    npcRole: 'Property Arbiter',
    npcQuote: '“Multi-factor heuristics score category, color, location, and tokens deterministically—reuniting lost valuables with verified owners.”',
    discovered: false,
  },
  {
    id: 'shrine-tennis',
    projectId: 'tennis-lms',
    name: 'The Academy Court',
    title: 'Tennis Academy LMS',
    subtitle: 'Player Performance Curriculum & Role-Based Workflows',
    x: 6,
    y: 16,
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    glyph: '🎾',
    npcName: 'Grand Slam Coach',
    npcRole: 'Curriculum Director',
    npcQuote: '“Athletic mastery requires structured tracking. Player progress, court schedules, and bcrypt-secured credentials are unified here.”',
    discovered: false,
  },
  {
    id: 'shrine-dochub',
    projectId: 'dochubpr',
    name: 'The Archive Citadel',
    title: 'DocHubPR Document Hub',
    subtitle: 'Immutable Version Trees & Enterprise File Lifecycle',
    x: 18,
    y: 16,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    glyph: '📁',
    npcName: 'Chief Archivist',
    npcRole: 'Document Controller',
    npcQuote: '“Zero file overwrites. Every document revision is an immutable node with automated ZIP bundling and enterprise audit trails.”',
    discovered: false,
  },
  {
    id: 'shrine-qrs',
    projectId: 'qrs',
    name: 'The Inspection Beacon',
    title: 'QR Task Check (QRS)',
    subtitle: 'Cryptographic Checkpoints & Standby Task Scheduling',
    x: 12,
    y: 4,
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    glyph: '📱',
    npcName: 'Station Inspector',
    npcRole: 'Operations Guardian',
    npcQuote: '“Guaranteed physical technician presence. Advance schedules stay on standby until the target date arrives—preventing premature scans.”',
    discovered: false,
  },
  {
    id: 'portal-citadel',
    projectId: '',
    name: 'The Grand Creator Portal',
    title: 'Arthur Christian — Software Engineer',
    subtitle: 'Quest Destination & Executive Gateway',
    x: 12,
    y: 11,
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    glyph: '👑',
    npcName: 'Arthur Christian',
    npcRole: 'Full-Stack Software Engineer',
    npcQuote: '“You have inspected all 5 production software systems! Ready to build practical, scalable digital experiences together?”',
    discovered: false,
  },
];

export const getProjectForShrine = (projectId: string) => {
  return projectsData.find((p) => p.id === projectId) || null;
};
