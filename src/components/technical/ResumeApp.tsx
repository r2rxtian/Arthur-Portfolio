import React, { useState } from 'react';
import { Download, Check, FileText } from 'lucide-react';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';

export const ResumeApp: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // Generate text blob for download
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

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117' }}>
      {/* Action Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
          <FileText size={15} color="#38bdf8" />
          <span>{profileData.contact.resumeFileName}</span>
        </div>

        <button
          onClick={handleDownload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {downloaded ? <Check size={14} /> : <Download size={14} />}
          <span>{downloaded ? 'Downloaded!' : 'Download Resume'}</span>
        </button>
      </div>

      {/* Document Reader Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
          fontFamily: 'var(--font-sans)',
          color: '#e2e8f0',
          lineHeight: 1.6,
        }}
      >
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 16, marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{profileData.name}</h1>
          <p style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>{profileData.title}</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>
            {profileData.contact.email} • {profileData.contact.github} • {profileData.location}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8 }}>
            Professional Summary
          </h3>
          <p style={{ fontSize: 13.5, color: '#cbd5e1' }}>{profileData.executivePitch}</p>
        </div>

        <div>
          <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16 }}>
            Experience History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {experienceData.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>
                    {exp.role} <span style={{ color: '#38bdf8', fontWeight: 500 }}>@ {exp.company}</span>
                  </h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{exp.period}</span>
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 8px' }}>{exp.summary}</p>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
