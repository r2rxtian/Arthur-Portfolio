import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ModeProvider, useMode, type PortfolioMode } from './context/ModeContext';
import { OSProvider } from './context/OSContext';
import { Workbench } from './components/workbench/Workbench';
import { ExecutiveLayout } from './components/executive/ExecutiveLayout';
import { PerspectiveToggle } from './components/common/PerspectiveToggle';
import './styles/global.css';

const EASE = [0.76, 0, 0.24, 1] as const;
const curtainCopy: Record<PortfolioMode, { label: string; caption: string }> = {
  technical: { label: 'arthuros', caption: 'Booting the engineering workbench' },
  executive: { label: 'Arthur Christian.', caption: 'Opening the portfolio' },
};

/**
 * The visible view trails the requested mode: a curtain wipes up, the view swaps
 * while the screen is covered, then the curtain lifts away.
 */
const PortfolioContent: React.FC = () => {
  const { mode } = useMode();
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(mode);
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');

  // A new mode request starts the curtain (or swaps straight away when motion is reduced).
  if (mode !== shown && phase === 'idle') {
    if (reducedMotion) setShown(mode);
    else setPhase('cover');
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [shown]);

  const copy = curtainCopy[mode];

  return (
    <>
      <div style={{ width: '100%', minHeight: shown === 'executive' ? '100vh' : '100%', height: shown === 'technical' ? '100%' : undefined }}>
        {shown === 'technical' ? <Workbench /> : <ExecutiveLayout />}
      </div>

      {phase !== 'idle' && (
        <motion.div
          className={`mode-curtain is-${mode}`}
          aria-hidden="true"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: phase === 'cover' ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: phase === 'cover' ? 0.6 : 0.75, ease: EASE, delay: phase === 'reveal' ? 0.2 : 0 }}
          onAnimationComplete={() => {
            if (phase === 'cover') {
              // The curtain already announced ArthurOS, so its boot log would only repeat it.
              if (mode === 'technical') { try { sessionStorage.setItem('arthuros_booted', 'true'); } catch { /* storage unavailable */ } }
              setShown(mode); setPhase('reveal');
            }
            else setPhase('idle');
          }}
        >
          <motion.div className="mode-curtain-copy"
            initial={{ y: 40, opacity: 0 }}
            animate={phase === 'cover' ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: phase === 'cover' ? 0.15 : 0 }}>
            <strong>{copy.label}</strong>
            <span>{copy.caption}</span>
            <i className="mode-curtain-bar" />
          </motion.div>
        </motion.div>
      )}

      {/* Global Floating Perspective Switcher */}
      {shown === 'executive' && <PerspectiveToggle />}
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
