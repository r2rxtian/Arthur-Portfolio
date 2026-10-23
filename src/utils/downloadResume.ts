import { profileData } from '../data/profile';
import { buildResumeText } from '../data/resume';

export function downloadResume() {
  const url = URL.createObjectURL(new Blob([buildResumeText()], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = profileData.contact.resumeFileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
