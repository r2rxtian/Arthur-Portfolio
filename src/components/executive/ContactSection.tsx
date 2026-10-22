import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';
import { ScrollReveal } from './ScrollReveal';

export function ContactSection() {
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);

  function showFeedback(message: string) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(message);
    feedbackTimer.current = setTimeout(() => { setFeedback(''); setCopied(false); }, 3000);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profileData.contact.email);
      setCopied(true);
      showFeedback('Email address copied.');
    } catch {
      setCopied(false);
      showFeedback('Copy unavailable. Select the email address to copy it.');
    }
  }

  function downloadCV() {
    const cv = [
      profileData.name, profileData.title,
      `Email: ${profileData.contact.email}`,
      `GitHub: ${profileData.contact.github}`,
      `LinkedIn: ${profileData.contact.linkedin}`,
      '', profileData.executivePitch, '', 'EXPERIENCE', '',
      ...experienceData.flatMap((experience) => [
        `${experience.role} at ${experience.company} (${experience.period})`,
        experience.summary, ...experience.highlights.map((highlight) => `- ${highlight}`), '',
      ]),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([cv], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = profileData.contact.resumeFileName.replace(/\.pdf$/i, '.txt');
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showFeedback('CV download started.');
  }

  return (
    <section className="exec-section exec-contact" id="contact" aria-labelledby="contact-heading">
      <ScrollReveal>
        <p className="exec-contact-label">Have something in mind?</p>
        <h2 id="contact-heading">Good work starts with<br />a conversation<span>.</span></h2>
        <p className="exec-contact-description">I'm open to software engineering roles and thoughtful collaborations. Let's build something useful together.</p>
        <div className="exec-contact-actions">
          <motion.a href={`mailto:${profileData.contact.email}?subject=Software%20Engineering%20Opportunity`}
            className="exec-btn exec-btn-primary" whileTap={{ scale: 0.97 }}>
            Get in touch <ArrowUpRight size={16} />
          </motion.a>
          <motion.button className="exec-btn exec-btn-secondary" onClick={downloadCV} whileTap={{ scale: 0.97 }}>
            <Download size={16} /> Download CV
          </motion.button>
        </div>
        <div className="exec-contact-email">
          <a href={`mailto:${profileData.contact.email}`}>{profileData.contact.email}</a>
          <button className="exec-icon-button" onClick={() => void copyEmail()} aria-label="Copy email address">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p className="exec-feedback" role="status">{feedback}</p>
        <div className="exec-contact-links">
          <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>
          <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          {profileData.contact.meetingUrl && <a href={profileData.contact.meetingUrl} target="_blank" rel="noopener noreferrer">Schedule an intro <ArrowUpRight size={14} /></a>}
        </div>
      </ScrollReveal>
    </section>
  );
}
