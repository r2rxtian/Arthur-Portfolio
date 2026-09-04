import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Code2,
  FolderGit2,
  Cpu,
  UserCheck,
  FileText,
  Clock,
  Wifi,
  BatteryCharging,
  Sparkles,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import type { WindowId } from '../../types/os';
import { profileData } from '../../data/profile';

interface DockItemConfig {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
}

const dockItems: DockItemConfig[] = [
  { id: 'terminal', label: 'Terminal CLI', icon: <Terminal size={22} color="#38bdf8" /> },
  { id: 'ide', label: 'Code Studio IDE', icon: <Code2 size={22} color="#818cf8" /> },
  { id: 'projects', label: 'Projects Explorer', icon: <FolderGit2 size={22} color="#34d399" /> },
  { id: 'skills', label: 'Tech Stack Matrix', icon: <Cpu size={22} color="#f59e0b" /> },
  { id: 'about', label: 'System Profiler', icon: <UserCheck size={22} color="#ec4899" /> },
  { id: 'resume', label: 'CV Viewer', icon: <FileText size={22} color="#cbd5e1" /> },
];

export const Taskbar: React.FC = () => {
  const { windows, activeWindowId, openWindow, focusWindow } = useOS();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeWin = activeWindowId ? windows[activeWindowId] : null;

  const handleDockClick = (id: WindowId) => {
    const win = windows[id];
    if (win.isOpen && !win.isMinimized) {
      focusWindow(id);
    } else {
      openWindow(id);
    }
  };

  return (
    <>
      {/* Top Menu / Status Bar */}
      <div className="os-topbar">
        <div className="os-topbar-left">
          <div className="os-brand">
            <Sparkles size={14} className="os-brand-icon" />
            <span>ArthurOS v2.4</span>
          </div>

          {activeWin && activeWin.isOpen && (
            <span className="os-active-window-title">
              {activeWin.title}
            </span>
          )}
        </div>

        <div className="os-topbar-right">
          <div className="os-pill-badge">
            <span className="os-pulse-dot" />
            <span>{profileData.availability}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Wifi size={13} color="#94a3b8" />
            <BatteryCharging size={14} color="#10b981" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#f1f5f9' }}>
            <Clock size={12} />
            <span>{time}</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Dock */}
      <div className="os-dock-container">
        {dockItems.map((item) => {
          const win = windows[item.id];
          const isOpen = win && win.isOpen;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleDockClick(item.id)}
              className="dock-item"
              whileHover={{ y: -6, scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Open ${item.label}`}
            >
              {item.icon}
              <div className="dock-tooltip">{item.label}</div>
              {isOpen && <div className="dock-dot" />}
            </motion.button>
          );
        })}
      </div>
    </>
  );
};
