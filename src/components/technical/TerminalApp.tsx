import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { executeTerminalCommand } from '../../data/terminalCommands';
import { useMode } from '../../context/ModeContext';
import { useOS } from '../../context/OSContext';

interface HistoryItem {
  id: string;
  command?: string;
  output?: string;
  isError?: boolean;
}

const quickChips = [
  'help',
  'projects',
  'skills',
  'experience',
  'whoami',
  'cat /README.md',
  'open ide',
  'mode executive',
  'clear',
];

export const TerminalApp: React.FC = () => {
  const { setMode, sounds } = useMode();
  const { openWindow } = useOS();

  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      output: `===========================================================
  ArthurOS Terminal Environment (v2.4.0-release)
  Type "help" to view commands, or click the quick chips below.
===========================================================`,
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const historyEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    sounds.playClick();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeTerminalCommand(trimmed, {
      setMode,
      openWindow,
      clearHistory: () => setHistory([]),
    });

    if (trimmed.toLowerCase() !== 'clear') {
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2),
          command: trimmed,
          output: result.output,
          isError: result.isError,
        },
      ]);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = quickChips.find((c) => c.startsWith(input.trim()));
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="terminal-window"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-history">
        {history.map((item) => (
          <div key={item.id}>
            {item.command && (
              <div className="terminal-line command">
                <span className="terminal-prompt-prefix">developer@portfolio</span>
                <span style={{ color: '#64748b' }}>:</span>
                <span className="terminal-prompt-dir">~</span>
                <span style={{ color: '#64748b' }}>$</span>
                <span>{item.command}</span>
              </div>
            )}
            {item.output && (
              <div
                className={`terminal-line ${item.isError ? 'error' : 'output'}`}
              >
                {item.output}
              </div>
            )}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      {/* Quick Command Chips */}
      <div className="terminal-chips">
        <span style={{ fontSize: 11, color: '#64748b', marginRight: 4 }}>Quick:</span>
        {quickChips.map((chip) => (
          <button
            key={chip}
            className="terminal-chip"
            onClick={(e) => {
              e.stopPropagation();
              handleCommand(chip);
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Command Input */}
      <div className="terminal-input-row">
        <span className="terminal-prompt-prefix">developer@portfolio</span>
        <span style={{ color: '#64748b' }}>:</span>
        <span className="terminal-prompt-dir">~</span>
        <span style={{ color: '#64748b' }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder="Type command (e.g. 'help', 'projects', 'cat /README.md')..."
        />
        <button
          onClick={() => handleCommand(input)}
          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}
          title="Execute command"
        >
          <CornerDownLeft size={16} />
        </button>
      </div>
    </div>
  );
};
