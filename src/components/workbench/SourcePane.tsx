import { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import type { Project } from '../../types/portfolio';

export function SourcePane({ project }: { project: Project }) {
  const [feedback, setFeedback] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { filename, language, code } = project.technical.codeSnippet;
  const lines = code.split('\n');
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copySource() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setFeedback('Source copied');
    } catch { setFeedback('Select the source to copy it.'); }
    timer.current = setTimeout(() => setFeedback(''), 2400);
  }

  return (
    <div className="wb-source">
      <div className="wb-source-toolbar">
        <span className="wb-source-filename"><FileCode2 size={16} /><span title={filename}>{filename}</span></span>
        <button className="wb-small-button" onClick={() => void copySource()} aria-label="Copy source code">
          {feedback === 'Source copied' ? <Check size={14} /> : <Copy size={14} />}<span>Copy</span>
        </button>
      </div>
      <div className="wb-source-code" tabIndex={0} role="region" aria-label={`${filename} source code`}>
        <div className="wb-source-lines" aria-hidden="true">{lines.map((_, index) => <span key={index}>{index + 1}</span>)}</div>
        <pre><code>{code}</code></pre>
      </div>
      <div className="wb-source-footer"><span role="status">{feedback || 'Read-only implementation excerpt'}</span><span>{language} <span aria-hidden="true">/</span> {lines.length} lines</span></div>
    </div>
  );
}
