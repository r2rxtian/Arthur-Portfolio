import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CornerDownLeft, Terminal } from 'lucide-react';
import { executeTerminalCommand } from '../../data/terminalCommands';
import { useMode } from '../../context/ModeContext';
import { useOS } from '../../context/OSContext';

interface HistoryItem { id: number; command?: string; output: string; isError?: boolean }
const shortcuts = ['help', 'projects', 'inspect itms', 'inspect dochubpr', 'skills', 'open playroom', 'mode executive', 'clear'];

export function TerminalApp() {
  const { setMode, sounds } = useMode();
  const { openWindow, inspectProject, activeWindowId } = useOS();
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const draft = useRef('');
  const sequence = useRef(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const output = outputRef.current;
    output?.scrollTo({ top: output.scrollHeight, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [history, reducedMotion]);
  useEffect(() => {
    if (activeWindowId === 'terminal' && !matchMedia('(pointer: coarse)').matches) inputRef.current?.focus({ preventScroll: true });
  }, [activeWindowId]);

  function execute(text: string) {
    const command = text.trim();
    if (!command) return;
    sounds.playClick();
    setCommands((current) => [...current, command]);
    setHistoryIndex(-1);
    draft.current = '';
    const result = executeTerminalCommand(command, { setMode, openWindow, inspectProject, clearHistory: () => setHistory([]) });
    if (command.toLowerCase() !== 'clear') {
      const id = ++sequence.current;
      setHistory((current) => [...current, { id, command, output: result.output, isError: result.isError }]);
    }
    setInput('');
    inputRef.current?.focus({ preventScroll: true });
  }
  function keys(event: KeyboardEvent<HTMLInputElement>) {
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault(); setHistory([]); return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commands.length) return;
      if (historyIndex === -1) draft.current = input;
      const index = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index); setInput(commands[index]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const index = historyIndex + 1;
      setHistoryIndex(index >= commands.length ? -1 : index);
      setInput(index >= commands.length ? draft.current : commands[index]);
    } else if (event.key === 'Tab' && input.trim()) {
      const match = shortcuts.find((command) => command.startsWith(input.trim()));
      if (match && match !== input) { event.preventDefault(); setInput(match); }
    }
  }

  return (
    <div className="terminal-window">
      <div className="terminal-session-bar"><span><Terminal size={13} /> arthur@portfolio</span><span>zsh</span></div>
      <div className="terminal-history" ref={outputRef} role="log" aria-label="Terminal output" aria-relevant="additions text" tabIndex={0}>
        <div className="terminal-welcome"><h2>ArthurOS Terminal</h2><p>Type <code>help</code> to get started. Your next discovery is a command away.</p></div>
        {history.map((item) => <div key={item.id} className="terminal-history-item">
          {item.command && <div className="terminal-line command"><span className="terminal-prompt-prefix">~ $</span><span>{item.command}</span></div>}
          {item.output && <div className={`terminal-line ${item.isError ? 'error' : 'output'}`}>{item.output}</div>}
        </div>)}
      </div>
      <div className="terminal-chips" role="group" aria-label="Quick commands">{shortcuts.map((command) => <button key={command} className="terminal-chip" onClick={() => execute(command)}>{command}</button>)}</div>
      <form className="terminal-input-row" onSubmit={(event) => { event.preventDefault(); execute(input); }}>
        <span className="terminal-prompt-prefix" aria-hidden="true">~ $</span>
        <input ref={inputRef} type="text" value={input} onChange={(event) => { setInput(event.target.value); setHistoryIndex(-1); }}
          onKeyDown={keys} className="terminal-input" aria-label="Terminal command" spellCheck={false} autoCapitalize="off" autoComplete="off" placeholder="Enter a command..." />
        <button type="submit" className="terminal-execute" aria-label="Run command"><CornerDownLeft size={17} /></button>
      </form>
      <div className="terminal-footer"><span>↑ ↓ History</span><span>Tab Complete</span><span>Ctrl L Clear</span></div>
    </div>
  );
}
