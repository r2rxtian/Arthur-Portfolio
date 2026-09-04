export type WindowId = 'terminal' | 'ide' | 'projects' | 'about' | 'resume' | 'skills' | 'adventure';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DesktopShortcut {
  id: WindowId;
  title: string;
  icon: string;
  tag?: string;
}

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: VirtualFile[];
}

export interface CommandDefinition {
  command: string;
  description: string;
  usage?: string;
  execute: (args: string[], context: any) => string | { type: string; content: string };
}
