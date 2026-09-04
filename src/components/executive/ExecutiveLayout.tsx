import React from 'react';
import { HeroSection } from './HeroSection';
import { WorkSection } from './WorkSection';
import { CertificatesSection } from './CertificatesSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';
import { profileData } from '../../data/profile';
import { Mail } from 'lucide-react';

export const ExecutiveLayout: React.FC = () => {
  return (
    <div className="exec-container">
      <div className="exec-ambient-glow" />

      {/* Sticky Top Header */}
      <header className="exec-header">
        <div className="exec-nav-inner">
          <a href="#overview" className="exec-logo">
            <span>{profileData.name}</span>
            <span className="exec-logo-badge">ENGINEER</span>
          </a>

          <nav className="exec-nav-links">
            <a href="#overview" className="exec-nav-link">
              Overview
            </a>
            <a href="#work" className="exec-nav-link">
              Work
            </a>
            <a href="#certificates" className="exec-nav-link">
              Certificates
            </a>
            <a href="#experience" className="exec-nav-link">
              Experience
            </a>
            <a href="#skills" className="exec-nav-link">
              Skills
            </a>
          </nav>

          <a
            href="#contact"
            className="exec-nav-cta"
          >
            <Mail size={14} />
            <span>Contact</span>
          </a>
        </div>
      </header>

      {/* Page Body */}
      <main className="exec-content">
        <HeroSection />
        <WorkSection />
        <CertificatesSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />

        <footer
          style={{
            marginTop: 60,
            paddingTop: 24,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
            color: '#64748b',
          }}
        >
          <span>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</span>
          <span>Dual-Perspective Portfolio • React 19 + TypeScript</span>
        </footer>
      </main>
    </div>
  );
};
