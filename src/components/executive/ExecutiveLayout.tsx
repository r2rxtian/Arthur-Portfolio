import React from 'react';
import { HeroSection } from './HeroSection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';
import { profileData } from '../../data/profile';
import { Calendar } from 'lucide-react';

export const ExecutiveLayout: React.FC = () => {
  return (
    <div className="exec-container">
      <div className="exec-ambient-glow" />

      {/* Sticky Top Header */}
      <header className="exec-header">
        <div className="exec-nav-inner">
          <a href="#overview" className="exec-logo">
            <span>{profileData.name}</span>
            <span className="exec-logo-badge">ARCHITECT</span>
          </a>

          <nav className="exec-nav-links">
            <a href="#overview" className="exec-nav-link">
              Overview
            </a>
            <a href="#case-studies" className="exec-nav-link">
              Case Studies
            </a>
            <a href="#experience" className="exec-nav-link">
              Experience
            </a>
            <a href="#skills" className="exec-nav-link">
              Skills
            </a>
            <a href="#contact" className="exec-nav-link">
              Contact
            </a>
          </nav>

          <a
            href={profileData.contact.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="exec-nav-cta"
          >
            <Calendar size={14} />
            <span>Book Intro</span>
          </a>
        </div>
      </header>

      {/* Page Body */}
      <main className="exec-content">
        <HeroSection />
        <CaseStudiesSection />
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
