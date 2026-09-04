import { projectsData } from './projects';
import { experienceData } from './experience';
import { skillCategoriesData } from './skills';
import { profileData } from './profile';
import { virtualFileSystem } from './filesystem';

export interface TerminalContext {
  setMode: (mode: 'technical' | 'executive') => void;
  openWindow: (id: any) => void;
  clearHistory: () => void;
  setTerminalTheme?: (theme: string) => void;
}

export interface CommandResult {
  output: string;
  isError?: boolean;
}

export const executeTerminalCommand = (
  rawInput: string,
  context: TerminalContext
): CommandResult => {
  const trimmed = rawInput.trim();
  if (!trimmed) return { output: '' };

  const [cmd, ...args] = trimmed.split(' ');
  const lowerCmd = cmd.toLowerCase();

  switch (lowerCmd) {
    case 'help':
      return {
        output: `Available CLI Commands:
  help               - Display this help manual
  whoami             - Print current engineer bio and system role
  projects           - List featured software projects & architectures
  skills             - Print technical skills and competencies matrix
  experience         - Print career history and measurable accomplishments
  contact            - View email, GitHub, LinkedIn, and scheduling links
  cat <filepath>     - Print the contents of a virtual file (e.g. cat /README.md)
  ls [path]          - List files and directories in the virtual filesystem
  open <app>         - Launch OS window: [ide | projects | about | resume]
  mode <type>        - Switch perspective: [executive | technical]
  clear              - Clear terminal display
  date               - Print current server time and timezone
  echo <message>     - Print text to standard output
  matrix             - Toggle cyberpunk matrix mode
  sudo <command>     - Attempt privileged operation`,
      };

    case 'whoami':
      return {
        output: `${profileData.name} — ${profileData.title}
Status: ${profileData.status}
Location: ${profileData.location}
Experience: ${profileData.yearsOfExperience} in Production Systems

Bio: ${profileData.technicalPitch}`,
      };

    case 'projects':
      return {
        output: `=== FEATURED PRODUCTION PROJECTS ===\n` +
          projectsData
            .map(
              (p, i) =>
                `[${i + 1}] ${p.title} (${p.category})
    Tagline: ${p.tagline}
    Stack:   ${p.technical.techStack.join(', ')}
    Impact:  ${p.executive.quantifiableImpact[0]}
    GitHub:  ${p.links.github || 'N/A'}`
            )
            .join('\n\n') +
          `\n\nTip: Type "open ide" to inspect project source code!`,
      };

    case 'skills':
      return {
        output: `=== TECHNICAL COMPETENCY MATRIX ===\n` +
          skillCategoriesData
            .map(
              (cat) =>
                `[${cat.title}]
  ${cat.items.map((item) => `${item.name} (${item.level})`).join('  |  ')}`
            )
            .join('\n\n'),
      };

    case 'experience':
      return {
        output: `=== CAREER TIMELINE ===\n` +
          experienceData
            .map(
              (e) =>
                `* ${e.role} @ ${e.company} (${e.period})
  Location: ${e.location}
  Highlight: ${e.highlights[0]}`
            )
            .join('\n\n'),
      };

    case 'contact':
      return {
        output: `Arthur's Contact Information:
  Email:    ${profileData.contact.email}
  GitHub:   ${profileData.contact.github}
  LinkedIn: ${profileData.contact.linkedin}
  Schedule: ${profileData.contact.meetingUrl}

You can also switch to Executive mode to use the one-click recruiter actions.`,
      };

    case 'ls': {
      const targetPath = args[0] || '/';
      if (targetPath === '/' || targetPath === '.') {
        const entries = virtualFileSystem.map((node) =>
          node.type === 'folder' ? `${node.name}/` : node.name
        );
        return { output: entries.join('    ') };
      }
      const folder = virtualFileSystem.find(
        (f) => f.path === targetPath || f.name === targetPath.replace('/', '')
      );
      if (folder && folder.children) {
        return {
          output: folder.children
            .map((c) => (c.type === 'folder' ? `${c.name}/` : c.name))
            .join('    '),
        };
      }
      return { output: `ls: cannot access '${targetPath}': No such directory`, isError: true };
    }

    case 'cat': {
      if (!args[0]) {
        return { output: 'cat: missing file operand\nUsage: cat <filename>', isError: true };
      }
      const filePath = args[0];
      // Search root or child files
      for (const node of virtualFileSystem) {
        if (node.path === filePath || node.name === filePath || `/${node.name}` === filePath) {
          if (node.type === 'folder') return { output: `cat: ${filePath}: Is a directory`, isError: true };
          return { output: node.content || '' };
        }
        if (node.children) {
          for (const child of node.children) {
            if (
              child.path === filePath ||
              child.name === filePath ||
              `/${node.name}/${child.name}` === filePath
            ) {
              return { output: child.content || '' };
            }
          }
        }
      }
      return { output: `cat: ${filePath}: No such file or directory`, isError: true };
    }

    case 'open': {
      const app = args[0]?.toLowerCase();
      if (!app) {
        return { output: 'open: please specify an application (ide, projects, about, resume)', isError: true };
      }
      if (['ide', 'projects', 'about', 'resume'].includes(app)) {
        context.openWindow(app);
        return { output: `Launching ${app.toUpperCase()}...` };
      }
      return { output: `open: unknown application '${app}'. Try: ide, projects, about, resume`, isError: true };
    }

    case 'mode': {
      const targetMode = args[0]?.toLowerCase();
      if (targetMode === 'executive' || targetMode === 'recruiter') {
        context.setMode('executive');
        return { output: 'Switching perspective to Executive / Recruiter View...' };
      } else if (targetMode === 'tech' || targetMode === 'technical' || targetMode === 'os') {
        context.setMode('technical');
        return { output: 'Already in Technical OS Mode.' };
      }
      return {
        output: `Usage: mode [executive | technical]\nCurrent mode: technical`,
      };
    }

    case 'clear':
      context.clearHistory();
      return { output: '' };

    case 'date':
      return { output: new Date().toString() };

    case 'echo':
      return { output: args.join(' ') };

    case 'sudo':
      return {
        output: `${profileData.handle} is not in the sudoers file. This incident will be reported to Santa Claus.`,
        isError: true,
      };

    case 'matrix':
      return {
        output: `[SYSTEM ALERT] Matrix protocol engaged. Wake up, Neo... Follow the white rabbit. 🐇`,
      };

    default:
      return {
        output: `zsh: command not found: ${cmd}. Type "help" for a list of available commands.`,
        isError: true,
      };
  }
};
