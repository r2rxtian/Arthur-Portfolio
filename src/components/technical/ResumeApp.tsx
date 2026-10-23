import { useEffect, useRef, useState } from 'react';
import { Check, Download, FileText } from 'lucide-react';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';
import { projectsData } from '../../data/projects';
import { skillCategoriesData } from '../../data/skills';
import { certificatesData } from '../../data/certificates';
import { downloadResume } from '../../utils/downloadResume';

export function ResumeApp() {
  const [downloaded, setDownloaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function download() {
    downloadResume();
    setDownloaded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDownloaded(false), 2500);
  }
  return (
    <div className="resume-app">
      <div className="resume-toolbar"><span><FileText size={16} /> Curriculum Vitae</span>
        <button onClick={download} className="os-button">{downloaded ? <Check size={14} /> : <Download size={14} />} {downloaded ? 'Downloaded' : 'Download .txt'}</button>
      </div>
      <div className="resume-scroll">
        <article className="resume-paper">
          <header><h1>{profileData.name}</h1><p className="resume-role">{profileData.title}</p>
            <p className="resume-contact"><a href={`mailto:${profileData.contact.email}`}>{profileData.contact.email}</a> · <a href={`tel:+63${profileData.contact.phone.slice(1)}`}>{profileData.contact.phone}</a><br />{profileData.location}<br /><a href={profileData.contact.github} target="_blank" rel="noopener noreferrer">{profileData.contact.github}</a><br /><a href={profileData.contact.resumeLink} target="_blank" rel="noopener noreferrer">ResumeLink</a></p>
          </header>
          <section><h2>Profile</h2><p>{profileData.executivePitch.replaceAll('—', ',')}</p></section>
          <section><h2>Experience</h2>{experienceData.map((experience) => <div key={experience.id} className="resume-experience">
            <h3>{experience.role}</h3><p className="resume-company">{experience.company} / {experience.period}</p>
            <p>{experience.summary}</p><ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </div>)}</section>
          <section><h2>Education</h2><h3>{profileData.education.degree}</h3><p>{profileData.education.institution}</p><p>Expected completion: {profileData.education.expectedCompletion}</p><p>{profileData.education.field}</p></section>
          <section><h2>Certifications</h2>{certificatesData.map((certificate) => <div key={certificate.id} className="resume-experience"><h3>{certificate.title}</h3><p>{certificate.issuer} / {certificate.issueDate}</p>{certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">Verify credential</a>}</div>)}</section>
          <section><h2>Selected projects</h2>{projectsData.map((project) => <div key={project.id} className="resume-experience"><h3>{project.title.replaceAll('—', '-')}</h3><p>{project.tagline}</p>{project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer">Repository</a>}</div>)}</section>
          <section><h2>Technical skills</h2>{skillCategoriesData.filter((category) => category.id !== 'support').map((category) => <p key={category.id}><strong>{category.title}:</strong> {category.items.map((item) => item.name).join(', ')}</p>)}<p>IT Support</p></section>
          <section><h2>Languages</h2><p>{profileData.languages.join(' · ')}</p></section>
        </article>
      </div>
      <div className="os-status-bar" role="status"><span>{downloaded ? 'CV download started' : 'Text document'}</span><span>Read-only</span></div>
    </div>
  );
}
