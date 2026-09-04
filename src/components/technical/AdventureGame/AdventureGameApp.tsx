import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Award,
  Code2,
  ExternalLink,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GithubIcon } from '../../common/Icons';
import { useOS } from '../../../context/OSContext';
import { useMode } from '../../../context/ModeContext';
import { AdventureGameEngine } from './gameEngine';
import type { ShrineMilestone } from './gameData';
import { shrinesData, getProjectForShrine } from './gameData';

export const AdventureGameApp: React.FC = () => {
  const { openWindow } = useOS();
  const { soundEnabled, toggleSound, sounds } = useMode();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AdventureGameEngine | null>(null);

  const [nearShrine, setNearShrine] = useState<ShrineMilestone | null>(null);
  const [activeModalShrine, setActiveModalShrine] = useState<ShrineMilestone | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [scanlines, setScanlines] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new AdventureGameEngine({
      canvas,
      onNearShrine: (shrine) => {
        setNearShrine(shrine);
      },
      onInteract: (shrine) => {
        sounds.playClick();
        setActiveModalShrine(shrine);
      },
      onDiscover: (shrineId) => {
        setDiscoveredIds((prev) => {
          if (!prev.includes(shrineId)) {
            sounds.playWindowOpen();
            return [...prev, shrineId];
          }
          return prev;
        });
      },
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
    };
  }, [sounds]);

  const handleInspectProjectInIDE = () => {
    sounds.playClick();
    setActiveModalShrine(null);
    openWindow('ide');
  };

  const activeProject = activeModalShrine?.projectId
    ? getProjectForShrine(activeModalShrine.projectId)
    : null;

  return (
    <div className="adv-game-container">
      {/* Retro Arcade Window Top HUD */}
      <div className="adv-game-hud">
        <div className="adv-hud-left">
          <div className="adv-game-title">
            <Sparkles size={14} color="#ffd700" />
            <span>ARTHUR'S ODYSSEY</span>
            <span className="adv-game-version">v1.0.exe</span>
          </div>

          <div className="adv-hud-stats">
            <span className="adv-hud-level">LVL. 99</span>
            <div className="adv-hp-wrap">
              <span className="adv-hp-label">HP</span>
              <div className="adv-hp-bar">
                <div className="adv-hp-fill" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="adv-hud-center">
          <div className="adv-artifact-tracker">
            <Award size={14} color="#38bdf8" />
            <span>Artifacts Unlocked:</span>
            <span className="adv-tracker-count">
              {discoveredIds.filter((id) => id.startsWith('shrine-')).length} / {shrinesData.filter((s) => s.id.startsWith('shrine-')).length}
            </span>
          </div>
        </div>

        <div className="adv-hud-right">
          <button
            onClick={() => setScanlines((v) => !v)}
            className={`adv-hud-btn ${scanlines ? 'is-active' : ''}`}
            title="Toggle CRT Scanline Effect"
          >
            CRT: {scanlines ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleSound}
            className="adv-hud-btn"
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Optional CRT Scanlines */}
      <div className={`adv-viewport ${scanlines ? 'has-scanlines' : ''}`}>
        <canvas ref={canvasRef} className="adv-canvas" />

        {/* Floating Quick Action Overlay Button if near a shrine */}
        {nearShrine && (
          <button
            onClick={() => engineRef.current?.triggerInteract()}
            className="adv-floating-interact-btn"
          >
            <span>[E] Examine {nearShrine.title}</span>
          </button>
        )}

        {/* On-Screen Virtual D-Pad for Touch/Mouse */}
        <div className="adv-virtual-controls">
          <div className="adv-dpad-row">
            <button
              onMouseDown={() => engineRef.current?.moveVirtual('up', true)}
              onMouseUp={() => engineRef.current?.moveVirtual('up', false)}
              onTouchStart={() => engineRef.current?.moveVirtual('up', true)}
              onTouchEnd={() => engineRef.current?.moveVirtual('up', false)}
              className="adv-dpad-btn adv-dpad-up"
              aria-label="Move Up"
            >
              ▲
            </button>
          </div>
          <div className="adv-dpad-row">
            <button
              onMouseDown={() => engineRef.current?.moveVirtual('left', true)}
              onMouseUp={() => engineRef.current?.moveVirtual('left', false)}
              onTouchStart={() => engineRef.current?.moveVirtual('left', true)}
              onTouchEnd={() => engineRef.current?.moveVirtual('left', false)}
              className="adv-dpad-btn"
              aria-label="Move Left"
            >
              ◀
            </button>
            <button
              onMouseDown={() => engineRef.current?.moveVirtual('down', true)}
              onMouseUp={() => engineRef.current?.moveVirtual('down', false)}
              onTouchStart={() => engineRef.current?.moveVirtual('down', true)}
              onTouchEnd={() => engineRef.current?.moveVirtual('down', false)}
              className="adv-dpad-btn"
              aria-label="Move Down"
            >
              ▼
            </button>
            <button
              onMouseDown={() => engineRef.current?.moveVirtual('right', true)}
              onMouseUp={() => engineRef.current?.moveVirtual('right', false)}
              onTouchStart={() => engineRef.current?.moveVirtual('right', true)}
              onTouchEnd={() => engineRef.current?.moveVirtual('right', false)}
              className="adv-dpad-btn"
              aria-label="Move Right"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Controls Guide Banner */}
        <div className="adv-controls-legend">
          <span>[W,A,S,D] / Arrows: Move</span>
          <span>•</span>
          <span>[E] / Space: Examine Shrine</span>
        </div>
      </div>

      {/* Interactive Project Milestone Dialogue Modal */}
      {activeModalShrine && (
        <div className="adv-modal-backdrop" onClick={() => setActiveModalShrine(null)}>
          <div className="adv-dialogue-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div
              className="adv-modal-header"
              style={{ borderLeftColor: activeModalShrine.color }}
            >
              <div>
                <div className="adv-modal-eyebrow">
                  <span>{activeModalShrine.glyph}</span>
                  <span>{activeModalShrine.name}</span>
                </div>
                <h3 className="adv-modal-title">{activeModalShrine.title}</h3>
              </div>

              <button
                onClick={() => setActiveModalShrine(null)}
                className="adv-modal-close"
                aria-label="Close dialogue"
              >
                <X size={18} />
              </button>
            </div>

            {/* NPC Dialogue Lore Box */}
            <div className="adv-npc-box">
              <div className="adv-npc-avatar">
                <span>{activeModalShrine.glyph}</span>
              </div>
              <div className="adv-npc-content">
                <div className="adv-npc-name">
                  {activeModalShrine.npcName}{' '}
                  <span className="adv-npc-role">[{activeModalShrine.npcRole}]</span>
                </div>
                <p className="adv-npc-quote">{activeModalShrine.npcQuote}</p>
              </div>
            </div>

            {/* Project Details (if linked) */}
            {activeProject ? (
              <div className="adv-project-body">
                <div className="adv-project-challenge">
                  <span className="adv-body-subtitle">Business Challenge & Solution:</span>
                  <p>{activeProject.executive.strategicSolution}</p>
                </div>

                <div className="adv-impact-section">
                  <span className="adv-body-subtitle">Verified Impact:</span>
                  <ul className="adv-impact-list">
                    {activeProject.executive.quantifiableImpact.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle size={14} color="#10b981" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="adv-tech-tags">
                  {activeProject.technical.techStack.map((tech) => (
                    <span key={tech} className="adv-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Modal Action Buttons */}
                <div className="adv-modal-actions">
                  <button
                    onClick={handleInspectProjectInIDE}
                    className="adv-btn adv-btn-primary"
                    title="Inspect source code in Code Studio IDE"
                  >
                    <Code2 size={15} />
                    <span>Open in Code Studio IDE</span>
                  </button>

                  {activeProject.links.demo && (
                    <a
                      href={activeProject.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="adv-btn adv-btn-secondary"
                    >
                      <ExternalLink size={15} />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {activeProject.links.github && (
                    <a
                      href={activeProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="adv-btn adv-btn-secondary"
                    >
                      <GithubIcon size={15} />
                      <span>GitHub</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveModalShrine(null)}
                    className="adv-btn adv-btn-ghost"
                  >
                    Continue Quest
                  </button>
                </div>
              </div>
            ) : (
              <div className="adv-project-body">
                <p style={{ fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.6 }}>
                  Congratulations, traveler! You have navigated Arthur's software engineering domain and
                  unlocked all 5 milestone projects. Ready to connect and build practical, scalable
                  digital experiences together?
                </p>

                <div className="adv-modal-actions" style={{ marginTop: 18 }}>
                  <button
                    onClick={() => {
                      setActiveModalShrine(null);
                      openWindow('resume');
                    }}
                    className="adv-btn adv-btn-primary"
                  >
                    <span>View Arthur's Resume</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModalShrine(null);
                      openWindow('terminal');
                    }}
                    className="adv-btn adv-btn-secondary"
                  >
                    <span>Open Terminal CLI</span>
                  </button>

                  <button
                    onClick={() => setActiveModalShrine(null)}
                    className="adv-btn adv-btn-ghost"
                  >
                    Resume Exploration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
