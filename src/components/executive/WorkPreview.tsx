import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { projectsData } from '../../data/projects';
import { subscribePointer } from './pointer';
import { workPresentation } from './workPresentation';
import { EASE_OUT, prefersReducedMotion } from './motionUtils';

const WIDTH = 320;
const HEIGHT = 300;
// Critically damped (damping = 2·√(stiffness·mass)): settles in ~70ms with no slow tail or overshoot.
const FOLLOW = { stiffness: 900, damping: 33, mass: 0.3 };

function canPreview() {
  return typeof window !== 'undefined' && matchMedia('(pointer: fine)').matches && !prefersReducedMotion();
}

/** A floating project card that rides along with the cursor over the work index. */
export function WorkPreview({ projectId }: { projectId: string | null }) {
  const [enabled] = useState(canPreview);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, FOLLOW);
  const springY = useSpring(y, FOLLOW);
  const rotate = useTransform(useVelocity(springX), [-2000, 0, 2000], [-4, 0, 4], { clamp: true });

  useEffect(() => {
    if (!enabled) return;
    return subscribePointer(({ x: pointerX, y: pointerY }) => {
      // Float above-right of the cursor so the hovered row's own title stays readable;
      // flip left near the right edge and drop below when there's no room above.
      const flip = pointerX > innerWidth - WIDTH - 120;
      x.set(flip ? pointerX - WIDTH - 60 : pointerX + 60);
      const above = pointerY - HEIGHT - 50;
      y.set(above >= 84 ? above : Math.min(pointerY + 60, innerHeight - HEIGHT - 16));
    });
  }, [enabled, x, y]);

  // Appear exactly at the cursor (before paint) instead of sliding in from where it last was.
  const showing = projectId !== null;
  useLayoutEffect(() => {
    if (showing) { springX.jump(x.get()); springY.jump(y.get()); }
  }, [showing, springX, springY, x, y]);

  const project = projectsData.find((candidate) => candidate.id === projectId);
  if (!enabled) return null;
  const display = project ? workPresentation(project) : null;
  const Icon = display?.icon;

  return (
    <motion.div className="work-preview" aria-hidden="true" style={{ x: springX, y: springY, rotate }}>
      <AnimatePresence>
        {showing && (
          // One card stays open while moving between rows; only its contents swap.
          <motion.div key="card" className="work-preview-card"
            initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}>
            {project && display && Icon && (
              <motion.div key={project.id} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
                <div className="work-preview-art" style={{ background: project.thumbnailGradient }}>
                  <motion.span className="work-preview-icon" initial={{ scale: 0.7, rotate: -12 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
                    <Icon size={54} strokeWidth={1.2} />
                  </motion.span>
                  <span className="work-preview-category">{project.category}</span>
                </div>
                <div className="work-preview-copy">
                  <strong>{display.title}</strong>
                  <p>{project.tagline}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
