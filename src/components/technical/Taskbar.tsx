import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Code2,
  FolderGit2,
  Cpu,
  UserCheck,
  FileText,
  Clock,
  Sparkles,
  Briefcase,
  Volume2,
  VolumeX,
  Gamepad2,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { useMode } from '../../context/ModeContext';
import type { WindowId } from '../../types/os';
import { profileData } from '../../data/profile';

interface WindowConfig {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
}

const windowConfigs: WindowConfig[] = [
  { id: 'adventure', label: 'Adventure.exe', icon: <Gamepad2 size={15} color="#ffd700" /> },
  { id: 'terminal', label: 'Terminal CLI', icon: <Terminal size={15} color="#2ed573" /> },
  { id: 'ide', label: 'Code Studio IDE', icon: <Code2 size={15} color="#00d2ff" /> },
  { id: 'projects', label: 'Projects Explorer', icon: <FolderGit2 size={15} color="#ffa502" /> },
  { id: 'skills', label: 'Tech Stack Matrix', icon: <Cpu size={15} color="#ff5299" /> },
  { id: 'about', label: 'System Profiler', icon: <UserCheck size={15} color="#8338ec" /> },
  { id: 'resume', label: 'Arthur_CV.pdf', icon: <FileText size={15} color="#0055ea" /> },
];

export const Taskbar: React.FC = () => {
  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow } = useOS();
  const { setMode, soundEnabled, toggleSound, sounds } = useMode();
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  // Close start menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startBtn = document.querySelector('.xp-start-btn');
        if (startBtn && startBtn.contains(e.target as Node)) return;
        setStartMenuOpen(false);
      }
    };
    if (startMenuOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [startMenuOpen]);

  const handleStartToggle = () => {
    sounds.playClick();
    setStartMenuOpen((prev) => !prev);
  };

  const handleTaskClick = (id: WindowId) => {
    sounds.playClick();
    const win = windows[id];
    if (win.isOpen) {
      if (win.isMinimized) {
        openWindow(id);
      } else if (activeWindowId === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    } else {
      openWindow(id);
    }
  };

  const handleLaunchApp = (id: WindowId) => {
    sounds.playClick();
    setStartMenuOpen(false);
    openWindow(id);
  };

  return (
    <>
      {/* Windows XP Start Menu */}
      {startMenuOpen && (
        <div ref={menuRef} className="xp-start-menu">
          {/* Header */}
          <div className="xp-menu-header">
            <div className="xp-menu-avatar">AC</div>
            <div>
              <div className="xp-menu-name">{profileData.name}</div>
              <div style={{ fontSize: 11.5, color: '#e0f2fe', fontWeight: 600 }}>
                {profileData.title}
              </div>
            </div>
          </div>

          {/* Dual-column body */}
          <div className="xp-menu-body">
            {/* Left Column: Pinned Programs */}
            <div className="xp-menu-left">
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', paddingLeft: 8 }}>
                Programs
              </span>
              <div
                className="xp-menu-item"
                style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}
                onClick={() => handleLaunchApp('adventure')}
              >
                <Gamepad2 size={18} color="#d97706" />
                <span style={{ fontWeight: 700, color: '#92400e' }}>Adventure.exe (Quest)</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 9,
                    fontWeight: 800,
                    background: '#f59e0b',
                    color: '#ffffff',
                    padding: '2px 5px',
                    borderRadius: 3,
                  }}
                >
                  NEW
                </span>
              </div>
              <div className="xp-menu-item" onClick={() => handleLaunchApp('terminal')}>
                <Terminal size={18} color="#2ed573" />
                <span>Command Prompt (CLI)</span>
              </div>
              <div className="xp-menu-item" onClick={() => handleLaunchApp('ide')}>
                <Code2 size={18} color="#00d2ff" />
                <span>Code Studio IDE</span>
              </div>
              <div className="xp-menu-item" onClick={() => handleLaunchApp('projects')}>
                <FolderGit2 size={18} color="#ffa502" />
                <span>My Projects</span>
              </div>
              <div className="xp-menu-item" onClick={() => handleLaunchApp('skills')}>
                <Cpu size={18} color="#ff5299" />
                <span>Tech Stack Matrix</span>
              </div>
              <div className="xp-menu-item" onClick={() => handleLaunchApp('resume')}>
                <FileText size={18} color="#0055ea" />
                <span>Curriculum Vitae</span>
              </div>
            </div>

            {/* Right Column: Places & Settings */}
            <div className="xp-menu-right">
              <span style={{ fontSize: 11, fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', paddingLeft: 8 }}>
                System & Info
              </span>
              <div className="xp-menu-item" onClick={() => handleLaunchApp('about')}>
                <UserCheck size={16} color="#0036ab" />
                <span>System Profiler</span>
              </div>
              <div
                className="xp-menu-item"
                onClick={() => {
                  toggleSound();
                  sounds.playClick();
                }}
              >
                {soundEnabled ? <Volume2 size={16} color="#0036ab" /> : <VolumeX size={16} color="#0036ab" />}
                <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
              </div>
              <div
                className="xp-menu-item"
                onClick={() => {
                  setStartMenuOpen(false);
                  setMode('executive');
                }}
                style={{ marginTop: 'auto', background: '#ffcf24', border: '1.5px solid #192038', color: '#192038' }}
              >
                <Briefcase size={16} color="#192038" />
                <span>Executive View</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="xp-menu-footer">
            <button
              onClick={() => {
                setStartMenuOpen(false);
                setMode('executive');
              }}
              className="xp-menu-logoff-btn"
            >
              <Sparkles size={14} color="#ffcf24" />
              <span>Switch to Recruiter View</span>
            </button>
          </div>
        </div>
      )}

      {/* Windows XP Bottom Taskbar */}
      <div className="xp-taskbar">
        {/* Iconic Green Start Button */}
        <button
          onClick={handleStartToggle}
          className={`xp-start-btn ${startMenuOpen ? 'is-active' : ''}`}
          aria-label="Windows XP Start"
        >
          <div className="xp-flag">
            <span className="xp-flag-red" />
            <span className="xp-flag-green" />
            <span className="xp-flag-blue" />
            <span className="xp-flag-yellow" />
          </div>
          <span className="xp-start-text">start</span>
        </button>

        {/* Task Tabs for Open Windows */}
        <div className="xp-task-tabs">
          {windowConfigs.map((cfg) => {
            const win = windows[cfg.id];
            if (!win.isOpen) return null;

            const isActive = activeWindowId === cfg.id && !win.isMinimized;

            return (
              <button
                key={cfg.id}
                onClick={() => handleTaskClick(cfg.id)}
                className={`xp-task-tab ${isActive ? 'is-active' : ''}`}
                title={win.title}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray & Clock */}
        <div className="xp-tray">
          <button
            onClick={toggleSound}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {soundEnabled ? <Volume2 size={15} color="#ffffff" /> : <VolumeX size={15} color="#cbd5e1" />}
          </button>
          <Clock size={14} color="#ffffff" />
          <span className="xp-clock">{time}</span>
        </div>
      </div>
    </>
  );
};
