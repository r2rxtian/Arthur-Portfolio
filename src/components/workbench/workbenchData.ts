import { Box, FileStack, ScanLine, Search, Trophy } from 'lucide-react';

export const projectPresentation = {
  itms: { name: 'StockHub', description: 'Inventory & warehouse operations', icon: Box, kind: 'Inventory system' },
  'lost-and-found': { name: 'Lost & Found', description: 'Property recovery & matching', icon: Search, kind: 'Recovery platform' },
  'tennis-lms': { name: 'Tennis Academy', description: 'Training & player development', icon: Trophy, kind: 'Learning platform' },
  dochubpr: { name: 'DocHubPR', description: 'Documents & revision history', icon: FileStack, kind: 'Document system' },
  qrs: { name: 'QR Task Check', description: 'Field inspections & verification', icon: ScanLine, kind: 'Operations platform' },
};

export type ArchitectureLayer = 'interface' | 'application' | 'data';
export interface ArchitectureNode { id: ArchitectureLayer; name: string; technology: string; description: string }

export const projectArchitecture: Record<string, ArchitectureNode[]> = {
  itms: [
    { id: 'interface', name: 'Inventory interface', technology: 'Vite', description: 'The client presents stock, locations, and movement workflows to warehouse operators.' },
    { id: 'application', name: 'Transaction service', technology: 'Node.js + Express', description: 'Schema-validated endpoints coordinate stock changes, capacity checks, alerts, and audit records.' },
    { id: 'data', name: 'Inventory ledger', technology: 'SQL Server', description: 'Serializable transactions and row-level locks protect stock balances during concurrent operations.' },
  ],
  'lost-and-found': [
    { id: 'interface', name: 'Recovery interface', technology: 'Vite', description: 'Users report lost and found items, attach photos, and follow claim verification workflows.' },
    { id: 'application', name: 'Matching service', technology: 'Express + Multer', description: 'The service scores item attributes, handles image uploads, and coordinates verified claims.' },
    { id: 'data', name: 'Property records', technology: 'SQL Server', description: 'Relational records connect item reports, candidate matches, and claim resolutions.' },
  ],
  'tennis-lms': [
    { id: 'interface', name: 'Learning portal', technology: 'Vite', description: 'Player and administrator views organize training, drills, milestones, and schedules.' },
    { id: 'application', name: 'Academy service', technology: 'Express 5', description: 'Session-authenticated routes separate player workflows from administrative curriculum controls.' },
    { id: 'data', name: 'Training records', technology: 'SQL Server', description: 'A shared datastore holds lessons, player progress, and academy scheduling records.' },
  ],
  dochubpr: [
    { id: 'interface', name: 'Document workspace', technology: 'Vanilla JavaScript', description: 'In-browser previews, metadata tags, and bulk actions support everyday document work.' },
    { id: 'application', name: 'Document lifecycle', technology: 'PHP 8.2', description: 'Server-rendered views and JSON endpoints manage uploads, approvals, revisions, and ZIP exports.' },
    { id: 'data', name: 'Revision history', technology: 'SQL Server', description: 'Append-only version records preserve previous revisions and their audit history.' },
  ],
  qrs: [
    { id: 'interface', name: 'Inspection interface', technology: 'JavaScript + camera API', description: 'Technicians scan station codes and complete observations at inspection checkpoints.' },
    { id: 'application', name: 'Verification service', technology: 'PHP', description: 'The backend validates checkpoint requests and keeps future inspections on standby.' },
    { id: 'data', name: 'Inspection records', technology: 'SQL Server', description: 'Time-stamped observations and station records support supervisory review and sign-off.' },
  ],
};

export function presentationFor(id: string) {
  return projectPresentation[id as keyof typeof projectPresentation] ?? projectPresentation.itms;
}
