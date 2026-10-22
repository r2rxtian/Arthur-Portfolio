import { useEffect, useRef, useState } from 'react';
import { Check, Download, FileText } from 'lucide-react';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';
import { projectsData } from '../../data/projects';
import { skillCategoriesData } from '../../data/skills';

export function ResumeApp() {
  const [downloaded, setDownloaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function download() {
    const text = [
      profileData.name, profileData.title,
      profileData.contact.email, profileData.contact.github, profileData.contact.linkedin,
      '', 'SUMMARY', profileData.executivePitch, '', 'EXPERIENCE',
      ...experienceData.flatMap((experience) => [
        '', `${experience.role} at ${experience.company} (${experience.period})`, experience.summary,
        ...experience.highlights.map((highlight) => `- ${highlight}`),
      ]),
      '', 'PROJECTS',
      ...projectsData.flatMap((project) => ['', project.title, project.tagline, project.links.github ?? '']),
      '', 'SKILLS',
      ...skillCategoriesData.flatMap((category) => ['', category.title, category.items.map((item) => item.name).join(', ')]),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = profileData.contact.resumeFileName.replace(/\.pdf$/i, '.txt');
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
            <p className="resume-contact">{profileData.contact.email}<br /><a href={profileData.contact.github} target="_blank" rel="noopener noreferrer">{profileData.contact.github}</a></p>
          </header>
          <section><h2>Profile</h2><p>{profileData.executivePitch.replaceAll('—', ',')}</p></section>
          <section><h2>Experience</h2>{experienceData.map((experience) => <div key={experience.id} className="resume-experience">
            <h3>{experience.role}</h3><p className="resume-company">{experience.company} / {experience.period}</p>
            <p>{experience.summary}</p><ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </div>)}</section>
          <section><h2>Selected projects</h2>{projectsData.map((project) => <div key={project.id} className="resume-experience"><h3>{project.title.replaceAll('—', '-')}</h3><p>{project.tagline}</p></div>)}</section>
          <section><h2>Technical skills</h2>{skillCategoriesData.map((category) => <p key={category.id}><strong>{category.title}:</strong> {category.items.map((item) => item.name).join(', ')}</p>)}</section>
        </article>
      </div>
      <div className="os-status-bar" role="status"><span>{downloaded ? 'CV download started' : 'Text document'}</span><span>Read-only</span></div>
    </div>
  );
}
