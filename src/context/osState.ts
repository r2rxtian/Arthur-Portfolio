import type { WindowId, WindowState } from '../types/os';

export const TASKBAR_HEIGHT = 44;
export interface Viewport { width: number; height: number }
export interface OSState {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  topZIndex: number;
  desktopHiddenIds: WindowId[];
  editorRequest: { fileId: string; revision: number } | null;
}
type OSAction =
  | { type: 'OPEN' | 'FOCUS' | 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE'; id: WindowId }
  | { type: 'MOVE'; id: WindowId; position: { x: number; y: number }; viewport: Viewport }
  | { type: 'FIT'; viewport: Viewport }
  | { type: 'INSPECT'; projectId: string }
  | { type: 'DESKTOP' };

const specifications: Record<WindowId, [string, number, number, number, number]> = {
  adventure: ['Adventure.exe', 860, 570, 220, 48],
  projects: ['My Projects', 860, 540, 160, 64],
  terminal: ['Command Prompt', 720, 450, 120, 90],
  ide: ['Code Studio', 900, 560, 180, 72],
  about: ['System Properties', 640, 500, 240, 100],
  resume: ['Curriculum Vitae', 740, 560, 200, 64],
  skills: ['Tech Stack Inspector', 700, 500, 220, 90],
};

export function createOSState(): OSState {
  const windows = Object.fromEntries(Object.entries(specifications).map(([id, [title, width, height, x, y]]) => [
    id, { id, title, size: { width, height }, position: { x, y }, isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
  ])) as Record<WindowId, WindowState>;
  return { windows, activeWindowId: null, topZIndex: 20, desktopHiddenIds: [], editorRequest: null };
}

export function getWindowGeometry(win: WindowState, viewport: Viewport) {
  const compact = viewport.width < 768;
  const maximized = win.isMaximized || compact;
  const width = maximized ? viewport.width : Math.min(win.size.width, Math.max(1, viewport.width - 24));
  const height = maximized ? Math.max(1, viewport.height - TASKBAR_HEIGHT) : Math.min(win.size.height, Math.max(1, viewport.height - TASKBAR_HEIGHT - 24));
  return {
    width, height,
    x: maximized ? 0 : Math.max(0, Math.min(win.position.x, viewport.width - width)),
    y: maximized ? 0 : Math.max(0, Math.min(win.position.y, viewport.height - TASKBAR_HEIGHT - height)),
  };
}

function topVisible(windows: OSState['windows']): WindowId | null {
  return Object.values(windows).filter((win) => win.isOpen && !win.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;
}

export function osReducer(state: OSState, action: OSAction): OSState {
  if (action.type === 'INSPECT') {
    const next = osReducer(state, { type: 'OPEN', id: 'ide' });
    return { ...next, editorRequest: { fileId: `file-${action.projectId}`, revision: (state.editorRequest?.revision ?? 0) + 1 } };
  }
  if (action.type === 'DESKTOP') {
    const visible = Object.values(state.windows).filter((win) => win.isOpen && !win.isMinimized).map((win) => win.id);
    const ids = visible.length ? visible : state.desktopHiddenIds;
    const windows = { ...state.windows };
    for (const id of ids) {
      if (windows[id].isOpen) windows[id] = { ...windows[id], isMinimized: visible.length > 0 };
    }
    return { ...state, windows, activeWindowId: topVisible(windows), desktopHiddenIds: visible.length ? visible : [] };
  }
  if (action.type === 'FIT') {
    const windows = { ...state.windows };
    for (const win of Object.values(windows)) {
      if (!win.isOpen || win.isMaximized || action.viewport.width < 768) continue;
      const geometry = getWindowGeometry(win, action.viewport);
      windows[win.id] = { ...win, position: { x: geometry.x, y: geometry.y } };
    }
    return { ...state, windows };
  }
  const win = state.windows[action.id];
  if (action.type === 'MOVE') {
    const geometry = getWindowGeometry({ ...win, position: action.position }, action.viewport);
    return { ...state, windows: { ...state.windows, [action.id]: { ...win, position: { x: geometry.x, y: geometry.y } } } };
  }
  if (action.type === 'CLOSE' || action.type === 'MINIMIZE') {
    const windows = { ...state.windows, [action.id]: {
      ...win, ...(action.type === 'CLOSE' ? { isOpen: false, isMinimized: false } : { isMinimized: true }),
    } };
    return { ...state, windows, activeWindowId: state.activeWindowId === action.id ? topVisible(windows) : state.activeWindowId };
  }
  if (action.type === 'FOCUS' && state.activeWindowId === action.id && !win.isMinimized) return state;
  if (action.type !== 'OPEN' && !win.isOpen) return state;
  const nextZ = state.topZIndex + 1;
  return {
    ...state, topZIndex: nextZ, activeWindowId: action.id,
    windows: { ...state.windows, [action.id]: {
      ...win, isOpen: true, isMinimized: false, zIndex: nextZ,
      isMaximized: action.type === 'MAXIMIZE' ? !win.isMaximized : win.isMaximized,
    } },
  };
}
