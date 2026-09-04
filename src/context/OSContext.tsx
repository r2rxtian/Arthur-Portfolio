import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WindowId, WindowState } from '../types/os';
import { useMode } from './ModeContext';

interface OSContextType {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void;
}

const initialWindows: Record<WindowId, WindowState> = {
  adventure: {
    id: 'adventure',
    title: 'Arthur Quest — The Project Odyssey (v1.0.exe)',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 200, y: 40 },
    size: { width: 840, height: 550 },
  },
  projects: {
    id: 'projects',
    title: 'My Projects — C:\\Arthur\\Projects',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 170, y: 65 },
    size: { width: 800, height: 490 },
  },
  terminal: {
    id: 'terminal',
    title: 'Command Prompt — zsh (developer@portfolio)',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 120, y: 80 },
    size: { width: 680, height: 420 },
  },
  ide: {
    id: 'ide',
    title: 'Visual Studio Code — Code Studio',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 160, y: 75 },
    size: { width: 840, height: 510 },
  },
  about: {
    id: 'about',
    title: 'This PC — System Properties',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 200, y: 110 },
    size: { width: 620, height: 430 },
  },
  resume: {
    id: 'resume',
    title: 'Arthur_CV.pdf — Document Viewer',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 220, y: 80 },
    size: { width: 720, height: 500 },
  },
  skills: {
    id: 'skills',
    title: 'CPUID CPU-Z — Tech Matrix Inspector',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 180, y: 100 },
    size: { width: 660, height: 450 },
  },
};

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const [, setTopZIndex] = useState<number>(20);
  const { sounds } = useMode();

  const focusWindow = useCallback(
    (id: WindowId) => {
      setTopZIndex((prev) => {
        const nextZ = prev + 1;
        setWindows((wins) => ({
          ...wins,
          [id]: {
            ...wins[id],
            zIndex: nextZ,
            isMinimized: false,
          },
        }));
        return nextZ;
      });
      setActiveWindowId(id);
    },
    []
  );

  const openWindow = useCallback(
    (id: WindowId) => {
      sounds.playWindowOpen();
      setTopZIndex((prev) => {
        const nextZ = prev + 1;
        setWindows((wins) => ({
          ...wins,
          [id]: {
            ...wins[id],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          },
        }));
        return nextZ;
      });
      setActiveWindowId(id);
    },
    [sounds]
  );

  const closeWindow = useCallback(
    (id: WindowId) => {
      sounds.playWindowClose();
      setWindows((wins) => ({
        ...wins,
        [id]: {
          ...wins[id],
          isOpen: false,
        },
      }));
      setActiveWindowId((current) => (current === id ? null : current));
    },
    [sounds]
  );

  const minimizeWindow = useCallback(
    (id: WindowId) => {
      sounds.playClick();
      setWindows((wins) => ({
        ...wins,
        [id]: {
          ...wins[id],
          isMinimized: true,
        },
      }));
      setActiveWindowId((current) => (current === id ? null : current));
    },
    [sounds]
  );

  const maximizeWindow = useCallback(
    (id: WindowId) => {
      sounds.playClick();
      setWindows((wins) => ({
        ...wins,
        [id]: {
          ...wins[id],
          isMaximized: !wins[id].isMaximized,
        },
      }));
    },
    [sounds]
  );

  const updatePosition = useCallback((id: WindowId, position: { x: number; y: number }) => {
    setWindows((wins) => ({
      ...wins,
      [id]: {
        ...wins[id],
        position,
      },
    }));
  }, []);

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updatePosition,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
