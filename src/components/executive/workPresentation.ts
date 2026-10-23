import { Box, FileStack, MapPin, Search, Tags, Trophy, type LucideIcon } from 'lucide-react';
import type { Project } from '../../types/portfolio';

interface WorkPresentation { title: string; description: string; icon: LucideIcon }

const presentation: Record<string, WorkPresentation> = {
  pricelistautomation: { title: 'Price List Automation', description: 'A clear path from workbook to approved prices.', icon: Tags },
  itms: { title: 'StockHub', description: 'Inventory that stays accountable.', icon: Box },
  'lost-and-found': { title: 'Lost & Found', description: 'A simpler path from lost to recovered.', icon: Search },
  'tennis-lms': { title: 'Tennis Academy', description: 'Structured learning, on and off the court.', icon: Trophy },
  dochubpr: { title: 'DocHubPR', description: 'Every document. Every revision.', icon: FileStack },
  qrs: { title: 'QR Task Check', description: 'Field inspections with a verifiable record.', icon: MapPin },
};

export function workPresentation(project: Project): WorkPresentation {
  return presentation[project.id] ?? { title: project.title, description: project.tagline, icon: Box };
}
