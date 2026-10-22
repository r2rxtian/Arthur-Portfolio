import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ModeProvider, useMode } from './context/ModeContext';
import { OSProvider } from './context/OSContext';
import { Workbench } from './components/workbench/Workbench';
import { ExecutiveLayout } from './components/executive/ExecutiveLayout';
import { PerspectiveToggle } from './components/common/PerspectiveToggle';
import './styles/global.css';

const PortfolioContent: React.FC = () => {
  const { mode } = useMode();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [mode]);

  return (
    <>
      <AnimatePresence mode="wait">
        {mode === 'technical' ? (
          <motion.div
            key="technical"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Workbench />
          </motion.div>
        ) : (
          <motion.div
            key="executive"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            <ExecutiveLayout />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Floating Perspective Switcher */}
      {mode === 'executive' && <PerspectiveToggle />}
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
