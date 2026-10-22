import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronRight, Copy, FileCode, FileText, Folder, FolderOpen, PanelLeft, X } from 'lucide-react';
import { virtualFileSystem } from '../../data/filesystem';
import type { VirtualFile } from '../../types/os';
import { useMode } from '../../context/ModeContext';
import { useOS } from '../../context/OSContext';

const files = virtualFileSystem.flatMap((node) => node.type === 'file' ? [node] : node.children ?? []);
const defaultFile = files[0];

export function IdeApp() {
  const { sounds } = useMode();
  const { editorRequest } = useOS();
  const initialFile = files.find((file) => file.id === editorRequest?.fileId) ?? defaultFile;
  const [editor, setEditor] = useState(() => ({ openFiles: [initialFile], activeId: initialFile.id, requestRevision: editorRequest?.revision ?? 0 }));
  const { openFiles, activeId } = editor;
  const setActiveId = (id: string) => setEditor((current) => ({ ...current, activeId: id }));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'dir-projects': true });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 600);
  const [copyStatus, setCopyStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeFile = openFiles.find((file) => file.id === activeId);
  const lines = activeFile?.content?.split('\n') ?? [];

  // Consume each explicit source-open request before commit, preserving existing tabs.
  if (editorRequest && editor.requestRevision !== editorRequest.revision) {
    const file = files.find((candidate) => candidate.id === editorRequest.fileId);
    setEditor({ ...editor, requestRevision: editorRequest.revision,
      ...(file ? { activeId: file.id, openFiles: openFiles.some((candidate) => candidate.id === file.id) ? openFiles : [...openFiles, file] } : {}),
    });
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function selectFile(file: VirtualFile) {
    sounds.playClick();
    setEditor((current) => ({ ...current, activeId: file.id,
      openFiles: current.openFiles.some((candidate) => candidate.id === file.id) ? current.openFiles : [...current.openFiles, file],
    }));
    if (window.innerWidth < 600) setSidebarOpen(false);
  }
  function closeFile(fileId: string) {
    const remaining = openFiles.filter((file) => file.id !== fileId);
    setEditor((current) => ({ ...current, openFiles: remaining, activeId: current.activeId === fileId ? remaining.at(-1)?.id ?? '' : current.activeId }));
  }
  async function copyCode() {
    if (!activeFile?.content) return;
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopyStatus('Code copied');
    } catch {
      setCopyStatus('Select the code to copy it');
    }
    timer.current = setTimeout(() => setCopyStatus(''), 2500);
  }
  const fileIcon = (file: VirtualFile) => /\.(md|txt)$/.test(file.name) ? <FileText size={15} /> : <FileCode size={15} />;

  return (
    <div className={`ide-container${sidebarOpen ? ' has-sidebar' : ''}`}>
      {sidebarOpen && <nav className="ide-sidebar" aria-label="Source files">
        <div className="ide-sidebar-header">EXPLORER <button onClick={() => setSidebarOpen(false)} aria-label="Close file explorer"><X size={14} /></button></div>
        <div className="ide-file-tree">
          <p className="ide-workspace-name">ARTHUR-PORTFOLIO</p>
          {virtualFileSystem.map((node) => node.type === 'folder' ? (
            <div key={node.id}>
              <button className="ide-tree-node" aria-expanded={!!expanded[node.id]} onClick={() => setExpanded((current) => ({ ...current, [node.id]: !current[node.id] }))}>
                {expanded[node.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {expanded[node.id] ? <FolderOpen size={15} /> : <Folder size={15} />}<span>{node.name}</span>
              </button>
              {expanded[node.id] && <div className="ide-folder-children">{node.children?.map((file) => (
                <button key={file.id} className={`ide-tree-node${activeId === file.id ? ' active' : ''}`} onClick={() => selectFile(file)} aria-current={activeId === file.id ? 'true' : undefined} title={file.name}>
                  {fileIcon(file)}<span>{file.name}</span>
                </button>
              ))}</div>}
            </div>
          ) : (
            <button key={node.id} className={`ide-tree-node${activeId === node.id ? ' active' : ''}`} onClick={() => selectFile(node)} aria-current={activeId === node.id ? 'true' : undefined}>{fileIcon(node)}<span>{node.name}</span></button>
          ))}
        </div>
      </nav>}
      <div className="ide-editor-area">
        <div className="ide-editor-toolbar">
          <button className="ide-tool-button" onClick={() => setSidebarOpen((current) => !current)} aria-label="Toggle file explorer" aria-expanded={sidebarOpen}><PanelLeft size={17} /></button>
          <span className="ide-file-path">{activeFile?.path ?? 'Code Studio'}</span>
          <button className="ide-tool-button ide-copy-button" onClick={() => void copyCode()} disabled={!activeFile} aria-label="Copy source code">
            {copyStatus === 'Code copied' ? <Check size={15} /> : <Copy size={15} />}<span>Copy</span>
          </button>
        </div>
        <div className="ide-tabs-bar" role="tablist" aria-label="Open files">
          {openFiles.map((file) => (
            <div key={file.id} className={`ide-tab${activeId === file.id ? ' active' : ''}`}>
              <button role="tab" aria-selected={activeId === file.id} id={`tab-${file.id}`} aria-controls="source-panel" tabIndex={activeId === file.id ? 0 : -1}
                onClick={() => setActiveId(file.id)}
                onKeyDown={(event) => {
                  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                  event.preventDefault();
                  const index = openFiles.findIndex((candidate) => candidate.id === file.id);
                  const next = event.key === 'Home' ? 0 : event.key === 'End' ? openFiles.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + openFiles.length) % openFiles.length;
                  setActiveId(openFiles[next].id);
                  document.getElementById(`tab-${openFiles[next].id}`)?.focus();
                }}>{fileIcon(file)}<span>{file.name}</span></button>
              <button className="ide-tab-close" aria-label={`Close ${file.name}`} onClick={() => closeFile(file.id)}><X size={13} /></button>
            </div>
          ))}
        </div>
        {activeFile ? <div className="ide-code-viewer" id="source-panel" role="tabpanel" aria-labelledby={`tab-${activeFile.id}`} tabIndex={0}>
          <div className="ide-line-numbers" aria-hidden="true">{lines.map((_, index) => <div key={index}>{index + 1}</div>)}</div>
          <pre className="ide-code-content"><code>{activeFile.content}</code></pre>
        </div> : <div className="os-empty-state ide-empty-state"><CodeStudioEmpty /><h3>Take a look under the hood.</h3><p>Choose a file from the explorer to read its source.</p><button className="ide-tool-button" onClick={() => setSidebarOpen(true)}>Open explorer</button></div>}
        <div className="ide-status-bar"><span role="status">{copyStatus || 'Read-only source viewer'}</span><span>{activeFile ? `${lines.length} lines / ${activeFile.language ?? 'text'}` : 'No file selected'}</span></div>
      </div>
    </div>
  );
}
function CodeStudioEmpty() { return <FileCode size={32} strokeWidth={1.2} />; }
