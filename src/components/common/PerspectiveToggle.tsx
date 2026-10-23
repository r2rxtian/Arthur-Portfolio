import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

/** Hides the switch while the reader scrolls down and brings it back on scroll up or near the top/bottom. */
function useTucked(enabled: boolean) {
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let last = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      const nearEnd = current + innerHeight >= document.documentElement.scrollHeight - 120;
      const next = current > 240 && current > last + 4 && !nearEnd ? true : current < last - 4 || current < 240 || nearEnd ? false : null;
      if (next !== null) setTucked(next);
      last = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);
  return tucked;
}

export const PerspectiveToggle: React.FC = () => {
  const { mode, toggleMode, soundEnabled, toggleSound } = useMode();
  const reducedMotion = useReducedMotion();

  const isTech = mode === 'technical';
  const tucked = useTucked(!isTech);

  return (
    <div className={`perspective-toggle-wrapper${isTech ? '' : ' is-executive'}${tucked ? ' is-tucked' : ''}`}>
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
          <Terminal size={13} />
          <span className="perspective-badge-text">ArthurOS</span>
        </motion.div>
      </motion.button>
    </div>
  );
};
