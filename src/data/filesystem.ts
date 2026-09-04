import type { VirtualFile } from '../types/os';
import { projectsData } from './projects';

export const virtualFileSystem: VirtualFile[] = [
  {
    id: 'root-readme',
    name: 'README.md',
    path: '/README.md',
    type: 'file',
    language: 'markdown',
    content: `# Arthur Christian — Systems & Full-Stack Architect
> Dual-mode engineering portfolio. Built with TypeScript, React 19, and Vite.

## Overview
- **Specialization**: Distributed systems, real-time event streaming, and high-performance Web applications.
- **Philosophy**: Build software that is resilient under stress, delightful to use, and measurably impacts the business.
- **Modes**:
  - **Technical Mode**: Interactive OS desktop simulation, terminal CLI, and embedded code IDE.
  - **Executive Mode**: Curated case studies with business problems, strategic solutions, and impact metrics.

## Quick CLI Shortcuts
- Type \`help\` to explore all terminal commands.
- Type \`projects\` to list repositories with stats.
- Type \`cat /README.md\` to view this file in terminal.
- Click the floating badge in the bottom-right to switch to Executive view.
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
        name: 'Arthur_Christian_CV.txt',
        path: '/resume/Arthur_Christian_CV.txt',
        type: 'file',
        language: 'text',
        content: `=====================================================
ARTHUR CHRISTIAN - SENIOR FULL-STACK & SYSTEMS ARCHITECT
Email: arthur.engineer@example.com | GitHub: github.com/r2rxtian
Location: Remote / Global | Status: Available for High-Impact Roles
=====================================================

CORE COMPETENCIES:
- Distributed Systems, Microservices, Cloud Architecture (AWS, Docker, K8s)
- TypeScript, React 19, Node.js, Go (Golang), Python, PostgreSQL, Redis, Kafka
- Real-time WebSockets, Web Performance Optimization, Zero-Trust Passkeys

EXPERIENCE SUMMARY:
- Lead Systems & Full-Stack Architect @ Apex Cloud (2023 - Present)
  * Slashed infrastructure spend by $180k/yr via Go/TypeScript microservices.
  * Cut deployment turnaround from 45 min to <3 min with internal developer platform.
- Senior Full-Stack Engineer @ Veloce Data Systems (2021 - 2023)
  * Engineered 120k tick/sec WebSocket telemetry stream for fintech trading desks.
- Software Engineer @ Synthetix Interactive (2019 - 2021)
  * Designed reusable component design system adopted across 12 product lines.
`,
      },
    ],
  },
];
