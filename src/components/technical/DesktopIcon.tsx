import React from 'react';
import { motion } from 'framer-motion';
import type { WindowId } from '../../types/os';
import { useOS } from '../../context/OSContext';

interface DesktopIconProps {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, title, icon }) => {
  const { openWindow } = useOS();
  const [selected, setSelected] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openWindow(id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`desktop-icon-item ${selected ? 'active' : ''}`}
      title={`Double-click to open ${title}`}
    >
      <div className="desktop-icon-wrapper">
        {icon}
      </div>
      <span className="desktop-icon-label">{title}</span>
    </motion.div>
  );
};
