import React, { useState } from 'react';
import {
  ExternalLink,
  Code2,
  Sparkles,
  Folder,
  FolderGit2,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Search,
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { projectsData } from '../../data/projects';
import { useOS } from '../../context/OSContext';

export const ProjectsFolderApp: React.FC = () => {
  const { openWindow } = useOS();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Full-Stack',
    'Systems & Cloud',
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesCat = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technical.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="xp-explorer-window">
      {/* Windows XP Standard Explorer Toolbar */}
      <div className="xp-explorer-toolbar">
        <div className="xp-nav-buttons">
          <button className="xp-nav-btn" title="Back">
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <button className="xp-nav-btn" title="Forward">
            <ArrowRight size={14} />
          </button>
          <button className="xp-nav-btn" title="Up One Level">
            <ArrowUp size={14} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="xp-address-bar">
          <span className="xp-address-label">Address</span>
          <div className="xp-address-input-wrap">
            <Folder size={14} color="#f59e0b" />
            <span className="xp-address-text">
              C:\Arthur\Projects{activeCategory !== 'All' ? `\\${activeCategory}` : ''}
            </span>
          </div>
          <button className="xp-go-btn">Go</button>
        </div>

        {/* Search Input */}
        <div className="xp-search-wrap">
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="xp-search-input"
          />
        </div>
      </div>

      {/* Main Body: Dual-Pane Explorer */}
      <div className="xp-explorer-body">
        {/* Left Pane: Windows XP Classic Blue Task Sidebar */}
        <div className="xp-explorer-sidebar">
          {/* Section 1: Mini-Game Quick Action Banner */}
          <div className="xp-task-group xp-game-task-group">
            <div className="xp-group-header">
              <Gamepad2 size={15} color="#d97706" />
              <span>Interactive Odyssey</span>
            </div>
            <div className="xp-group-content">
              <p className="xp-game-sidebar-pitch">
                Explore portfolio milestones as interactive shrines in a 2D RPG mini-game!
              </p>
              <button
                onClick={() => openWindow('adventure')}
                className="xp-launch-game-btn"
                title="Play Adventure.exe mini-game"
              >
                <Gamepad2 size={14} />
                <span>Play Adventure.exe</span>
              </button>
            </div>
          </div>

          {/* Section 2: Project Folders Pane */}
          <div className="xp-task-group">
            <div className="xp-group-header">
              <FolderGit2 size={15} color="#0055ea" />
              <span>Project Folders</span>
            </div>
            <div className="xp-group-content xp-folders-list">
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`xp-folder-item ${activeCategory === cat ? 'is-active' : ''}`}
                >
                  <Folder
                    size={15}
                    color={activeCategory === cat ? '#0055ea' : '#f59e0b'}
                  />
                  <span>{cat === 'All' ? 'All Projects' : cat}</span>
                  <span className="xp-folder-count">
                    {cat === 'All'
                      ? projectsData.length
                      : projectsData.filter((p) => p.category === cat).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: System Shortcuts */}
          <div className="xp-task-group">
            <div className="xp-group-header">
              <span>Quick Actions</span>
            </div>
            <div className="xp-group-content">
              <div className="xp-shortcut-link" onClick={() => openWindow('ide')}>
                <Code2 size={14} color="#00d2ff" />
                <span>Open Code Studio IDE</span>
              </div>
              <div className="xp-shortcut-link" onClick={() => openWindow('terminal')}>
                <span>⚡ Open Command Prompt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Project Cards & Featured Mini-Game Banner */}
        <div className="xp-explorer-main">
          {/* Interactive Game Showcase Banner inside the Dashboard */}
          <div className="xp-dashboard-game-banner">
            <div className="xp-banner-left">
              <div className="xp-banner-badge">
                <Sparkles size={13} color="#ffd700" />
                <span>RETRO MINI-GAME FEATURED</span>
              </div>
              <h3 className="xp-banner-title">Adventure.exe — The Project Odyssey</h3>
              <p className="xp-banner-desc">
                Wander through retro 2D pixel-art shrines to discover Arthur's projects, inspect live software specs, and unlock completion badges.
              </p>
            </div>
            <button
              onClick={() => openWindow('adventure')}
              className="xp-banner-play-btn"
              title="Launch Adventure.exe"
            >
              <Gamepad2 size={16} />
              <span>Launch Mini-Game</span>
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="explorer-container">
            {filteredProjects.map((project) => (
              <div key={project.id} className="explorer-card">
                <div
                  style={{
                    height: 44,
                    borderRadius: 6,
                    background: project.thumbnailGradient,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13.5,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
                  }}
                >
                  <Sparkles size={15} style={{ marginRight: 8 }} />
                  <span>{project.title}</span>
                </div>

                <div className="explorer-card-header">
                  <span className="explorer-card-badge">{project.category}</span>
                </div>

                <p className="explorer-card-desc">{project.tagline}</p>

                <div className="explorer-card-tech">
                  {project.technical.techStack.map((tech) => (
                    <span key={tech} className="explorer-tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="explorer-card-actions">
                  <button
                    onClick={() => openWindow('ide')}
                    className="explorer-btn explorer-btn-primary"
                    title="Inspect code in Mock IDE"
                  >
                    <Code2 size={14} />
                    <span>Inspect Code</span>
                  </button>

                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-btn explorer-btn-secondary"
                      title="View GitHub Repository"
                    >
                      <GithubIcon size={14} />
                      <span>Repo</span>
                    </a>
                  )}

                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-btn explorer-btn-secondary"
                      title="Open Live Deployment"
                    >
                      <ExternalLink size={14} />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
