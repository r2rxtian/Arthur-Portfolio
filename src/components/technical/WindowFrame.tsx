import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls, useMotionValue, useReducedMotion } from 'framer-motion';
import { Minus, Square, Copy, X } from 'lucide-react';
import type { WindowId } from '../../types/os';
import { useOS } from '../../context/OSContext';
import { getWindowGeometry, TASKBAR_HEIGHT } from '../../context/osState';

interface WindowFrameProps { id: WindowId; title: string; icon?: ReactNode; children: ReactNode }

export function WindowFrame({ id, title, icon, children }: WindowFrameProps) {
  const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition } = useOS();
  const win = windows[id];
  const rootRef = useRef<HTMLElement>(null);
  const dragControls = useDragControls();
  const reducedMotion = useReducedMotion();
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const geometry = getWindowGeometry(win, viewport);
  const x = useMotionValue(geometry.x);
  const y = useMotionValue(geometry.y);
  const compact = viewport.width < 768;
  const maximized = win.isMaximized || compact;
  const focused = activeWindowId === id;
  const labelId = `window-title-${id}`;

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => { x.set(geometry.x); y.set(geometry.y); }, [x, y, geometry.x, geometry.y]);
  useEffect(() => {
    if (focused && win.isOpen && !win.isMinimized && !rootRef.current?.contains(document.activeElement)) {
      rootRef.current?.focus({ preventScroll: true });
    }
  }, [focused, win.isOpen, win.isMinimized]);

  return (
    <AnimatePresence>
      {win.isOpen && (
        <motion.section key={id} ref={rootRef} id={`os-window-${id}`} role="dialog" aria-modal={false}
          aria-labelledby={labelId} aria-hidden={win.isMinimized} inert={win.isMinimized} tabIndex={-1}
          drag={!maximized} dragControls={dragControls} dragListener={false} dragMomentum={false} dragElastic={0}
          dragConstraints={{ left: 0, top: 0, right: Math.max(0, viewport.width - geometry.width), bottom: Math.max(0, viewport.height - TASKBAR_HEIGHT - geometry.height) }}
          onDragEnd={() => updatePosition(id, { x: x.get(), y: y.get() })}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.975 }}
          animate={{ opacity: win.isMinimized ? 0 : 1, scale: win.isMinimized ? 0.975 : 1, display: 'flex', transitionEnd: { display: win.isMinimized ? 'none' : 'flex' } }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 32, opacity: { duration: 0.16 } }}
          exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98, pointerEvents: 'none' }}
          onPointerDownCapture={() => { if (!focused) focusWindow(id); }}
          onFocusCapture={() => { if (!focused) focusWindow(id); }}
          className={`os-window${focused ? ' is-focused' : ''}${maximized ? ' is-maximized' : ''}`}
          style={{ x, y, zIndex: win.zIndex, width: geometry.width, height: geometry.height }}>
          <div className="os-window-header"
            onPointerDown={(event) => {
              if (!maximized && event.button === 0 && !(event.target as HTMLElement).closest('button')) dragControls.start(event);
            }}
            onDoubleClick={(event) => {
              if (!compact && !(event.target as HTMLElement).closest('button')) maximizeWindow(id);
            }}>
            <div className="os-window-title" id={labelId}>{icon}<span>{title.replaceAll('—', '-')}</span></div>
            <div className="traffic-lights" onPointerDown={(event) => event.stopPropagation()}>
              <button onClick={() => minimizeWindow(id)} className="xp-btn xp-btn-min" title="Minimize" aria-label={`Minimize ${win.title}`}><Minus size={13} /></button>
              {!compact && <button onClick={() => maximizeWindow(id)} className="xp-btn xp-btn-max"
                title={maximized ? 'Restore' : 'Maximize'} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${win.title}`}>
                {maximized ? <Copy size={12} /> : <Square size={12} />}
              </button>}
              <button onClick={() => closeWindow(id)} className="xp-btn xp-btn-close" title="Close" aria-label={`Close ${win.title}`}><X size={15} /></button>
            </div>
          </div>
          <div className={`os-window-body os-app-${id}`}>{children}</div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
