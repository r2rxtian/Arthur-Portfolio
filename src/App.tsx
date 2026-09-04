import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModeProvider, useMode } from './context/ModeContext';
import { OSProvider } from './context/OSContext';
import { Desktop } from './components/technical/Desktop';
import { ExecutiveLayout } from './components/executive/ExecutiveLayout';
import { PerspectiveToggle } from './components/common/PerspectiveToggle';
import { CustomCursor } from './components/common/CustomCursor';
import './styles/global.css';

const PortfolioContent: React.FC = () => {
  const { mode } = useMode();

  return (
    <>
      {/* Animated Custom Reticle Cursor */}
      <CustomCursor />

      <AnimatePresence mode="wait">
        {mode === 'technical' ? (
          <motion.div
            key="technical"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', height: '100%' }}
          >
            <Desktop />
          </motion.div>
        ) : (
          <motion.div
            key="executive"
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            <ExecutiveLayout />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Floating Perspective Switcher */}
      <PerspectiveToggle />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ModeProvider>
      <OSProvider>
        <PortfolioContent />
      </OSProvider>
    </ModeProvider>
  );
};

export default App;
