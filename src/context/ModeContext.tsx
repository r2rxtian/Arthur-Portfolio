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

  useEffect(() => {
    localStorage.setItem('portfolio_mode', mode);
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
