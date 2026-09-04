import React from 'react';
import {
  FolderGit2,
  Code2,
  Terminal,
  Cpu,
  UserCheck,
  FileText,
} from 'lucide-react';
import { Taskbar } from './Taskbar';
import { DesktopIcon } from './DesktopIcon';
import { WindowFrame } from './WindowFrame';
import { TerminalApp } from './TerminalApp';
import { IdeApp } from './IdeApp';
import { ProjectsFolderApp } from './ProjectsFolderApp';
import { AboutApp } from './AboutApp';
import { ResumeApp } from './ResumeApp';
import { SkillsApp } from './SkillsApp';

export const Desktop: React.FC = () => {
  return (
    <div className="desktop-container">
      {/* Cartoon Windows XP "Bliss" Landscape */}
      <div className="bliss-landscape">
        {/* Puffy cartoon clouds */}
        <div className="cartoon-cloud cartoon-cloud-1" />
        <div className="cartoon-cloud cartoon-cloud-2" />
        <div className="cartoon-cloud cartoon-cloud-3" />

        {/* Rolling Cartoon Hills (SVG) */}
        <svg
          className="bliss-hills-svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Distant hill */}
          <path
            d="M0,320 C320,240 420,180 720,260 C1020,340 1200,200 1440,240 L1440,600 L0,600 Z"
            fill="#38a169"
            opacity="0.85"
          />
          {/* Middle hill */}
          <path
            d="M0,380 C360,280 600,420 960,320 C1200,260 1340,360 1440,340 L1440,600 L0,600 Z"
            fill="#48bb78"
            opacity="0.95"
          />
          {/* Foreground main rolling hill */}
          <path
            d="M0,430 C280,330 520,380 840,440 C1140,500 1280,390 1440,410 L1440,600 L0,600 Z"
            fill="#52c41a"
          />
          {/* Vibrant bottom lush grass */}
          <path
            d="M0,520 C400,460 760,550 1100,480 C1280,450 1380,500 1440,490 L1440,600 L0,600 Z"
            fill="#389e0d"
          />
        </svg>
      </div>

      {/* Desktop Shortcuts Area */}
      <div className="desktop-icons-area">
        <DesktopIcon
          id="terminal"
          title="Command Prompt"
          icon={<Terminal size={28} color="#0055ea" />}
        />
        <DesktopIcon
          id="ide"
          title="Code Studio"
          icon={<Code2 size={28} color="#00d2ff" />}
        />
        <DesktopIcon
          id="projects"
          title="My Projects"
          icon={<FolderGit2 size={28} color="#ff7a00" />}
        />
        <DesktopIcon
          id="skills"
          title="Tech Matrix"
          icon={<Cpu size={28} color="#ff5299" />}
        />
        <DesktopIcon
          id="about"
          title="My Computer"
          icon={<UserCheck size={28} color="#8338ec" />}
        />
        <DesktopIcon
          id="resume"
          title="Resume.pdf"
          icon={<FileText size={28} color="#0055ea" />}
        />
      </div>

      {/* Active Windows */}
      <WindowFrame
        id="terminal"
        title="Command Prompt — zsh (developer@portfolio)"
        icon={<Terminal size={15} color="#ffffff" />}
      >
        <TerminalApp />
      </WindowFrame>

      <WindowFrame
        id="ide"
        title="Code Studio — Mock IDE"
        icon={<Code2 size={15} color="#ffffff" />}
      >
        <IdeApp />
      </WindowFrame>

      <WindowFrame
        id="projects"
        title="My Production Projects"
        icon={<FolderGit2 size={15} color="#ffffff" />}
      >
        <ProjectsFolderApp />
      </WindowFrame>

      <WindowFrame
        id="skills"
        title="Tech Stack & Competency Matrix"
        icon={<Cpu size={15} color="#ffffff" />}
      >
        <SkillsApp />
      </WindowFrame>

      <WindowFrame
        id="about"
        title="System Profiler — About Arthur"
        icon={<UserCheck size={15} color="#ffffff" />}
      >
        <AboutApp />
      </WindowFrame>

      <WindowFrame
        id="resume"
        title="Arthur_CV.pdf — Document Viewer"
        icon={<FileText size={15} color="#ffffff" />}
      >
        <ResumeApp />
      </WindowFrame>

      {/* Windows XP Taskbar */}
      <Taskbar />
    </div>
  );
};
