import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projectsData } from '../../data/projects';
import { skillCategoriesData } from '../../data/skills';
import { certificatesData } from '../../data/certificates';
import { WB_EASE } from './motion';

const STORAGE_KEY = 'arthuros_booted';
const steps = [
  `mount /projects ............ ${projectsData.length} found`,
  `index /skills .............. ${skillCategoriesData.reduce((total, category) => total + category.items.length, 0)} entries`,
  `verify /credentials ........ ${certificatesData.length} ok`,
  'load source excerpts ....... done',
  'start workspace',
];

function shouldBoot() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { return sessionStorage.getItem(STORAGE_KEY) !== 'true'; } catch { return true; }
}

/** A short, skippable start-up log shown once per session before the workbench appears. */
export function BootSequence() {
  const [visible, setVisible] = useState(shouldBoot);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (step < steps.length) setStep(step + 1);
      else setVisible(false);
    }, step === 0 ? 260 : step === steps.length ? 380 : 170);
    return () => clearTimeout(timer);
  }, [step, visible]);

  useEffect(() => {
    if (!visible) { try { sessionStorage.setItem(STORAGE_KEY, 'true'); } catch { /* storage unavailable */ } return; }
    const skip = () => setVisible(false);
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="wb-boot" onClick={() => setVisible(false)} role="status" aria-label="Starting ArthurOS"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
          <div className="wb-boot-inner">
            <motion.div className="wb-boot-mark" initial={{ scale: 0.6, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}>a</motion.div>
            <motion.p className="wb-boot-title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: WB_EASE, delay: 0.1 }}>
              arthur<span>os</span>
            </motion.p>
            <ol className="wb-boot-log">
              {steps.slice(0, step).map((line, index) => (
                <motion.li key={line} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, ease: WB_EASE }}>
                  <span className="wb-boot-ok">{index === steps.length - 1 ? '>' : '✓'}</span>{line}
                </motion.li>
              ))}
            </ol>
            <div className="wb-boot-progress"><motion.span animate={{ scaleX: step / steps.length }} transition={{ duration: 0.3, ease: WB_EASE }} /></div>
            <p className="wb-boot-hint">Press any key to skip</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
