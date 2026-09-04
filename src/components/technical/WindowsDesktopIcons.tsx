import React from 'react';

// 1. Windows Yellow Folder (like .idea in screenshot)
export const WinFolderIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 10 C6 8.5 7.2 7.5 8.7 7.5 H18 C19.5 7.5 20.8 8.5 21.5 9.8 L23.5 13.5 H41 C42.6 13.5 44 14.9 44 16.5 V37 C44 38.6 42.6 40 41 40 H7 C5.3 40 4 38.6 4 37 V12.5 C4 11 5 10 6 10 Z"
      fill="#e09e0b"
    />
    <rect x="8" y="14" width="32" height="18" rx="2" fill="#ffffff" opacity="0.8" />
    <path
      d="M4 17 C4 15.3 5.3 14 7 14 H41 C42.7 14 44 15.3 44 17 V37 C44 38.7 42.7 40 41 40 H7 C5.3 40 4 38.7 4 37 V17 Z"
      fill="url(#folderGrad)"
    />
    <defs>
      <linearGradient id="folderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffd859" />
        <stop offset="40%" stopColor="#f7c22e" />
        <stop offset="100%" stopColor="#e5a00d" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. This PC (Computer monitor like in screenshot)
export const WinThisPCIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="8" width="38" height="26" rx="3" fill="#1e293b" />
    <rect x="8" y="11" width="32" height="20" rx="2" fill="#0284c7" />
    <path d="M8 11 L40 31 H8 Z" fill="rgba(255,255,255,0.15)" />
    <rect x="21" y="34" width="6" height="6" fill="#64748b" />
    <rect x="15" y="40" width="18" height="3" rx="1.5" fill="#475569" />
  </svg>
);

// 3. Recycle Bin (like in screenshot)
export const WinRecycleBinIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="11" rx="14" ry="4" fill="#60a5fa" />
    <path d="M10 11 L14 40 C14 41.5 18 43 24 43 C30 43 34 41.5 34 40 L38 11 Z" fill="#3b82f6" />
    <ellipse cx="24" cy="12" rx="12" ry="3" fill="#1d4ed8" opacity="0.6" />
    {/* Recycling symbol arrows */}
    <path
      d="M21 21 L27 21 L24 26 Z M20 28 L23 23 L26 26 Z M28 28 L25 33 L22 30 Z"
      fill="#ffffff"
      opacity="0.9"
    />
  </svg>
);

// 4. Adventure Game App Icon (like Counter-Strike / Roblox in screenshot)
export const WinAdventureIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#gameTileGrad)" />
    {/* Gamepad silhouette */}
    <path
      d="M14 20 C12 20 10 24 10 30 C10 34 13 36 16 34 L20 30 H28 L32 34 C35 36 38 34 38 30 C38 24 36 20 34 20 H14 Z"
      fill="#ffffff"
    />
    {/* D-Pad */}
    <path d="M16 23 V27 M14 25 H18" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Action buttons */}
    <circle cx="30" cy="24" r="1.5" fill="#f59e0b" />
    <circle cx="33" cy="26" r="1.5" fill="#ef4444" />
    <circle cx="31" cy="28" r="1.5" fill="#10b981" />
    <defs>
      <linearGradient id="gameTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
);

// 5. Visual Studio Code Icon (like in screenshot)
export const WinVSCodeIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 5 L16 20 L9 15 L5 18 L13 24 L5 30 L9 33 L16 28 L35 43 Z" fill="#0065a9" />
    <path d="M35 5 L28 12 L35 18 Z" fill="#007acc" />
    <path d="M35 43 L28 36 L35 30 Z" fill="#007acc" />
    <path d="M35 5 L43 9 V39 L35 43 Z" fill="#1f9cf0" />
  </svg>
);

// 6. Command Prompt Terminal (like in screenshot)
export const WinTerminalIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="40" height="34" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
    <path d="M10 18 L16 23 L10 28" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="19" y1="28" x2="27" y2="28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 7. Google Chrome (like in screenshot)
export const WinChromeIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#4285f4" />
    <circle cx="24" cy="24" r="8" fill="#ffffff" />
    <circle cx="24" cy="24" r="6" fill="#1a73e8" />
    <path d="M24 6 H38 L27 25 Z" fill="#ea4335" />
    <path d="M38 6 L43 27 L24 24 Z" fill="#fbbc05" />
    <path d="M6 31 L15 16 L24 24 Z" fill="#34a853" />
  </svg>
);

// 8. Discord (like in screenshot)
export const WinDiscordIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="40" height="40" rx="10" fill="#5865f2" />
    <path
      d="M33 16 C30.5 14.8 27.8 14.1 25 14 C24.7 14.6 24.3 15.3 24 16 C21 15.6 18 15.6 15 16 C14.7 15.3 14.3 14.6 14 14 C11.2 14.1 8.5 14.8 6 16 C2 22 1 28 1.5 34 C4.5 36.2 7.5 37.5 10.5 37.5 C11.2 36.5 11.9 35.5 12.5 34.4 C11.4 34 10.4 33.4 9.5 32.7 C9.8 32.5 10 32.3 10.3 32.1 C16.5 35 23.5 35 29.7 32.1 C30 32.3 30.2 32.5 30.5 32.7 C29.6 33.4 28.6 34 27.5 34.4 C28.1 35.5 28.8 36.5 29.5 37.5 C32.5 37.5 35.5 36.2 38.5 34 C39.1 27 37 21 33 16 Z M13 28 C11.3 28 10 26.7 10 25 C10 23.3 11.3 22 13 22 C14.7 22 16 23.3 16 25 C16 26.7 14.7 28 13 28 Z M27 28 C25.3 28 24 26.7 24 25 C24 23.3 25.3 22 27 22 C28.7 22 30 23.3 30 25 C30 26.7 28.7 28 27 28 Z"
      fill="#ffffff"
      transform="scale(0.85) translate(4, 4)"
    />
  </svg>
);

// 9. CPUID CPU-Z / Tech Matrix (like in screenshot)
export const WinCpuIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="36" height="36" rx="4" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
    <rect x="14" y="14" width="20" height="20" rx="2" fill="#4338ca" />
    <path d="M18 20 H30 M18 24 H30 M18 28 H26" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
    {/* Pins */}
    <line x1="12" y1="2" x2="12" y2="6" stroke="#fbbf24" strokeWidth="2" />
    <line x1="24" y1="2" x2="24" y2="6" stroke="#fbbf24" strokeWidth="2" />
    <line x1="36" y1="2" x2="36" y2="6" stroke="#fbbf24" strokeWidth="2" />
    <line x1="12" y1="42" x2="12" y2="46" stroke="#fbbf24" strokeWidth="2" />
    <line x1="24" y1="42" x2="24" y2="46" stroke="#fbbf24" strokeWidth="2" />
    <line x1="36" y1="42" x2="36" y2="46" stroke="#fbbf24" strokeWidth="2" />
  </svg>
);

// 10. Document / PDF (like Word / PDF in screenshot)
export const WinPdfIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6 C10 4.5 11.2 3 13 3 H29 L39 13 V42 C39 43.5 37.8 45 36 45 H13 C11.2 45 10 43.5 10 42 V6 Z" fill="#ef4444" />
    <path d="M29 3 V13 H39 Z" fill="#fca5a5" />
    <rect x="16" y="20" width="16" height="3" rx="1.5" fill="#ffffff" />
    <rect x="16" y="26" width="16" height="3" rx="1.5" fill="#ffffff" />
    <rect x="16" y="32" width="10" height="3" rx="1.5" fill="#ffffff" />
  </svg>
);

// 11. GitHub Desktop (like in screenshot)
export const WinGithubIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="40" height="40" rx="10" fill="#7e22ce" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 10 C16.27 10 10 16.27 10 24 C10 30.19 14.02 35.43 19.59 37.28 C20.29 37.41 20.55 36.98 20.55 36.61 C20.55 36.28 20.54 35.19 20.53 34.03 C16.63 34.88 15.81 32.35 15.81 32.35 C15.17 30.73 14.25 30.3 14.25 30.3 C12.98 29.43 14.35 29.45 14.35 29.45 C15.75 29.55 16.49 30.89 16.49 30.89 C17.74 33.03 19.77 32.41 20.57 32.06 C20.7 31.15 21.06 30.53 21.46 30.18 C18.35 29.83 15.08 28.63 15.08 23.27 C15.08 21.74 15.63 20.49 16.52 19.51 C16.38 19.16 15.89 17.73 16.66 15.79 C16.66 15.79 17.84 15.41 20.52 17.23 C21.64 16.92 22.84 16.76 24.03 16.76 C25.22 16.76 26.42 16.92 27.54 17.23 C30.22 15.41 31.4 15.79 31.4 15.79 C32.17 17.73 31.68 19.16 31.54 19.51 C32.44 20.49 32.98 21.74 32.98 23.27 C32.98 28.64 29.7 29.82 26.58 30.17 C27.08 30.6 27.52 31.45 27.52 32.75 C27.52 34.62 27.5 36.13 27.5 36.61 C27.5 36.98 27.75 37.42 28.47 37.28 C34.03 35.43 38.05 30.19 38.05 24 C38.05 16.27 31.78 10 24 10 Z"
      fill="#ffffff"
    />
  </svg>
);

// 12. Antigravity IDE (like Antigravity IDE highlighted in user's screenshot)
export const WinAntigravityIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="40" height="40" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
    <path
      d="M12 36 C12 24 20 12 24 12 C28 12 36 24 36 36 C32 30 28 26 24 26 C20 26 16 30 12 36 Z"
      fill="url(#agyArchGrad)"
    />
    <defs>
      <linearGradient id="agyArchGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
  </svg>
);

