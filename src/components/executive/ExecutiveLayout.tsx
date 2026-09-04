import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { WorkSection } from './WorkSection';
import { CertificatesSection } from './CertificatesSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';
import { profileData } from '../../data/profile';
import { Mail, Sparkles } from 'lucide-react';

export const ExecutiveLayout: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="exec-container">
      {/* Dynamic Scroll Progress Bar */}
      <motion.div
        className="exec-scroll-progress"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <div className="exec-ambient-glow" />

      {/* Sticky Top Header */}
      <header className="exec-header">
        <div className="exec-nav-inner">
          <a href="#overview" className="exec-logo">
            <div className="exec-logo-icon">
              <Sparkles size={16} color="#38bdf8" />
            </div>
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

        <footer className="exec-footer">
          <div className="exec-footer-inner">
            <span>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</span>
            <span className="exec-footer-tag">Dual-Perspective Portfolio • React 19 + TypeScript + Motion Engine</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

