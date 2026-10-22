import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Code2, ExternalLink, Folder, Gamepad2, LayoutGrid, List, Search, Terminal, X } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { WinFolderIcon } from './WindowsDesktopIcons';
import { projectsData } from '../../data/projects';
import { useOS } from '../../context/OSContext';

const categories = ['All', 'Full-Stack', 'Systems & Cloud'] as const;
type Category = typeof categories[number];

export function ProjectsFolderApp() {
  const { openWindow, inspectProject } = useOS();
  const [navigation, setNavigation] = useState<{ entries: Category[]; index: number }>({ entries: ['All'], index: 0 });
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const category = navigation.entries[navigation.index];
  const filtered = projectsData.filter((project) =>
    (category === 'All' || project.category === category) &&
    [project.title, project.tagline, ...project.technical.techStack].some((text) => text.toLowerCase().includes(search.trim().toLowerCase())));
  function navigate(next: Category) {
    if (next === category) return;
    setNavigation((current) => ({ entries: [...current.entries.slice(0, current.index + 1), next], index: current.index + 1 }));
  }

  return (
    <div className="xp-explorer-window">
      <div className="xp-explorer-toolbar">
        <div className="xp-nav-buttons">
          <button className="xp-nav-btn" aria-label="Back" disabled={navigation.index === 0}
            onClick={() => setNavigation((current) => ({ ...current, index: current.index - 1 }))}><ArrowLeft size={17} /></button>
          <button className="xp-nav-btn" aria-label="Forward" disabled={navigation.index === navigation.entries.length - 1}
            onClick={() => setNavigation((current) => ({ ...current, index: current.index + 1 }))}><ArrowRight size={17} /></button>
          <button className="xp-nav-btn" aria-label="All projects" disabled={category === 'All'} onClick={() => navigate('All')}><ArrowUp size={17} /></button>
        </div>
        <div className="xp-address-bar" aria-label="Current folder">
          <Folder size={16} /><button onClick={() => navigate('All')}>My Projects</button>
          {category !== 'All' && <><span aria-hidden="true">/</span><span>{category}</span></>}
        </div>
        <div className="xp-view-controls" role="group" aria-label="Project view">
          <button aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
          <button aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={17} /></button>
        </div>
      </div>
      <div className="xp-explorer-body">
        <aside className="xp-explorer-sidebar" aria-label="Project folders">
          <div className="xp-task-group">
            <h2 className="xp-group-header">Project folders</h2>
            <div className="xp-group-content xp-folders-list">
              {categories.map((item) => (
                <button key={item} onClick={() => navigate(item)} aria-pressed={category === item}
                  className={`xp-folder-item${category === item ? ' is-active' : ''}`}>
                  <Folder size={16} /><span>{item === 'All' ? 'All Projects' : item}</span>
                  <span className="xp-folder-count">{projectsData.filter((project) => item === 'All' || project.category === item).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="xp-task-group">
            <h2 className="xp-group-header">Other places</h2>
            <div className="xp-group-content">
              <button className="xp-shortcut-link" onClick={() => openWindow('ide')}><Code2 size={16} /> Code Studio</button>
              <button className="xp-shortcut-link" onClick={() => openWindow('terminal')}><Terminal size={16} /> Command Prompt</button>
              <button className="xp-shortcut-link" onClick={() => openWindow('adventure')}><Gamepad2 size={16} /> Adventure.exe</button>
            </div>
          </div>
          <div className="xp-sidebar-note"><Gamepad2 size={22} strokeWidth={1.5} /><p>Discover these projects in a playable world.</p><button onClick={() => openWindow('adventure')}>Play Adventure.exe <ArrowRight size={13} /></button></div>
        </aside>
        <div className="xp-explorer-main">
          <div className="xp-explorer-heading">
            <div><h2>{category === 'All' ? 'My Projects' : category}</h2><p>Software built around real workflows.</p></div>
            <select className="xp-mobile-categories" value={category} onChange={(event) => navigate(event.target.value as Category)} aria-label="Project category">
              {categories.map((item) => <option key={item} value={item}>{item === 'All' ? 'All Projects' : item}</option>)}
            </select>
            <div className="xp-search-wrap">
              <Search size={15} />
              <input type="search" aria-label="Search projects" placeholder="Search projects..." value={search} onChange={(event) => setSearch(event.target.value)} className="xp-search-input" />
              {search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button>}
            </div>
          </div>
          <div className={`explorer-container${view === 'list' ? ' is-list' : ''}`}>
            {filtered.map((project) => (
              <article key={project.id} className="explorer-card">
                <div className="explorer-project-title">
                  <WinFolderIcon size={36} />
                  <div><h3>{project.title.replaceAll('—', '-')}</h3><p>{project.category}</p></div>
                </div>
                <p className="explorer-card-desc">{project.tagline}</p>
                <div className="explorer-card-tech">{project.technical.techStack.slice(0, 4).map((tech) => <span key={tech} className="explorer-tech-tag">{tech}</span>)}</div>
                <div className="explorer-card-actions">
                  <button onClick={() => inspectProject(project.id)} className="explorer-btn explorer-btn-primary"><Code2 size={14} /> Inspect code</button>
                  {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="explorer-btn explorer-btn-secondary" aria-label={`View ${project.title} repository`}><GithubIcon size={14} /> Repo</a>}
                  {project.links.demo && <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="explorer-btn explorer-btn-secondary"><ExternalLink size={14} /> Demo</a>}
                </div>
              </article>
            ))}
            {filtered.length === 0 && <div className="os-empty-state" role="status"><Search size={28} strokeWidth={1.5} /><h3>No projects found</h3><p>Try a different name or technology.</p><button className="os-button" onClick={() => { setSearch(''); navigate('All'); }}>Show all projects</button></div>}
          </div>
        </div>
      </div>
      <div className="os-status-bar" role="status"><span>{filtered.length} {filtered.length === 1 ? 'item' : 'items'}{search ? ' found' : ''}</span><span>{category === 'All' ? 'My Projects' : category}</span></div>
    </div>
  );
}
