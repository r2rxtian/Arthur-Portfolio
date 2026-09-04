import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  Layers,
  Cloud,
  Cpu,
  Code2,
  Database,
} from 'lucide-react';
import { certificatesData } from '../../data/certificates';
import type { Certificate } from '../../types/portfolio';
import { ScrollReveal } from './ScrollReveal';

type FilterCategory = 'All' | Certificate['category'];

export const CertificatesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: FilterCategory[] = [
    'All',
    'Cloud & Architecture',
    'DevOps & Containers',
    'Full-Stack & Frontend',
    'Security & Data',
  ];

  const filteredCerts =
    activeFilter === 'All'
      ? certificatesData
      : certificatesData.filter((c) => c.category === activeFilter);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIssuerIcon = (code: Certificate['issuerCode']) => {
    switch (code) {
      case 'AWS':
        return <Cloud size={20} color="#ff9900" />;
      case 'GCP':
        return <Layers size={20} color="#4285f4" />;
      case 'CNCF':
        return <Cpu size={20} color="#326ce5" />;
      case 'HASHICORP':
        return <Code2 size={20} color="#a855f7" />;
      case 'META':
        return <Code2 size={20} color="#00d2ff" />;
      case 'MONGO':
        return <Database size={20} color="#00ed64" />;
      default:
        return <Award size={20} color="#38bdf8" />;
    }
  };

  return (
    <section className="exec-section" id="certificates">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={24}>
        <div className="exec-section-header">
          <div className="exec-section-eyebrow">
            <span className="exec-num-accent">02</span>
            <span className="exec-eyebrow-divider">//</span>
            <span>ACCREDITATIONS & CREDENTIALS</span>
          </div>
          <h2 className="exec-section-title">Verified Technical Certifications</h2>
          <p className="exec-section-subtitle">
            Industry-recognized professional credentials validating scalable systems, cloud infrastructure, container orchestration, and full-stack engineering standards.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Category Tabs with Animated Indicator */}
      <ScrollReveal direction="up" distance={16} delay={0.08}>
        <div className="cert-filter-bar">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? certificatesData.length
                : certificatesData.filter((c) => c.category === cat).length;
            const isActive = activeFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`cert-filter-btn ${isActive ? 'is-active' : ''}`}
                style={{ position: 'relative' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="certActivePill"
                    className="cert-filter-active-pill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{cat}</span>
                <span className="cert-filter-badge" style={{ position: 'relative', zIndex: 2 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Certificates Grid with Layout Animations */}
      <motion.div layout className="cert-grid">
        <AnimatePresence mode="popLayout">
          {filteredCerts.map((cert, idx) => (
            <motion.div
              layout
              key={cert.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="cert-card"
            >
              {/* Top Accent Gradient Bar */}
              <div className="cert-top-bar" style={{ background: cert.gradient }} />

              <div className="cert-card-inner">
                {/* Header: Issuer Icon, Category, and Verified Tag */}
                <div className="cert-header">
                  <div
                    className="cert-issuer-icon-wrap"
                    style={{
                      background: `rgba(15, 23, 42, 0.85)`,
                      borderColor: `${cert.accentColor}44`,
                      boxShadow: `0 0 16px ${cert.accentColor}22`,
                    }}
                  >
                    {getIssuerIcon(cert.issuerCode)}
                  </div>

                  <div className="cert-meta-wrap">
                    <span
                      className="cert-category-tag"
                      style={{ borderColor: `${cert.accentColor}44`, color: cert.accentColor }}
                    >
                      {cert.category}
                    </span>
                    <div className="cert-verified-pill">
                      <span className="cert-pulse-dot" />
                      <ShieldCheck size={13} color="#10b981" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                {/* Title & Issuer Info */}
                <div className="cert-content">
                  <h3 className="cert-title">{cert.title}</h3>
                  <div className="cert-issuer-name">{cert.issuer}</div>
                  <p className="cert-summary">{cert.summary}</p>
                </div>

                {/* Credential Metadata Box */}
                <div className="cert-credentials-box">
                  <div className="cert-cred-row">
                    <span className="cert-cred-label">
                      <Calendar size={13} color="#94a3b8" />
                      <span>Validity:</span>
                    </span>
                    <span className="cert-cred-val">{cert.expiryDate}</span>
                  </div>

                  <div className="cert-cred-row">
                    <span className="cert-cred-label">
                      <CheckCircle2 size={13} color="#94a3b8" />
                      <span>Credential ID:</span>
                    </span>
                    <div className="cert-id-copy-group">
                      <code className="cert-id-code">{cert.credentialId}</code>
                      <button
                        onClick={(e) => handleCopyId(e, cert.credentialId)}
                        className="cert-copy-btn"
                        title="Copy Credential ID"
                      >
                        {copiedId === cert.credentialId ? (
                          <Check size={13} color="#10b981" />
                        ) : (
                          <Copy size={13} color="#94a3b8" />
                        )}
                        <span>{copiedId === cert.credentialId ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Validated Skills Pills */}
                <div className="cert-skills-section">
                  <span className="cert-skills-heading">Validated Competencies:</span>
                  <div className="cert-skills-wrap">
                    {cert.skills.map((skill) => (
                      <span key={skill} className="cert-skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Verification CTA */}
                <div className="cert-footer">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-verify-link"
                    style={{
                      borderColor: `${cert.accentColor}55`,
                    }}
                  >
                    <span>Verify Credential on Issuer Site</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

