import React, { useState } from 'react';
import { Copy, Check, Calendar, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';

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
Email: ${profileData.contact.email} | GitHub: ${profileData.contact.github}
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
      <div className="exec-contact-card">
        <h2 className="exec-contact-title">Let's Discuss High-Impact Opportunities</h2>
        <p className="exec-contact-desc">
          Whether you are seeking a lead engineer to build your next-generation platform, scale your distributed backend, or drive technical strategy across your teams.
        </p>

        <div className="exec-contact-actions">
          <button
            onClick={handleCopyEmail}
            className="exec-btn exec-btn-primary"
            title="Copy email address"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Email Copied to Clipboard!' : 'Copy Email Address'}</span>
          </button>

          {profileData.contact.meetingUrl && (
            <a
              href={profileData.contact.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="exec-btn exec-btn-secondary"
            >
              <Calendar size={16} color="#38bdf8" />
              <span>Schedule 20-min Intro</span>
            </a>
          )}

          <button
            onClick={handleDownloadCV}
            className="exec-btn exec-btn-secondary"
          >
            <Download size={16} color="#10b981" />
            <span>Download Executive CV</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 12 }}>
          <a
            href={profileData.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}
          >
            <GithubIcon size={16} />
            <span>GitHub ({profileData.handle})</span>
          </a>

          <a
            href={profileData.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}
          >
            <LinkedinIcon size={16} color="#38bdf8" />
            <span>LinkedIn Profile</span>
          </a>
        </div>
      </div>
    </section>
  );
};
