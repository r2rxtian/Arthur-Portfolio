import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Briefcase, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

export const PerspectiveToggle: React.FC = () => {
  const { mode, toggleMode, soundEnabled, toggleSound } = useMode();

  const isTech = mode === 'technical';

  return (
    <div className="perspective-toggle-wrapper">
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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        title="Toggle Portfolio View Mode"
      >
        <span className="perspective-label">
          <Sparkles size={14} style={{ color: isTech ? '#38bdf8' : '#10b981' }} />
          <span>Perspective:</span>
        </span>

        <motion.div
          layout
          className={`perspective-badge ${isTech ? '' : 'exec'}`}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {isTech ? (
            <>
              <Terminal size={13} />
              <span>Technical OS</span>
            </>
          ) : (
            <>
              <Briefcase size={13} />
              <span>Executive View</span>
            </>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};
