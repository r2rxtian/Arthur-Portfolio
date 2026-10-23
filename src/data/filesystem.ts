import type { VirtualFile } from '../types/os';
import { projectsData } from './projects';
import { profileData } from './profile';
import { buildResumeText } from './resume';

export const virtualFileSystem: VirtualFile[] = [
  {
    id: 'root-readme',
    name: 'README.md',
    path: '/README.md',
    type: 'file',
    language: 'markdown',
    content: `# ${profileData.name} - ${profileData.title}
> Dual-mode engineering portfolio. Built with TypeScript, React 19, and Vite.

## Overview
- **About**: ${profileData.executivePitch}
- **Philosophy**: Turning ideas into functional digital experiences through practical, scalable solutions.
- **Modes**:
  - **ArthurOS**: An engineering workbench with connected project overviews, architecture diagrams, source excerpts, a terminal, and a playroom.
  - **Executive Mode**: Curated case studies with business problems, strategic solutions, and impact metrics.

## Quick CLI Shortcuts
- Type \`help\` to explore all terminal commands.
- Type \`projects\` to list repositories with stats.
- Type \`cat /README.md\` to view this file in terminal.
- Type \`inspect itms\` to open the StockHub implementation in the workspace.
- Press Ctrl+K to find a project or tool.
- Use the Executive view button in the workspace header to switch perspectives.
`,
  },
  {
    id: 'dir-projects',
    name: 'projects',
    path: '/projects',
    type: 'folder',
    children: projectsData.map((project) => ({
      id: `file-${project.id}`,
      name: project.technical.codeSnippet.filename.split('/').pop() || `${project.id}.ts`,
      path: `/projects/${project.technical.codeSnippet.filename.split('/').pop() || `${project.id}.ts`}`,
      type: 'file' as const,
      language: project.technical.codeSnippet.language,
      content: `// Project: ${project.title}
// Tagline: ${project.tagline}
// Architecture: ${project.technical.architecture}
// Tech Stack: ${project.technical.techStack.join(', ')}

${project.technical.codeSnippet.code}
`,
    })),
  },
  {
    id: 'dir-system',
    name: 'system',
    path: '/system',
    type: 'folder',
    children: [
      {
        id: 'file-architecture',
        name: 'architecture_manifesto.md',
        path: '/system/architecture_manifesto.md',
        type: 'file',
        language: 'markdown',
        content: `# Engineering Principles & Architecture Tenets

1. **Simplicity Over Cleverness**:
   Write code that can be read, debugged, and maintained at 3 AM by an on-call engineer who did not write it.

2. **Measure First, Optimize Second**:
   Bottlenecks are rarely where intuition assumes. Use continuous profiling, eBPF probes, and distributed traces.

3. **Graceful Degradation**:
   Systems must fail gracefully. Rate limiting, circuit breakers, and stale-fallback caches keep services alive during downstream outages.

4. **Zero-Trust Security**:
   Authenticate every layer. Store no plain-text tokens. Implement defense in depth.
`,
      },
      {
        id: 'file-env',
        name: 'env.config.json',
        path: '/system/env.config.json',
        type: 'file',
        language: 'json',
        content: `{
  "portfolio_version": "2.4.0",
  "engine": "React 19 + TypeScript",
  "os_kernel": "WebOS Sim v1.2",
  "terminal_shell": "zsh / bash compatible",
  "ide_runtime": "Monaco/Prism-inspired Mock IDE",
  "audio_engine": "Web Audio API Synthesizer",
  "deployment": "Global Edge CDN"
}`,
      },
    ],
  },
  {
    id: 'dir-resume',
    name: 'resume',
    path: '/resume',
    type: 'folder',
    children: [
      {
        id: 'file-cv',
        name: profileData.contact.resumeFileName,
        path: `/resume/${profileData.contact.resumeFileName}`,
        type: 'file',
        language: 'text',
        content: buildResumeText(),
      },
    ],
  },
];
