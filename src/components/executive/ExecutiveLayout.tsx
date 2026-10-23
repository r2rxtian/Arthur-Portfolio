import { useEffect, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { WorkSection } from './WorkSection';
import { CertificatesSection } from './CertificatesSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';
import { TechMarquee } from './TechMarquee';
import { EASE_OUT } from './motionUtils';
import { Roll } from './motion';
import { ExecCursor } from './ExecCursor';
import { profileData } from '../../data/profile';
import { withThemeTransition } from '../../utils/themeTransition';
import { usePageMomentum } from '../../hooks/useMomentum';

const navigation = [
  ['overview', 'Overview'], ['work', 'Work'], ['certificates', 'Certificates'],
  ['experience', 'Experience'], ['skills', 'Skills'],
] as const;

export function ExecutiveLayout() {
  const [activeSection, setActiveSection] = useState('overview');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('executive_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  usePageMomentum();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

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

  const indicator = hoveredLink ?? activeSection;

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 170, damping: 28, mass: 1 }}>
      <div className="exec-container" data-theme={theme}>
        <div className="exec-grain" aria-hidden="true" />
        <ExecCursor />
        <a className="exec-skip-link" href="#executive-main">Skip to content</a>
        <motion.header className="exec-header" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}>
          <div className="exec-nav-inner">
            <a href="#overview" className="exec-logo">{profileData.shortName}<span className="exec-logo-period">.</span></a>
            <nav className="exec-nav-links" aria-label="Portfolio sections" onPointerLeave={() => setHoveredLink(null)}>
              {navigation.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="exec-nav-link" aria-current={activeSection === id ? 'location' : undefined}
                  onPointerEnter={() => setHoveredLink(id)}>
                  {indicator === id && <motion.span className="exec-nav-pill" layoutId="exec-nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <Roll>{label}</Roll>
                </a>
              ))}
            </nav>
            <div className="exec-header-actions">
              <motion.button className="exec-icon-button" onClick={(event) => withThemeTransition(event.currentTarget, () => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} appearance`} whileTap={{ scale: 0.9, rotate: -30 }}>
                <motion.span key={theme} className="exec-theme-icon" initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </motion.button>
              <a href="#contact" className="exec-nav-cta"><Roll>Contact</Roll> <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <motion.span className="exec-progress" style={{ scaleX: progress }} aria-hidden="true" />
        </motion.header>
        <main className="exec-content" id="executive-main">
          <HeroSection />
          <TechMarquee />
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
