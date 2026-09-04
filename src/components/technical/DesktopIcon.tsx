import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { WindowId } from '../../types/os';
import { useOS } from '../../context/OSContext';

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  isFolder?: boolean;
  isShortcut?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  desktopConstraintsRef?: React.RefObject<HTMLDivElement | null>;
  initialPosition?: { x: number; y: number };
  onClickAction?: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  title,
  icon,
  isFolder = false,
  isShortcut = true,
  isSelected = false,
  onSelect,
  desktopConstraintsRef,
  initialPosition,
  onClickAction,
}) => {
  const { openWindow } = useOS();
  const isDraggingRef = useRef(false);

  const handleExecute = () => {
    if (onClickAction) {
      onClickAction();
    } else {
      openWindow(id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;

    if (isSelected) {
      handleExecute();
    } else {
      onSelect?.();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleExecute();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      handleExecute();
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={desktopConstraintsRef || false}
      dragMomentum={false}
      dragElastic={0.05}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 80);
      }}
      initial={initialPosition ? { x: initialPosition.x, y: initialPosition.y } : undefined}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`desktop-icon-item ${isSelected ? 'active' : ''} ${isFolder ? 'is-folder' : ''}`}
      title={`${title} (Double-click to open)`}
    >
      <div className="desktop-icon-wrapper">
        {icon}
        {/* Authentic Windows Shortcut Arrow Badge */}
        {!isFolder && isShortcut && (
          <span className="win-shortcut-badge" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <rect width="16" height="16" rx="2" fill="#ffffff" />
              <path
                d="M4 12 C4 8.5, 6.5 6, 11 6 M8 3 L12 6 L8 9"
                stroke="#0066cc"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
      <span className="desktop-icon-label">{title}</span>
    </motion.div>
  );
};
