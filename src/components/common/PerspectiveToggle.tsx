import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

export const PerspectiveToggle: React.FC = () => {
  const { mode, toggleMode, soundEnabled, toggleSound } = useMode();
  const reducedMotion = useReducedMotion();

  const isTech = mode === 'technical';

  return (
    <div className={`perspective-toggle-wrapper${isTech ? '' : ' is-executive'}`}>
      <button
        onClick={toggleSound}
        className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
        title={soundEnabled ? 'Sound Effects Enabled (Mute)' : 'Sound Effects Muted (Enable)'}
        aria-label="Toggle sound feedback"
      >
        {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>

      <motion.button
        onClick={toggleMode}
        className="perspective-toggle"
        aria-label={isTech ? 'Switch to Executive View' : 'Switch to ArthurOS'}
        whileHover={reducedMotion ? undefined : { scale: isTech ? 1.03 : 1.015 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        title="Toggle Portfolio View Mode"
      >
        <span className="perspective-label">
          <Sparkles size={14} style={{ color: isTech ? '#38bdf8' : '#10b981' }} />
          <span>Perspective:</span>
        </span>

        <motion.div
          layout={!reducedMotion}
          className={`perspective-badge ${isTech ? '' : 'exec'}`}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 28 }}
        >
          {isTech ? (
            <>
              <Terminal size={13} />
              <span>ArthurOS</span>
            </>
          ) : (
            <>
              <Terminal size={13} />
              <span>ArthurOS</span>
            </>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};
