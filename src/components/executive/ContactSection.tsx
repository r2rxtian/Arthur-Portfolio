import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react';
import { profileData } from '../../data/profile';
import { downloadResume } from '../../utils/downloadResume';
import { ScrollReveal } from './ScrollReveal';
import { Magnetic, MaskText, Roll } from './motion';

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
    downloadResume();
    showFeedback('CV download started.');
  }

  return (
    <section className="exec-section exec-contact" id="contact" aria-labelledby="contact-heading">
      <div className="exec-contact-glow" aria-hidden="true" />
      <ScrollReveal distance={10}><p className="exec-contact-label"><span>05</span>Have something in mind?</p></ScrollReveal>
      <h2 id="contact-heading">
        <MaskText text="Good work starts with" className="exec-contact-line" />
        <MaskText text="a conversation." className="exec-contact-line exec-hero-accent" delay={0.2} />
      </h2>
      <ScrollReveal delay={0.25}>
        <p className="exec-contact-description">I'm interested in software development opportunities where I can contribute, learn, and build useful systems.</p>
        <div className="exec-contact-actions">
          <Magnetic>
            <motion.a href={`mailto:${profileData.contact.email}?subject=Software%20Engineering%20Opportunity`}
              className="exec-btn exec-btn-primary" whileTap={{ scale: 0.96 }}>
              <Roll>Get in touch</Roll> <ArrowUpRight size={16} />
            </motion.a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <motion.button className="exec-btn exec-btn-secondary" onClick={downloadCV} whileTap={{ scale: 0.96 }}>
              <Download size={16} /> <Roll>Download CV</Roll>
            </motion.button>
          </Magnetic>
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
          <a href={`tel:+63${profileData.contact.phone.slice(1)}`}>{profileData.contact.phone}</a>
          <a href={profileData.contact.resumeLink} target="_blank" rel="noopener noreferrer">ResumeLink <ArrowUpRight size={14} /></a>
          {profileData.contact.meetingUrl && <a href={profileData.contact.meetingUrl} target="_blank" rel="noopener noreferrer">Schedule an intro <ArrowUpRight size={14} /></a>}
        </div>
      </ScrollReveal>
    </section>
  );
}
