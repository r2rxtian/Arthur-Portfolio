import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  X,
  GitBranch,
} from 'lucide-react';
import { virtualFileSystem } from '../../data/filesystem';
import type { VirtualFile } from '../../types/os';
import { useMode } from '../../context/ModeContext';

export const IdeApp: React.FC = () => {
  const { sounds } = useMode();
  // Find default initial file
  const defaultFile =
    virtualFileSystem[0]?.type === 'file'
      ? virtualFileSystem[0]
      : virtualFileSystem[1]?.children?.[0] || virtualFileSystem[0];

  const [openFiles, setOpenFiles] = useState<VirtualFile[]>([defaultFile]);
  const [activeFileId, setActiveFileId] = useState<string>(defaultFile.id);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'dir-projects': true,
    'dir-system': false,
    'dir-resume': false,
  });
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = openFiles.find((f) => f.id === activeFileId) || openFiles[0] || defaultFile;

  const toggleFolder = (folderId: string) => {
    sounds.playClick();
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleSelectFile = (file: VirtualFile) => {
    sounds.playClick();
    if (!openFiles.some((f) => f.id === file.id)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFileId(file.id);
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    sounds.playClick();
    const filtered = openFiles.filter((f) => f.id !== fileId);
    setOpenFiles(filtered);
    if (activeFileId === fileId && filtered.length > 0) {
      setActiveFileId(filtered[filtered.length - 1].id);
    }
  };

  const handleCopyCode = () => {
    if (!activeFile?.content) return;
    sounds.playClick();
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = activeFile?.content ? activeFile.content.split('\n') : ['// Empty file'];

  const renderFileIcon = (file: VirtualFile) => {
    if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      return <FileText size={14} color="#38bdf8" />;
    }
    return <FileCode size={14} color="#f59e0b" />;
  };

  return (
    <div className="ide-container">
      {/* File Explorer Sidebar */}
      <div className="ide-sidebar">
        <div className="ide-sidebar-header">
          <span>Explorer: Arthur-Portfolio</span>
        </div>

        <div className="ide-file-tree">
          {virtualFileSystem.map((node) => {
            if (node.type === 'folder') {
              const isExpanded = !!expandedFolders[node.id];
              return (
                <div key={node.id}>
                  <div
                    className="ide-tree-node"
                    onClick={() => toggleFolder(node.id)}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {isExpanded ? (
                      <FolderOpen size={14} color="#38bdf8" />
                    ) : (
                      <Folder size={14} color="#94a3b8" />
                    )}
                    <span>{node.name}</span>
                  </div>

                  {isExpanded && node.children && (
                    <div style={{ paddingLeft: 16 }}>
                      {node.children.map((child) => (
                        <div
                          key={child.id}
                          className={`ide-tree-node ${activeFileId === child.id ? 'active' : ''}`}
                          onClick={() => handleSelectFile(child)}
                        >
                          {renderFileIcon(child)}
                          <span>{child.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={node.id}
                className={`ide-tree-node ${activeFileId === node.id ? 'active' : ''}`}
                onClick={() => handleSelectFile(node)}
              >
                {renderFileIcon(node)}
                <span>{node.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="ide-editor-area">
        {/* Open Tabs */}
        <div className="ide-tabs-bar">
          {openFiles.map((file) => (
            <div
              key={file.id}
              className={`ide-tab ${activeFileId === file.id ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setActiveFileId(file.id);
              }}
            >
              {renderFileIcon(file)}
              <span>{file.name}</span>
              {openFiles.length > 1 && (
                <span
                  className="ide-tab-close"
                  onClick={(e) => handleCloseTab(e, file.id)}
                  title="Close tab"
                >
                  <X size={12} />
                </span>
              )}
            </div>
          ))}

          {/* Quick Actions */}
          <div style={{ marginLeft: 'auto', paddingRight: 12 }}>
            <button
              onClick={handleCopyCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: copied ? '#10b981' : '#cbd5e1',
                padding: '4px 10px',
                borderRadius: 5,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Content & Line Numbers */}
        <div className="ide-code-viewer">
          <div className="ide-line-numbers">
            {codeLines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="ide-code-content">
            {activeFile?.content || '// No content available'}
          </div>
        </div>

        {/* VSCode Status Bar */}
        <div
          style={{
            height: 24,
            background: '#090d16',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: 11,
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8' }}>
              <GitBranch size={12} />
              <span>main</span>
            </span>
            <span>0 errors, 0 warnings</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Lines: {codeLines.length}</span>
            <span>UTF-8</span>
            <span>{activeFile?.language || 'plaintext'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
