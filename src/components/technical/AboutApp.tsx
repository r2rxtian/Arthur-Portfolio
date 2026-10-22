import { ArrowUpRight, Mail } from 'lucide-react';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { skillCategoriesData } from '../../data/skills';
import profileImg from '../../assets/profile.png';

export function AboutApp() {
  return (
    <div className="system-app">
      <div className="system-profile-header">
        <img src={profileImg} alt={profileData.name} width={80} height={80} />
        <div><p className="system-eyebrow">System properties</p><h1>{profileData.name}</h1><p>{profileData.title}</p><span>@{profileData.handle}</span></div>
      </div>
      <div className="system-content">
        <fieldset className="system-fieldset"><legend>About</legend><p>{profileData.technicalPitch.replaceAll('—', ',')}</p></fieldset>
        <fieldset className="system-fieldset"><legend>Portfolio</legend>
          <dl className="system-specs"><div><dt>Projects</dt><dd>{projectsData.length} software systems</dd></div><div><dt>Core domains</dt><dd>{skillCategoriesData.length} engineering disciplines</dd></div><div><dt>Built with</dt><dd>React, TypeScript & Vite</dd></div><div><dt>Availability</dt><dd>{profileData.status}</dd></div></dl>
        </fieldset>
        <div className="system-actions">
          <a className="os-button os-button-primary" href={`mailto:${profileData.contact.email}`}><Mail size={15} /> Email Arthur</a>
          <a className="os-button" href={profileData.contact.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>
          <a className="os-button" href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </div>
  );
}
