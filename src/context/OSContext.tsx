import { createContext, useContext, useReducer, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type { WindowId } from '../types/os';
import { useMode } from './ModeContext';
import { createOSState, osReducer, type OSState } from './osState';

interface OSContextType {
  windows: OSState['windows'];
  activeWindowId: WindowId | null;
  editorRequest: OSState['editorRequest'];
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void;
  inspectProject: (projectId: string) => void;
  toggleDesktop: () => void;
}
const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(osReducer, undefined, createOSState);
  const { sounds } = useMode();
  const { playWindowOpen, playWindowClose, playClick } = sounds;
  const openWindow = useCallback((id: WindowId) => {
    playWindowOpen(); dispatch({ type: 'OPEN', id });
  }, [playWindowOpen]);
  const closeWindow = useCallback((id: WindowId) => {
    playWindowClose(); dispatch({ type: 'CLOSE', id });
  }, [playWindowClose]);
  const minimizeWindow = useCallback((id: WindowId) => {
    playClick(); dispatch({ type: 'MINIMIZE', id });
  }, [playClick]);
  const maximizeWindow = useCallback((id: WindowId) => {
    playClick(); dispatch({ type: 'MAXIMIZE', id });
  }, [playClick]);
  const focusWindow = useCallback((id: WindowId) => dispatch({ type: 'FOCUS', id }), []);
  const updatePosition = useCallback((id: WindowId, position: { x: number; y: number }) => {
    dispatch({ type: 'MOVE', id, position, viewport: { width: window.innerWidth, height: window.innerHeight } });
  }, []);
  const inspectProject = useCallback((projectId: string) => {
    playWindowOpen(); dispatch({ type: 'INSPECT', projectId });
  }, [playWindowOpen]);
  const toggleDesktop = useCallback(() => { playClick(); dispatch({ type: 'DESKTOP' }); }, [playClick]);

  useEffect(() => {
    const fit = () => dispatch({ type: 'FIT', viewport: { width: window.innerWidth, height: window.innerHeight } });
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const value = useMemo(() => ({
    windows: state.windows, activeWindowId: state.activeWindowId, editorRequest: state.editorRequest,
    openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition, inspectProject, toggleDesktop,
  }), [state.windows, state.activeWindowId, state.editorRequest, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition, inspectProject, toggleDesktop]);
  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within an OSProvider');
  return context;
}
