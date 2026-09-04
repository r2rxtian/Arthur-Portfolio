import React, { useState } from 'react';
import { Copy, Check, Calendar, Download, Sparkles, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';
import { ScrollReveal } from './ScrollReveal';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCV = () => {
    const cvText = `=====================================================
${profileData.name.toUpperCase()} - ${profileData.title.toUpperCase()}
Email: ${profileData.contact.email} | LinkedIn: ${profileData.contact.linkedin} | GitHub: ${profileData.contact.github}
Location: ${profileData.location} | Status: ${profileData.status}
=====================================================

EXECUTIVE SUMMARY:
${profileData.executivePitch}

CAREER TIMELINE:
${experienceData
  .map(
    (exp) => `
* ${exp.role} @ ${exp.company} (${exp.period})
  Location: ${exp.location}
  Summary: ${exp.summary}
  Highlights:
  ${exp.highlights.map((h) => `  - ${h}`).join('\n')}
  Stack: ${exp.skillsUsed.join(', ')}
`
  )
  .join('\n')}
`;

    const blob = new Blob([cvText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = profileData.contact.resumeFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="exec-section" id="contact">
      <ScrollReveal direction="up" distance={32}>
        <div className="exec-contact-card">
          <div className="exec-contact-glow-top" />

          <div className="exec-section-eyebrow" style={{ marginBottom: 4 }}>
            <span className="exec-num-accent">05</span>
            <span className="exec-eyebrow-divider">//</span>
            <span>INITIATE DIALOGUE</span>
          </div>

          <h2 className="exec-contact-title">Let's Discuss High-Impact Engineering Roles</h2>
          <p className="exec-contact-desc">
            Seeking opportunities to design, build, and scale practical software solutions — combining full-stack web development, cloud architectures, and user-focused product delivery.
          </p>

          <div className="exec-contact-actions">
            <button
              onClick={handleCopyEmail}
              className="exec-btn exec-btn-primary"
              title="Copy email address to clipboard"
            >
              {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              <span>{copied ? 'Email Copied to Clipboard!' : 'Copy Email Address'}</span>
            </button>

            <a
              href={`mailto:${profileData.contact.email}?subject=Software%20Engineering%20Opportunity%20-%20Arthur%20Christian`}
              className="exec-btn exec-btn-secondary"
            >
              <Send size={15} color="#38bdf8" />
              <span>Direct Email</span>
            </a>

            {profileData.contact.meetingUrl && (
              <a
                href={profileData.contact.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="exec-btn exec-btn-secondary"
              >
                <Calendar size={16} color="#818cf8" />
                <span>Schedule 20-min Intro</span>
              </a>
            )}

            <button
              onClick={handleDownloadCV}
              className="exec-btn exec-btn-secondary"
            >
              <Download size={16} color="#34d399" />
              <span>Download Executive CV</span>
            </button>
          </div>

          <div className="exec-contact-footer-links">
            <a
              href={profileData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="exec-contact-link"
            >
              <GithubIcon size={16} />
              <span>GitHub ({profileData.handle})</span>
            </a>

            <a
              href={profileData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="exec-contact-link"
            >
              <LinkedinIcon size={16} color="#38bdf8" />
              <span>LinkedIn Profile</span>
            </a>

            <div className="exec-contact-status-chip">
              <span className="exec-status-dot" />
              <Sparkles size={12} color="#34d399" />
              <span>{profileData.status}</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

