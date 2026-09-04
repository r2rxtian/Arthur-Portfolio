import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import type { WindowId } from '../../types/os';
import { useOS } from '../../context/OSContext';

interface WindowFrameProps {
  id: WindowId;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ id, title, icon, children }) => {
  const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, focusWindow } =
    useOS();
  const win = windows[id];
  const dragControls = useDragControls();

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  const isFocused = activeWindowId === id;

  return (
    <motion.div
      drag={!win.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.94, x: win.position.x, y: win.position.y + 8 }}
      animate={{ opacity: 1, scale: 1, x: win.position.x, y: win.position.y }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseDown={() => focusWindow(id)}
      className={`os-window ${isFocused ? 'is-focused' : ''} ${win.isMaximized ? 'is-maximized' : ''}`}
      style={{
        zIndex: win.zIndex,
        width: win.isMaximized ? '100vw' : win.size.width,
        height: win.isMaximized ? 'calc(100vh - 36px)' : win.size.height,
        left: win.isMaximized ? 0 : undefined,
        top: win.isMaximized ? 0 : undefined,
      }}
    >
      {/* Classic Windows XP Luna Title bar */}
      <div
        className="os-window-header"
        onPointerDown={(e) => {
          if (!win.isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <div className="os-window-title">
          {icon}
          <span>{title}</span>
        </div>

        {/* Windows XP Gel Buttons (Min, Max, Close) */}
        <div className="traffic-lights">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="xp-btn xp-btn-min"
            title="Minimize"
            aria-label="Minimize window"
          >
            —
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="xp-btn xp-btn-max"
            title="Maximize / Restore"
            aria-label="Maximize window"
          >
            ◻
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="xp-btn xp-btn-close"
            title="Close"
            aria-label="Close window"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="os-window-body">{children}</div>
    </motion.div>
  );
};
