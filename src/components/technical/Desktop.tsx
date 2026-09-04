import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Gamepad2,
  Terminal,
  Code2,
  FolderGit2,
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
import { AdventureGameApp } from './AdventureGame/AdventureGameApp';
import {
  WinFolderIcon,
  WinAdventureIcon,
  WinVSCodeIcon,
  WinTerminalIcon,
  WinCpuIcon,
  WinPdfIcon,
} from './WindowsDesktopIcons';

export const Desktop: React.FC = () => {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [selectedIconKey, setSelectedIconKey] = React.useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered boot entrance for desktop icons
      gsap.from('.desktop-icon-item', {
        opacity: 0,
        scale: 0.85,
        y: 12,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power2.out',
        delay: 0.08,
      });

      // Subtle ambient cloud drift
      gsap.to('.bliss-cloud-wisp-1', {
        x: 35,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.bliss-cloud-wisp-2', {
        x: -25,
        duration: 26,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, desktopRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={desktopRef}
      className="desktop-container"
      onClick={() => setSelectedIconKey(null)}
    >
      {/* Authentic Windows XP "Bliss" Atmospheric Landscape */}
      <div className="bliss-landscape">
        {/* Soft Realistic Clouds */}
        <div className="bliss-cloud bliss-cloud-wisp-1" />
        <div className="bliss-cloud bliss-cloud-wisp-2" />
        <div className="bliss-cloud bliss-cloud-wisp-3" />

        {/* Rolling Hills with Realistic Sunlight and Depth */}
        <svg
          className="bliss-hills-svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Distant Ridge Gradient (Atmospheric blue-green haze) */}
            <linearGradient id="blissDistantHill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#48a068" />
              <stop offset="60%" stopColor="#308253" />
              <stop offset="100%" stopColor="#21633d" />
            </linearGradient>

            {/* Mid Hill Gradient with Sunlight Angle */}
            <linearGradient id="blissMidHill" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#68c642" />
              <stop offset="40%" stopColor="#4ea330" />
              <stop offset="100%" stopColor="#2c751d" />
            </linearGradient>

            {/* Foreground Iconic Lush Rolling Hill */}
            <linearGradient id="blissMainHill" x1="15%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#87e349" />
              <stop offset="15%" stopColor="#6dc735" />
              <stop offset="55%" stopColor="#439e20" />
              <stop offset="100%" stopColor="#2a7212" />
            </linearGradient>

            {/* Bottom Front Grass Gradient */}
            <linearGradient id="blissFrontHill" x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#5eb92c" />
              <stop offset="50%" stopColor="#3d8f1a" />
              <stop offset="100%" stopColor="#24640f" />
            </linearGradient>
          </defs>

          {/* Distant Atmospheric Hill */}
          <path
            d="M0,310 C340,240 450,170 760,250 C1040,320 1220,190 1440,230 L1440,600 L0,600 Z"
            fill="url(#blissDistantHill)"
            opacity="0.9"
          />

          {/* Mid Hill Layer */}
          <path
            d="M0,370 C320,270 580,390 920,290 C1180,240 1320,330 1440,310 L1440,600 L0,600 Z"
            fill="url(#blissMidHill)"
          />

          {/* Foreground Main Rolling Hill with Sun Crest */}
          <path
            d="M0,420 C260,310 520,360 820,410 C1110,460 1260,360 1440,380 L1440,600 L0,600 Z"
            fill="url(#blissMainHill)"
          />

          {/* Front Rich Lush Mound */}
          <path
            d="M0,510 C380,440 730,520 1060,460 C1240,430 1360,470 1440,460 L1440,600 L0,600 Z"
            fill="url(#blissFrontHill)"
          />
        </svg>
      </div>

      {/* Windows Desktop Icons — Exclusively for the 6 Portfolio Apps */}
      <div className="desktop-icons-area">
        {/* 1. Adventure.exe (Quest) */}
        <DesktopIcon
          id="adventure"
          title="Adventure.exe"
          icon={<WinAdventureIcon size={44} />}
          isFolder={false}
          isShortcut={true}
          isSelected={selectedIconKey === 'adventure'}
          onSelect={() => setSelectedIconKey('adventure')}
          desktopConstraintsRef={desktopRef}
        />

        {/* 2. Command Prompt (CLI) */}
        <DesktopIcon
          id="terminal"
          title="Command Prompt (CLI)"
          icon={<WinTerminalIcon size={44} />}
          isFolder={false}
          isShortcut={true}
          isSelected={selectedIconKey === 'terminal'}
          onSelect={() => setSelectedIconKey('terminal')}
          desktopConstraintsRef={desktopRef}
        />

        {/* 3. Code Studio IDE */}
        <DesktopIcon
          id="ide"
          title="Code Studio IDE"
          icon={<WinVSCodeIcon size={44} />}
          isFolder={false}
          isShortcut={true}
          isSelected={selectedIconKey === 'ide'}
          onSelect={() => setSelectedIconKey('ide')}
          desktopConstraintsRef={desktopRef}
        />

        {/* 4. My Projects Folder */}
        <DesktopIcon
          id="projects"
          title="My Projects"
          icon={<WinFolderIcon size={44} />}
          isFolder={true}
          isShortcut={false}
          isSelected={selectedIconKey === 'projects'}
          onSelect={() => setSelectedIconKey('projects')}
          desktopConstraintsRef={desktopRef}
        />

        {/* 5. Tech Stack Matrix */}
        <DesktopIcon
          id="skills"
          title="Tech Stack Matrix"
          icon={<WinCpuIcon size={44} />}
          isFolder={false}
          isShortcut={true}
          isSelected={selectedIconKey === 'skills'}
          onSelect={() => setSelectedIconKey('skills')}
          desktopConstraintsRef={desktopRef}
        />

        {/* 6. Curriculum Vitae */}
        <DesktopIcon
          id="resume"
          title="Curriculum Vitae"
          icon={<WinPdfIcon size={44} />}
          isFolder={false}
          isShortcut={true}
          isSelected={selectedIconKey === 'resume'}
          onSelect={() => setSelectedIconKey('resume')}
          desktopConstraintsRef={desktopRef}
        />
      </div>

      {/* Active Windows */}
      <WindowFrame
        id="adventure"
        title="Arthur Quest — The Project Odyssey (v1.0.exe)"
        icon={<Gamepad2 size={15} color="#ffd700" />}
      >
        <AdventureGameApp />
      </WindowFrame>

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
