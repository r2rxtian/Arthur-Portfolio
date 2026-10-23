import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Award, Check, Copy } from 'lucide-react';
import { certificatesData } from '../../data/certificates';
import type { Certificate } from '../../types/portfolio';
import { ScrollReveal } from './ScrollReveal';
import { Section } from './Section';
import { Disclosure } from './motion';
import { EASE_OUT, useSpotlight } from './motionUtils';

type FilterCategory = 'All' | Certificate['category'];
const categories: FilterCategory[] = ['All', ...new Set(certificatesData.map((cert) => cert.category))];

export function CertificatesSection() {
  const reducedMotion = useReducedMotion();
  // One callback ref serves every card; React registers and cleans up each element separately.
  const spotlight = useSpotlight<HTMLElement>(90);
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
    <Section id="certificates" index="02" eyebrow="Credentials" title="Always learning"
      intro="Learning in responsive web development and networking.">
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
        <AnimatePresence mode="popLayout">
          {filtered.map((cert, index) => (
            <motion.article key={cert.id} layout={reducedMotion ? false : 'position'} className="cert-card" ref={spotlight}
              initial={reducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }} viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT, delay: (index % 2) * 0.08, layout: { type: 'spring', stiffness: 260, damping: 32 } }}>
              <div className="cert-issuer-mark"><Award size={22} strokeWidth={1.5} /><span>{cert.issuerCode}</span></div>
              <div className="cert-card-content">
                <p className="cert-issuer-name">{cert.issuer} <i>·</i> {cert.category}</p>
                <h3>{cert.title.replaceAll('—', '-').replaceAll('–', '-')}</h3>
                <p className="cert-validity">Issued {cert.issueDate}</p>
                <Disclosure label="Credential details">
                  <>
                    <p>{cert.summary}</p>
                    <p className="exec-caption">Issued {cert.issueDate}</p>
                    {cert.credentialId && <div className="cert-credential-id">
                      <code>{cert.credentialId}</code>
                      <button className="exec-icon-button" onClick={() => { if (cert.credentialId) void copyCredential(cert.credentialId); }}
                        aria-label={`Copy credential ID ${cert.credentialId}`}>
                        {copiedId === cert.credentialId ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>}
                    <p>{cert.skills.join(', ')}</p>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="exec-text-link">
                      Verify credential <ArrowUpRight size={15} />
                    </a>}
                  </>
                </Disclosure>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      <p className="exec-feedback" role="status">{copyError ? 'Copy unavailable. You can select and copy the credential ID above.' : copiedId ? 'Credential ID copied.' : ''}</p>
    </Section>
  );
}
