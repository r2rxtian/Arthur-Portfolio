import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, FileCode2 } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { highlight } from './highlight';

export function SourcePane({ project }: { project: Project }) {
  const [feedback, setFeedback] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { filename, language, code } = project.technical.codeSnippet;
  const lines = useMemo(() => highlight(code, language), [code, language]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copied = feedback === 'Source copied';

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
        <span className="wb-source-filename">
          <span className="wb-source-dots" aria-hidden="true"><i /><i /><i /></span>
          <FileCode2 size={16} /><span title={filename}>{filename}</span>
        </span>
        <button className={`wb-small-button${copied ? ' is-done' : ''}`} onClick={() => void copySource()} aria-label="Copy source code">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? 'done' : 'copy'} className="wb-copy-icon" initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.2 }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </motion.span>
          </AnimatePresence>
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="wb-source-code" tabIndex={0} role="region" aria-label={`${filename} source code`}>
        <div className="wb-source-lines" aria-hidden="true">{lines.map((_, index) => <span key={index}>{index + 1}</span>)}</div>
        <pre><code>{lines.map((tokens, index) => (
          <span key={index} className="wb-code-line" style={{ animationDelay: `${Math.min(index, 48) * 16}ms` }}>
            {tokens.map((token, tokenIndex) => token.type === 'plain'
              ? token.text
              : <span key={tokenIndex} className={`tok-${token.type}`}>{token.text}</span>)}
          </span>
        ))}</code></pre>
      </div>
      <div className="wb-source-footer"><span role="status">{feedback || 'Read-only implementation excerpt'}</span><span>{language} <span aria-hidden="true">/</span> {lines.length} lines</span></div>
    </div>
  );
}
