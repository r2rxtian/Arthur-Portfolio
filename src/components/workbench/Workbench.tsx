import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Code2, Command, FileText, FolderOpen, Gamepad2, Layers3, Menu, Moon, PanelRight, Search, Sun, Terminal, Volume2, VolumeX, X, type LucideIcon } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { profileData } from '../../data/profile';
import { useOS } from '../../context/OSContext';
import { useMode } from '../../context/ModeContext';
import type { WindowId } from '../../types/os';
import profileImage from '../../assets/profile.png';
import { ProjectWorkspace, type ProjectLens } from './ProjectWorkspace';
import { ProjectInspector } from './ProjectInspector';
import { CommandPalette } from './CommandPalette';
import { presentationFor } from './workbenchData';
import { BootSequence } from './BootSequence';
import { WB_EASE } from './motion';
import { withThemeTransition } from '../../utils/themeTransition';
import { useSelectorMomentum } from '../../hooks/useMomentum';
import '../../styles/workbench.css';
import '../../styles/workbench-motion.css';

const TerminalApp = lazy(() => import('../technical/TerminalApp').then((module) => ({ default: module.TerminalApp })));
const Playroom = lazy(() => import('../technical/Playroom').then((module) => ({ default: module.Playroom })));
const AboutApp = lazy(() => import('../technical/AboutApp').then((module) => ({ default: module.AboutApp })));
const ResumeApp = lazy(() => import('../technical/ResumeApp').then((module) => ({ default: module.ResumeApp })));
const SkillsApp = lazy(() => import('../technical/SkillsApp').then((module) => ({ default: module.SkillsApp })));

const rail: { id: WindowId; label: string; icon: LucideIcon }[] = [
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'ide', label: 'Source', icon: Code2 },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'adventure', label: 'Playroom', icon: Gamepad2 },
  { id: 'skills', label: 'Skills', icon: Layers3 },
  { id: 'resume', label: 'Resume', icon: FileText },
];
const utilityPanels = [
  { id: 'terminal', label: 'Terminal', description: 'A command line for the portfolio.', component: TerminalApp },
  { id: 'adventure', label: 'The playroom', description: 'Two games, two different paths through the projects.', component: Playroom },
  { id: 'about', label: 'Meet Arthur', description: 'The person behind the projects.', component: AboutApp },
  { id: 'resume', label: 'Background & experience', description: 'A closer look at the journey.', component: ResumeApp },
  { id: 'skills', label: 'Capabilities', description: 'The tools and practices behind the work.', component: SkillsApp },
] as const;

function initialProject(requestFileId?: string) {
  const requested = projectsData.find((project) => `file-${project.id}` === requestFileId);
  if (requested) return requested.id;
  const saved = localStorage.getItem('arthuros_project');
  return projectsData.find((project) => project.id === saved)?.id ?? projectsData[0].id;
}

export function Workbench() {
  const { windows, activeWindowId, editorRequest, openWindow, inspectProject } = useOS();
  const { setMode, soundEnabled, toggleSound } = useMode();
  const activeApp = activeWindowId ?? 'projects';
  const projectView = activeApp === 'projects' || activeApp === 'ide';
  const [selection, setSelection] = useState(() => ({ id: initialProject(editorRequest?.fileId), revision: editorRequest?.revision ?? 0 }));
  const [projectLens, setProjectLens] = useState<'overview' | 'architecture'>('overview');
  const [search, setSearch] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(() => window.innerWidth >= 1280);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('arthuros_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const searchRef = useRef<HTMLInputElement>(null);
  if (editorRequest && selection.revision !== editorRequest.revision) {
    const requested = projectsData.find((project) => `file-${project.id}` === editorRequest.fileId);
    setSelection({ id: requested?.id ?? selection.id, revision: editorRequest.revision });
  }
  const project = projectsData.find((candidate) => candidate.id === selection.id) ?? projectsData[0];
  const display = presentationFor(project.id);
  const lens: ProjectLens = activeApp === 'ide' ? 'source' : projectLens;
  const matchedProjects = projectsData.filter((candidate) => `${candidate.title} ${candidate.technical.techStack.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));
  const utility = utilityPanels.find((panel) => panel.id === activeApp);
  // Long reading panes (resume, about) glide with the same momentum as the project panel.
  useSelectorMomentum(activeApp === 'resume' ? '.wb-utility-resume .resume-scroll' : activeApp === 'about' ? '.wb-utility-about .system-app' : null);

  useLayoutEffect(() => {
    document.documentElement.dataset.workspace = 'arthuros';
    return () => { delete document.documentElement.dataset.workspace; };
  }, []);
  useEffect(() => { localStorage.setItem('arthuros_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('arthuros_project', project.id); }, [project.id]);
  useEffect(() => {
    if (!projectView) return;
    const focused = document.activeElement;
    if (focused === document.body || focused?.closest('[hidden]')) document.getElementById('wb-project-panel')?.focus({ preventScroll: true });
  }, [projectView, activeApp, project.id]);
  useEffect(() => {
    const narrow = matchMedia('(max-width: 899px)');
    const resize = () => { setNavigationOpen(false); if (narrow.matches) setInspectorOpen(false); };
    narrow.addEventListener('change', resize);
    return () => narrow.removeEventListener('change', resize);
  }, []);
  // Focus the filter only with a mouse/trackpad; on touch it would pop the keyboard over the list.
  useEffect(() => { if (navigationOpen && matchMedia('(pointer: fine)').matches) searchRef.current?.focus(); }, [navigationOpen]);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPaletteOpen((current) => !current); }
      if (event.ctrlKey && event.code === 'Backquote') { event.preventDefault(); setPaletteOpen(false); setNavigationOpen(false); openWindow('terminal'); }
      if (event.key === 'Escape' && !(event.target as HTMLElement)?.closest('dialog[open], [aria-modal="true"]')) { setNavigationOpen(false); setInspectorOpen(false); }
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [openWindow]);

  function navigate(id: WindowId) {
    setNavigationOpen(false);
    if (id === 'ide') inspectProject(project.id);
    else openWindow(id);
  }
  function selectProject(id: string, retainLens = true) {
    setSelection((current) => ({ ...current, id }));
    setNavigationOpen(false);
    if (retainLens && activeApp === 'ide') inspectProject(id);
    else { if (!retainLens) setProjectLens('overview'); openWindow('projects'); }
  }
  function changeLens(next: ProjectLens) {
    if (next === 'source') inspectProject(project.id);
    else { setProjectLens(next); openWindow('projects'); }
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
      <div className={`wb-root${navigationOpen ? ' is-navigation-open' : ''}${projectView && inspectorOpen ? ' has-inspector' : ''}`} data-theme={theme}>
        <a className="wb-skip-link" href="#wb-main">Skip to workspace</a>
        <header className="wb-header">
          <button className="wb-brand" onClick={() => { setProjectLens('overview'); navigate('projects'); }} aria-label="ArthurOS project workspace">
            <span className="wb-brand-mark">a</span><span>arthur<span className="wb-brand-os">os</span><small>Engineering workbench</small></span>
          </button>
          <div className="wb-header-breadcrumb"><span>Workspace</span><ChevronRight size={13} />
            <motion.strong key={projectView ? 'projects' : activeApp} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: WB_EASE }}>
              {projectView ? 'Projects' : utility?.label ?? 'Projects'}
            </motion.strong>
          </div>
          <div className="wb-header-actions">
            <button className="wb-command-trigger" onClick={() => setPaletteOpen(true)} aria-label="Find a project or open a tool"><Search size={15} /><span>Find anything</span><kbd>Ctrl K</kbd></button>
            <button className="wb-icon-button wb-theme-toggle" onClick={(event) => withThemeTransition(event.currentTarget, () => setTheme(theme === 'dark' ? 'light' : 'dark'))} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} appearance`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button className="wb-executive-link" onClick={() => setMode('executive')}>Executive view <ArrowUpRight size={14} /></button>
          </div>
        </header>

        <div className="wb-body">
          <nav className="wb-app-rail" aria-label="Workspace tools">
            <div className="wb-rail-tools">{rail.map(({ id, label, icon: Icon }) => (
              <button key={id} className="wb-rail-button" aria-current={activeApp === id ? 'page' : undefined} onClick={() => navigate(id)} title={label}>
                {activeApp === id && <motion.span className="wb-rail-selection" layoutId="wb-app-selection" />}
                <Icon size={21} strokeWidth={1.5} /><span>{label}</span>
              </button>
            ))}</div>
            <button className="wb-profile-button" onClick={() => navigate('about')} aria-label="Meet Arthur" aria-current={activeApp === 'about' ? 'page' : undefined}><img src={profileImage} alt="" width={32} height={32} /></button>
          </nav>

          {navigationOpen && <button className="wb-navigation-shade" onClick={() => setNavigationOpen(false)} aria-label="Close project navigator" />}
          <aside className="wb-project-nav" id="wb-project-navigation" aria-label="Project navigator">
            <div className="wb-nav-heading"><h2>Projects <span>{projectsData.length}</span></h2><button className="wb-icon-button wb-nav-close" onClick={() => setNavigationOpen(false)} aria-label="Close project navigator"><X size={16} /></button></div>
            <div className="wb-project-search"><Search size={14} /><input ref={searchRef} aria-label="Filter projects" placeholder="Filter projects..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button onClick={() => setSearch('')} aria-label="Clear project filter"><X size={13} /></button>}</div>
            <div className="wb-project-list">{matchedProjects.map((candidate, index) => {
              const presentation = presentationFor(candidate.id);
              const Icon = presentation.icon;
              const current = candidate.id === project.id && projectView;
              return <motion.button key={candidate.id} className="wb-project-item" title={candidate.title} aria-current={current ? 'true' : undefined} onClick={() => selectProject(candidate.id)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: WB_EASE, delay: 0.15 + index * 0.05 }}>
                {current && <motion.span className="wb-project-selection" layoutId="wb-project-selection" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                <Icon size={18} strokeWidth={1.5} /><span><strong>{presentation.name}</strong><small>{presentation.description}</small></span>{current && <ChevronRight size={13} />}
              </motion.button>;
            })}
              {matchedProjects.length === 0 && <div className="wb-project-empty"><p>No matching projects.</p><button className="wb-inline-action" onClick={() => setSearch('')}>Clear filter</button></div>}
            </div>
            <button className="wb-navigator-profile" onClick={() => navigate('about')}><span className="wb-caption">Built by</span><strong>{profileData.name}</strong><span>{profileData.title}</span><span className="wb-availability"><i aria-hidden="true" /> Open to opportunities</span></button>
          </aside>

          <main className="wb-main" id="wb-main" tabIndex={-1}>
            <div className="wb-context-bar"><div><button className="wb-icon-button wb-sidebar-toggle" onClick={() => { setInspectorOpen(false); setNavigationOpen((current) => !current); }} aria-expanded={navigationOpen} aria-controls="wb-project-navigation" aria-label="Toggle project navigator"><Menu size={18} /></button>
              {projectView ? <><span>{display.name}</span><ChevronRight size={12} /><span className="wb-context-detail">{lens === 'source' ? 'Source' : projectLens === 'architecture' ? 'Architecture' : 'Overview'}</span></> : <><h1>{utility?.label}</h1><span className="wb-tool-description">{utility?.description}</span></>}
            </div>{projectView && <button className="wb-inspector-toggle" aria-expanded={inspectorOpen} onClick={() => { setNavigationOpen(false); setInspectorOpen((current) => !current); }}><PanelRight size={15} /><span>Project brief</span></button>}</div>

            <section className="wb-app-surface wb-project-surface" hidden={!projectView} inert={!projectView} aria-label="Project workspace"><ProjectWorkspace project={project} lens={lens} onLens={changeLens} /></section>
            {utilityPanels.map(({ id, label, component: Component }) => windows[id].isOpen && (
              <section key={id} className={`wb-app-surface wb-utility-pane wb-utility-${id}`} hidden={activeApp !== id} inert={activeApp !== id} aria-label={label}>
                <div className="wb-utility-content"><Suspense fallback={<div className="wb-loading" role="status">Opening {label.toLowerCase()}...</div>}><Component /></Suspense></div>
              </section>
            ))}
          </main>
          {/* On narrower screens the brief overlays the workspace; tapping outside closes it. */}
          {projectView && inspectorOpen && <button className="wb-inspector-shade" onClick={() => setInspectorOpen(false)} aria-label="Close project brief" tabIndex={-1} />}
          {projectView && inspectorOpen && <ProjectInspector project={project} onClose={() => setInspectorOpen(false)} onSource={() => changeLens('source')} />}
        </div>

        <footer className="wb-status-bar"><div><span className="wb-status-mark" aria-hidden="true">a</span><span>ArthurOS</span><span className="wb-status-divider" />{projectView ? <span>{project.category}</span> : <span>{utility?.label}</span>}</div>
          <div><span className="wb-shortcut-note"><Command size={12} /> Ctrl K to navigate</span><button onClick={toggleSound} aria-label={soundEnabled ? 'Mute interface sounds' : 'Enable interface sounds'} aria-pressed={soundEnabled}>{soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}<span>Sound {soundEnabled ? 'on' : 'off'}</span></button></div>
        </footer>
        <BootSequence />
        {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onProject={(id) => selectProject(id, false)} onApp={navigate} onExecutive={() => setMode('executive')} />}
      </div>
    </MotionConfig>
  );
}
