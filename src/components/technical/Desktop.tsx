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
      {/* Ambient background decoration */}
      <div className="desktop-ambient" />
      <div className="desktop-glow-blob desktop-glow-1" />
      <div className="desktop-glow-blob desktop-glow-2" />

      {/* Top Status Bar & Bottom Dock */}
      <Taskbar />

      {/* Desktop Shortcuts Area */}
      <div className="desktop-icons-area">
        <DesktopIcon
          id="terminal"
          title="Terminal CLI"
          icon={<Terminal size={26} color="#38bdf8" />}
        />
        <DesktopIcon
          id="ide"
          title="Code Studio"
          icon={<Code2 size={26} color="#818cf8" />}
        />
        <DesktopIcon
          id="projects"
          title="Projects"
          icon={<FolderGit2 size={26} color="#34d399" />}
        />
        <DesktopIcon
          id="skills"
          title="Tech Stack"
          icon={<Cpu size={26} color="#f59e0b" />}
        />
        <DesktopIcon
          id="about"
          title="About Arthur"
          icon={<UserCheck size={26} color="#ec4899" />}
        />
        <DesktopIcon
          id="resume"
          title="Resume.pdf"
          icon={<FileText size={26} color="#cbd5e1" />}
        />
      </div>

      {/* Active Windows */}
      <WindowFrame
        id="terminal"
        title="Terminal — zsh (developer@portfolio)"
        icon={<Terminal size={14} color="#38bdf8" />}
      >
        <TerminalApp />
      </WindowFrame>

      <WindowFrame
        id="ide"
        title="Code Studio — Mock IDE"
        icon={<Code2 size={14} color="#818cf8" />}
      >
        <IdeApp />
      </WindowFrame>

      <WindowFrame
        id="projects"
        title="Production Projects"
        icon={<FolderGit2 size={14} color="#34d399" />}
      >
        <ProjectsFolderApp />
      </WindowFrame>

      <WindowFrame
        id="skills"
        title="Technical Skills & Competency Matrix"
        icon={<Cpu size={14} color="#f59e0b" />}
      >
        <SkillsApp />
      </WindowFrame>

      <WindowFrame
        id="about"
        title="System Profiler — About Arthur"
        icon={<UserCheck size={14} color="#ec4899" />}
      >
        <AboutApp />
      </WindowFrame>

      <WindowFrame
        id="resume"
        title="Document Viewer — Arthur_CV.pdf"
        icon={<FileText size={14} color="#cbd5e1" />}
      >
        <ResumeApp />
      </WindowFrame>
    </div>
  );
};
