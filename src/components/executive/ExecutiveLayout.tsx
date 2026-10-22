import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { WorkSection } from './WorkSection';
import { CertificatesSection } from './CertificatesSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';
import { profileData } from '../../data/profile';

const navigation = [
  ['overview', 'Overview'], ['work', 'Work'], ['certificates', 'Certificates'],
  ['experience', 'Experience'], ['skills', 'Skills'],
] as const;

export function ExecutiveLayout() {
  const [activeSection, setActiveSection] = useState('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('executive_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.executiveTheme = theme;
    localStorage.setItem('executive_theme', theme);
    return () => { delete document.documentElement.dataset.executiveTheme; };
  }, [theme]);

  useEffect(() => {
    // Update React only when the active section changes, never on every scroll frame.
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('.exec-container section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 170, damping: 28, mass: 1 }}>
      <div className="exec-container" data-theme={theme}>
        <a className="exec-skip-link" href="#executive-main">Skip to content</a>
        <header className="exec-header">
          <div className="exec-nav-inner">
            <a href="#overview" className="exec-logo">{profileData.name}<span className="exec-logo-period">.</span></a>
            <nav className="exec-nav-links" aria-label="Portfolio sections">
              {navigation.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="exec-nav-link" aria-current={activeSection === id ? 'location' : undefined}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="exec-header-actions">
              <button className="exec-icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} appearance`}>
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <a href="#contact" className="exec-nav-cta">Contact <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </header>
        <main className="exec-content" id="executive-main">
          <HeroSection />
          <WorkSection />
          <CertificatesSection />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
        </main>
        <footer className="exec-footer">
          <span>© {new Date().getFullYear()} {profileData.name}</span>
          <a href="#overview">Back to top <ArrowUpRight size={14} /></a>
        </footer>
      </div>
    </MotionConfig>
  );
}
