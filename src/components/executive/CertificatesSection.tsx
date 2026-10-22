import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Award, Check, ChevronDown, Copy } from 'lucide-react';
import { certificatesData } from '../../data/certificates';
import type { Certificate } from '../../types/portfolio';
import { ScrollReveal } from './ScrollReveal';

type FilterCategory = 'All' | Certificate['category'];
const categories: FilterCategory[] = ['All', 'Cloud & Architecture', 'DevOps & Containers', 'Full-Stack & Frontend', 'Security & Data'];

export function CertificatesSection() {
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtered = certificatesData.filter((cert) => activeFilter === 'All' || cert.category === activeFilter);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  async function copyCredential(id: string) {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setCopyError(false);
    } catch {
      setCopiedId(null);
      setCopyError(true);
    }
    copyTimer.current = setTimeout(() => { setCopiedId(null); setCopyError(false); }, 2500);
  }

  return (
    <section className="exec-section" id="certificates" aria-labelledby="certificates-heading">
      <ScrollReveal className="exec-section-header">
        <h2 id="certificates-heading">Always learning<span>.</span></h2>
        <p>Credentials across cloud architecture, development, and infrastructure.</p>
      </ScrollReveal>
      <ScrollReveal>
        <div className="cert-filter-bar" role="group" aria-label="Filter certifications">
          {categories.map((category) => (
            <button key={category} className="cert-filter-btn" aria-pressed={activeFilter === category}
              onClick={() => setActiveFilter(category)}>
              {activeFilter === category && <motion.span layoutId="certificate-filter" className="cert-filter-selection"
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 330, damping: 34 }} />}
              <span>{category === 'All' ? 'All credentials' : category}</span>
            </button>
          ))}
        </div>
      </ScrollReveal>
      <div className="cert-grid" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((cert) => (
            <motion.article key={cert.id} layout={reducedMotion ? false : 'position'} className="cert-card"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 28, opacity: { duration: reducedMotion ? 0 : 0.2 } }}>
              <div className="cert-issuer-mark"><Award size={22} strokeWidth={1.5} /></div>
              <div className="cert-card-content">
                <p className="cert-issuer-name">{cert.issuerCode === 'HASHICORP' ? 'HashiCorp' : cert.issuerCode}</p>
                <h3>{cert.title.replaceAll('—', '-').replaceAll('–', '-')}</h3>
                <p className="cert-validity">{cert.expiryDate.replace('Active · ', '')}</p>
                <details className="exec-disclosure">
                  <summary>Credential details <ChevronDown size={15} /></summary>
                  <div className="exec-disclosure-body">
                    <p>{cert.summary}</p>
                    <p className="exec-caption">Issued {cert.issueDate}</p>
                    <div className="cert-credential-id">
                      <code>{cert.credentialId}</code>
                      <button className="exec-icon-button" onClick={() => void copyCredential(cert.credentialId)}
                        aria-label={`Copy credential ID ${cert.credentialId}`}>
                        {copiedId === cert.credentialId ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p>{cert.skills.join(', ')}</p>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="exec-text-link">
                      Issuer website <ArrowUpRight size={15} />
                    </a>
                  </div>
                </details>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      <p className="exec-feedback" role="status">{copyError ? 'Copy unavailable. You can select and copy the credential ID above.' : copiedId ? 'Credential ID copied.' : ''}</p>
    </section>
  );
}
