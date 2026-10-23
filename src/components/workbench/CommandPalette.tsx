import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Code2, FileText, Gamepad2, Layers3, Search, Terminal, UserRound } from 'lucide-react';
import { projectsData } from '../../data/projects';
import type { WindowId } from '../../types/os';
import { motion, useReducedMotion } from 'framer-motion';
import { presentationFor } from './workbenchData';
import { WB_EASE } from './motion';

interface CommandPaletteProps { onClose: () => void; onProject: (id: string) => void; onApp: (id: WindowId) => void; onExecutive: () => void }
const applications = [
  { id: 'ide', label: 'Inspect source', hint: 'Current project', icon: Code2 },
  { id: 'terminal', label: 'Open terminal', hint: 'Command line', icon: Terminal },
  { id: 'adventure', label: 'Enter the playroom', hint: 'Project Odyssey & Full Stack', icon: Gamepad2 },
  { id: 'skills', label: 'Explore capabilities', hint: 'Skills & tools', icon: Layers3 },
  { id: 'resume', label: 'Read the resume', hint: 'Background & experience', icon: FileText },
  { id: 'about', label: 'Meet Arthur', hint: 'About & contact', icon: UserRound },
] as const;

export function CommandPalette({ onClose, onProject, onApp, onExecutive }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const commands = [
    ...projectsData.map((project) => ({ id: `project-${project.id}`, label: presentationFor(project.id).name, hint: 'Project',
      keywords: `${project.title} ${project.technical.techStack.join(' ')}`, icon: presentationFor(project.id).icon, run: () => onProject(project.id) })),
    ...applications.map((app) => ({ ...app, keywords: app.id, run: () => onApp(app.id) })),
    { id: 'executive', label: 'Switch to executive view', hint: 'Portfolio', keywords: 'recruiter', icon: ArrowUpRight, run: onExecutive },
  ].filter((command) => `${command.label} ${command.hint} ${command.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    inputRef.current?.focus();
    return () => dialog?.close();
  }, []);
  useEffect(() => { document.getElementById(`wb-command-${activeIndex}`)?.scrollIntoView({ block: 'nearest' }); }, [activeIndex]);
  function run(index: number) { const command = commands[index]; if (command) { onClose(); command.run(); } }

  return (
    <dialog ref={dialogRef} className="wb-command-dialog" aria-label="Navigate ArthurOS"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div className="wb-command-sheet" initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: -10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.35, ease: WB_EASE }}>
        <div className="wb-command-search"><Search size={19} strokeWidth={1.6} />
          <input ref={inputRef} value={query} placeholder="Where would you like to go?" aria-label="Search projects and commands" role="combobox"
            aria-autocomplete="list" aria-expanded="true" aria-controls="wb-command-options" aria-activedescendant={commands[activeIndex] ? `wb-command-${activeIndex}` : undefined}
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((current) => commands.length ? (current + (event.key === 'ArrowDown' ? 1 : -1) + commands.length) % commands.length : 0);
              } else if (event.key === 'Enter') { event.preventDefault(); run(activeIndex); }
            }} />
          <button onClick={onClose} className="wb-command-escape" aria-label="Close command palette">esc</button>
        </div>
        <div id="wb-command-options" className="wb-command-options" role="listbox" aria-label="Navigation results">
          {commands.map((command, index) => {
            const Icon = command.icon;
            return <div key={command.id} id={`wb-command-${index}`} role="option" aria-selected={activeIndex === index}
              className="wb-command-option" onPointerMove={() => { if (activeIndex !== index) setActiveIndex(index); }} onClick={() => run(index)}>
              {activeIndex === index && <motion.span className="wb-command-highlight" layoutId="wb-command-highlight" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
              <Icon size={18} strokeWidth={1.6} /><span>{command.label}</span><small>{command.hint}</small>
            </div>;
          })}
          {commands.length === 0 && <p className="wb-command-empty">No matches. Try a project name, technology, or app.</p>}
        </div>
        <div className="wb-command-footer"><span>↑ ↓ to navigate</span><span>↵ to open</span><span>esc to close</span></div>
      </motion.div>
    </dialog>
  );
}
