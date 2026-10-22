import { useRef, useState, type MouseEvent, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CornerUpRight } from 'lucide-react';
import type { WindowId } from '../../types/os';
import { useOS } from '../../context/OSContext';

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: ReactNode;
  isFolder?: boolean;
  isShortcut?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  desktopConstraintsRef?: RefObject<HTMLDivElement | null>;
  initialPosition?: { x: number; y: number };
  onClickAction?: () => void;
}

export function DesktopIcon({ id, title, icon, isFolder = false, isShortcut = true, isSelected = false,
  onSelect, desktopConstraintsRef, initialPosition, onClickAction }: DesktopIconProps) {
  const { openWindow } = useOS();
  const reducedMotion = useReducedMotion();
  const dragging = useRef(false);
  const pointerType = useRef('');
  const [finePointer] = useState(() => matchMedia('(pointer: fine)').matches);
  const execute = () => onClickAction ? onClickAction() : openWindow(id);
  function click(event: MouseEvent) {
    event.stopPropagation();
    if (dragging.current) return;
    onSelect?.();
    if (pointerType.current === 'touch') execute();
  }
  function keys(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); event.stopPropagation(); execute();
    }
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const icons = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('.desktop-icon-item') ?? []);
      const index = icons.indexOf(event.currentTarget);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? icons.length - 1 :
        (index + (event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1) + icons.length) % icons.length;
      icons[next]?.focus();
    }
  }
  return (
    <motion.button type="button" drag={finePointer} dragConstraints={desktopConstraintsRef || false}
      dragMomentum={false} dragElastic={0} onKeyDown={keys} aria-label={`Open ${title}`} aria-pressed={isSelected}
      onPointerDown={(event) => { pointerType.current = event.pointerType; }}
      onDragStart={() => { dragging.current = true; }}
      onDragEnd={() => { setTimeout(() => { dragging.current = false; }, 80); }}
      initial={initialPosition ? { x: initialPosition.x, y: initialPosition.y } : undefined}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      onClick={click}
      onDoubleClick={(event) => { event.stopPropagation(); if (!dragging.current && pointerType.current !== 'touch') execute(); }}
      onFocus={onSelect}
      className={`desktop-icon-item${isSelected ? ' active' : ''}${isFolder ? ' is-folder' : ''}`}
      title={`${title} - double-click or press Enter to open`}>
      <span className="desktop-icon-wrapper">
        {icon}
        {!isFolder && isShortcut && <span className="win-shortcut-badge" aria-hidden="true"><CornerUpRight size={10} strokeWidth={2.5} /></span>}
      </span>
      <span className="desktop-icon-label">{title}</span>
    </motion.button>
  );
}
