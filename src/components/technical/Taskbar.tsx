import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Terminal, Code2, FolderGit2, Cpu, UserRound, FileText, Monitor, ArrowUpRight, Volume2, VolumeX, Gamepad2, MousePointer2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { useMode } from '../../context/ModeContext';
import type { WindowId } from '../../types/os';
import { profileData } from '../../data/profile';
import profileImg from '../../assets/profile.jpg';

const apps = [
  { id: 'projects', label: 'My Projects', subtitle: 'Browse the work', icon: FolderGit2 },
  { id: 'terminal', label: 'Command Prompt', subtitle: 'Explore with commands', icon: Terminal },
  { id: 'ide', label: 'Code Studio', subtitle: 'Read project source', icon: Code2 },
  { id: 'adventure', label: 'Adventure.exe', subtitle: 'Play the project odyssey', icon: Gamepad2 },
  { id: 'skills', label: 'Tech Stack', subtitle: 'Tools and capabilities', icon: Cpu },
  { id: 'resume', label: 'Curriculum Vitae', subtitle: 'Background and experience', icon: FileText },
] as const;
const allApps = [...apps, { id: 'about', label: 'About Arthur', subtitle: 'System properties', icon: UserRound }] as const;

export function Taskbar() {
  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow, toggleDesktop } = useOS();
  const { setMode, soundEnabled, toggleSound, cursorEnabled, toggleCursor, sounds } = useMode();
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const menuRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const visibleWindows = Object.values(windows).some((win) => win.isOpen && !win.isMinimized);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !startRef.current?.contains(target)) setMenuOpen(false);
    };
    window.addEventListener('pointerdown', outside);
    return () => window.removeEventListener('pointerdown', outside);
  }, [menuOpen]);

  function menuKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation();
      setMenuOpen(false); startRef.current?.focus(); return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
      (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  }
  function launch(id: WindowId) { setMenuOpen(false); openWindow(id); }
  function taskClick(id: WindowId) {
    if (activeWindowId === id && !windows[id].isMinimized) minimizeWindow(id);
    else if (windows[id].isMinimized) openWindow(id);
    else focusWindow(id);
  }

  return (
    <>
      <AnimatePresence>
        {menuOpen && <motion.div ref={menuRef} id="os-start-menu" className="xp-start-menu" role="dialog"
          aria-label="Start menu" onKeyDown={menuKeys}
          onBlur={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node) && event.relatedTarget !== startRef.current) setMenuOpen(false);
          }}
          initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}>
          <div className="xp-menu-header">
            <img src={profileImg} alt="" className="xp-menu-avatar" width={44} height={44} />
            <div><div className="xp-menu-name">{profileData.name}</div><p className="xp-menu-role">{profileData.title}</p></div>
          </div>
          <div className="xp-menu-body">
            <div className="xp-menu-left">
              <p className="xp-menu-section-label">Programs</p>
              {apps.map(({ id, label, subtitle, icon: Icon }) => (
                <button key={id} className="xp-menu-item" onClick={() => launch(id)}>
                  <Icon size={22} strokeWidth={1.6} />
                  <span><strong>{label}</strong><small>{subtitle}</small></span>
                </button>
              ))}
            </div>
            <div className="xp-menu-right">
              <p className="xp-menu-section-label">My computer</p>
              <button className="xp-menu-item" onClick={() => launch('about')}><UserRound size={18} /> About Arthur</button>
              <button className="xp-menu-item" onClick={() => { setMenuOpen(false); toggleDesktop(); }}><Monitor size={18} /> Show desktop</button>
              <p className="xp-menu-section-label xp-menu-settings-label">Preferences</p>
              <button className="xp-menu-item" onClick={toggleSound} aria-pressed={soundEnabled}>
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}<span>Sound <small>{soundEnabled ? 'On' : 'Off'}</small></span>
              </button>
              <button className="xp-menu-item" onClick={toggleCursor} aria-pressed={cursorEnabled}>
                <MousePointer2 size={18} /><span>Pixel cursor <small>{cursorEnabled ? 'On' : 'Off'}</small></span>
              </button>
            </div>
          </div>
          <div className="xp-menu-footer">
            <button className="xp-menu-logoff-btn" onClick={() => { setMenuOpen(false); setMode('executive'); }}>
              Executive View <ArrowUpRight size={15} />
            </button>
          </div>
        </motion.div>}
      </AnimatePresence>
      <footer className="xp-taskbar" aria-label="Desktop taskbar">
        <button ref={startRef} onClick={() => { sounds.playClick(); setMenuOpen((current) => !current); }}
          className={`xp-start-btn${menuOpen ? ' is-active' : ''}`} aria-label="Start" aria-expanded={menuOpen} aria-controls="os-start-menu">
          <span className="xp-flag" aria-hidden="true"><span className="xp-flag-red" /><span className="xp-flag-green" /><span className="xp-flag-blue" /><span className="xp-flag-yellow" /></span>
          <span className="xp-start-text">start</span>
        </button>
        <div className="xp-quick-launch">
          <button onClick={toggleDesktop} aria-label={visibleWindows ? 'Show desktop' : 'Restore windows'} title={visibleWindows ? 'Show desktop' : 'Restore windows'}><Monitor size={17} /></button>
        </div>
        <nav className="xp-task-tabs" aria-label="Open applications">
          {allApps.filter((app) => windows[app.id].isOpen).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => taskClick(id)} className={`xp-task-tab${activeWindowId === id && !windows[id].isMinimized ? ' is-active' : ''}`}
              aria-pressed={activeWindowId === id && !windows[id].isMinimized} aria-controls={`os-window-${id}`} title={label}>
              <Icon size={15} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="xp-tray">
          <button onClick={toggleSound} title={soundEnabled ? 'Mute sound' : 'Enable sound'} aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'} aria-pressed={soundEnabled}>
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <time className="xp-clock" dateTime={clock.toISOString()} title={clock.toLocaleDateString(undefined, { dateStyle: 'full' })}>
            {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>
      </footer>
    </>
  );
}
