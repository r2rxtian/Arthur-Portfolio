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
      initial={win.position}
      onMouseDown={() => focusWindow(id)}
      className={`os-window ${isFocused ? 'is-focused' : ''} ${win.isMaximized ? 'is-maximized' : ''}`}
      style={{
        zIndex: win.zIndex,
        width: win.isMaximized ? '100vw' : win.size.width,
        height: win.isMaximized ? 'calc(100vh - 104px)' : win.size.height,
        left: win.isMaximized ? 0 : undefined,
        top: win.isMaximized ? 32 : undefined,
      }}
    >
      {/* Title bar / Drag handle */}
      <div
        className="os-window-header"
        onPointerDown={(e) => {
          if (!win.isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <div className="traffic-lights">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="traffic-btn traffic-btn-close"
            title="Close"
            aria-label="Close window"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="traffic-btn traffic-btn-minimize"
            title="Minimize"
            aria-label="Minimize window"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="traffic-btn traffic-btn-maximize"
            title="Maximize / Restore"
            aria-label="Maximize window"
          />
        </div>

        <div className="os-window-title">
          {icon}
          <span>{title}</span>
        </div>

        <div style={{ width: 48 }} />
      </div>

      {/* Window Body */}
      <div className="os-window-body">{children}</div>
    </motion.div>
  );
};
