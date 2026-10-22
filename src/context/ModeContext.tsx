import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

export type PortfolioMode = 'technical' | 'executive';

interface ModeContextType {
  mode: PortfolioMode;
  setMode: (mode: PortfolioMode) => void;
  toggleMode: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  cursorEnabled: boolean;
  toggleCursor: () => void;
  sounds: ReturnType<typeof useSoundEffects>;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<PortfolioMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_mode');
      if (saved === 'technical' || saved === 'executive') return saved;
    }
    return 'technical';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio_sound') === 'true';
    }
    return false;
  });

  const sounds = useSoundEffects(soundEnabled);
  const [cursorEnabled, setCursorEnabled] = useState(() => localStorage.getItem('portfolio_cursor') === 'true');
  const toggleCursor = () => setCursorEnabled((current) => !current);

  useEffect(() => {
    localStorage.setItem('portfolio_cursor', String(cursorEnabled));
    document.documentElement.dataset.customCursor = String(cursorEnabled);
  }, [cursorEnabled]);

  useEffect(() => {
    localStorage.setItem('portfolio_mode', mode);
    document.documentElement.dataset.portfolioMode = mode;
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('portfolio_sound', soundEnabled.toString());
  }, [soundEnabled]);

  const setMode = (newMode: PortfolioMode) => {
    sounds.playToggle();
    setModeState(newMode);
  };

  const toggleMode = () => {
    sounds.playToggle();
    setModeState((prev) => (prev === 'technical' ? 'executive' : 'technical'));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
  };

  const toggleSound = () => {
    setSoundEnabledState((prev) => !prev);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        cursorEnabled,
        toggleCursor,
        sounds,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
