import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, FolderOpen, Mail, RotateCcw, Trophy } from 'lucide-react';
import { projectsData } from '../../../data/projects';
import { profileData } from '../../../data/profile';
import { presentationFor, projectArchitecture } from '../../workbench/workbenchData';
import { useMode } from '../../../context/ModeContext';
import { useOS } from '../../../context/OSContext';
import { createGame, drop, resume, start, step, type GameEvent, type GameState, type LayerDef, type LayerKind } from './engine';
import './fullstack.css';

const STAGE = 520; // world width; the canvas scales it down on narrow screens
const BLOCK_HEIGHT = 38;
const BEST_KEY = 'fullstack_best';
const EASE = [0.16, 1, 0.3, 1] as const;
const ORDER: LayerKind[] = ['data', 'application', 'interface'];
const KIND_LABEL: Record<LayerKind, string> = { data: 'Data layer', application: 'Application layer', interface: 'Interface layer' };
const KIND_LIGHTNESS: Record<LayerKind, number> = { data: 30, application: 42, interface: 58 };

function hueOf(gradient: string) {
  const hex = gradient.match(/#([0-9a-f]{6})/i)?.[1];
  if (!hex) return 160;
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  if (!delta) return 160;
  const hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return Math.round(hue * 60 + 360) % 360;
}

// Every project, built bottom-up from its real architecture layers.
const LEVELS: LayerDef[] = projectsData.flatMap((project, projectIndex) => {
  const nodes = projectArchitecture[project.id] ?? [];
  return ORDER.map((kind) => ({
    projectIndex, kind,
    projectName: presentationFor(project.id).name,
    label: nodes.find((node) => node.id === kind)?.technology ?? KIND_LABEL[kind],
    hue: hueOf(project.thumbnailGradient),
  }));
});

const layerColor = (level: LayerDef, alpha = 1) => `hsla(${level.hue}, 52%, ${KIND_LIGHTNESS[level.kind]}%, ${alpha})`;
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };

interface Theme { canvas: string; text: string; muted: string; line: string; accent: string }
interface Effect { start: number; x: number; width: number; floor: number }
interface Hud { status: GameState['status']; score: number; combo: number; next: number; shipped: number[] }
const snapshot = (game: GameState): Hud => ({ status: game.status, score: game.score, combo: game.combo, next: game.next, shipped: [...game.shipped] });

/**
 * "Full Stack": stack each project's layers (data → application → interface). Overhangs get
 * sliced off, perfect drops build a combo that restores width, and shipping a project shows
 * what it achieved. One input (tap, click, Space) so it plays the same on every device.
 */
export function FullStackGame() {
  const { sounds } = useMode();
  const { openWindow } = useOS();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialGame] = useState(() => createGame(LEVELS, STAGE));
  const gameRef = useRef<GameState>(initialGame);
  const cameraRef = useRef(0);
  const effectsRef = useRef<Effect[]>([]);
  const themeRef = useRef<Theme>({ canvas: '#192226', text: '#e5ecea', muted: '#91a4a5', line: '#2d393e', accent: '#97d3be' });
  const [hud, setHud] = useState<Hud>(() => snapshot(initialGame));
  const [best, setBest] = useState(readBest);
  const [newBest, setNewBest] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const sync = useCallback(() => setHud(snapshot(gameRef.current)), []);

  // Theme colours come from the workbench tokens, refreshed whenever light/dark changes.
  useEffect(() => {
    const workspace = rootRef.current?.closest('.wb-root') ?? document.documentElement;
    const read = () => {
      const style = getComputedStyle(rootRef.current ?? document.documentElement);
      const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
      themeRef.current = {
        canvas: token('--wb-canvas', '#192226'), text: token('--wb-text', '#e5ecea'), muted: token('--wb-muted', '#91a4a5'),
        line: token('--wb-line', '#2d393e'), accent: token('--wb-accent', '#97d3be'),
      };
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(workspace, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Render loop. It pauses itself while the playroom pane is hidden.
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !stage || !context) return;
    let size = { width: 0, height: 0, dpr: 1 };
    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = { width: bounds.width, height: bounds.height, dpr };
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();

    let frame = 0;
    let last = performance.now();
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!stage.offsetParent || !size.width) { last = now; return; }
      const dt = (now - last) / 1000;
      last = now;
      const game = gameRef.current;
      step(game, dt);
      draw(context, game, size, cameraRef, effectsRef.current, themeRef.current, now, dt);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  const handleEvents = useCallback((events: GameEvent[]) => {
    const game = gameRef.current;
    const now = performance.now();
    for (const event of events) {
      if (event.type === 'place') {
        sounds.playBeep(360 + game.next * 14, 'triangle', 0.07, 0.03);
        setAnnouncement(`${KIND_LABEL[event.level.kind]} placed for ${event.level.projectName}.`);
      } else if (event.type === 'perfect') {
        const top = game.tower[game.tower.length - 1];
        effectsRef.current.push({ start: now, x: top.x, width: top.width, floor: game.tower.length - 1 });
        sounds.playBeep(660 + event.combo * 90, 'sine', 0.12, 0.04);
        setToast({ id: now, text: event.grew ? `Perfect ×${event.combo} · width restored` : event.combo > 1 ? `Perfect ×${event.combo}` : 'Perfect' });
        setAnnouncement(`Perfect drop, combo ${event.combo}.`);
      } else if (event.type === 'shipped') {
        [523, 659, 784].forEach((frequency, index) => setTimeout(() => sounds.playBeep(frequency, 'sine', 0.14, 0.035), index * 90));
        setAnnouncement(`${LEVELS.find((level) => level.projectIndex === event.projectIndex)?.projectName} shipped.`);
      } else if (event.type === 'miss') {
        sounds.playBeep(150, 'sawtooth', 0.3, 0.035);
        setAnnouncement('The stack collapsed.');
      }
    }
    if (game.status === 'over' || game.status === 'won') {
      const previous = readBest();
      setNewBest(game.score > previous);
      if (game.score > previous) {
        try { localStorage.setItem(BEST_KEY, String(game.score)); } catch { /* storage unavailable */ }
        setBest(game.score);
      }
    }
    sync();
  }, [sounds, sync]);

  const restart = useCallback(() => {
    gameRef.current = createGame(LEVELS, STAGE);
    cameraRef.current = 0;
    effectsRef.current = [];
    start(gameRef.current);
    setNewBest(false);
    sync();
    rootRef.current?.focus({ preventScroll: true });
  }, [sync]);

  const act = useCallback(() => {
    const game = gameRef.current;
    if (game.status === 'ready') { start(game); sounds.playClick(); sync(); }
    else if (game.status === 'playing') handleEvents(drop(game));
    else if (game.status === 'milestone') { resume(game); sounds.playClick(); sync(); }
  }, [handleEvents, sounds, sync]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button, a')) return;
    event.preventDefault();
    rootRef.current?.focus({ preventScroll: true });
    act();
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    if ((event.target as HTMLElement).closest('button, a') && event.target !== rootRef.current) return;
    event.preventDefault();
    if (event.repeat) return;
    const status = gameRef.current.status;
    if (status === 'over' || status === 'won') restart();
    else act();
  }

  const current = LEVELS[Math.min(hud.next, LEVELS.length - 1)];
  const shippedIndex = hud.shipped.at(-1);
  const shippedProject = shippedIndex === undefined ? null : projectsData[shippedIndex];
  const shippedLevels = shippedIndex === undefined ? [] : LEVELS.filter((level) => level.projectIndex === shippedIndex);
  const nextProject = LEVELS[hud.next]?.projectName;

  return (
    <div ref={rootRef} className="fs-root" tabIndex={0} role="application" aria-label="Full Stack game. Press Space or Enter, or tap, to drop each layer."
      onKeyDown={onKeyDown}>
      <header className="fs-hud">
        <div className="fs-hud-target">
          <span className="fs-kicker">{hud.status === 'won' ? 'All projects shipped' : `Building ${current.projectName}`}</span>
          <strong>{hud.status === 'won' ? 'Full-stack developer' : `${KIND_LABEL[current.kind]} · ${current.label}`}</strong>
        </div>
        <div className="fs-hud-stats">
          <div><span>Score</span><motion.strong key={hud.score} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }}>{hud.score}</motion.strong></div>
          <div><span>Best</span><strong>{best}</strong></div>
        </div>
      </header>
      <ol className="fs-pips" aria-label="Projects shipped">
        {projectsData.map((project, index) => {
          const done = hud.shipped.includes(index);
          const active = !done && current.projectIndex === index && hud.status !== 'ready';
          return <li key={project.id} className={`${done ? 'is-done' : ''}${active ? ' is-active' : ''}`} title={presentationFor(project.id).name}
            style={{ '--pip-hue': hueOf(project.thumbnailGradient) } as never}>
            <span className="sr-only">{presentationFor(project.id).name}: {done ? 'shipped' : 'not shipped'}</span>
          </li>;
        })}
      </ol>

      <div ref={stageRef} className="fs-stage" onPointerDown={onPointerDown}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <AnimatePresence>
          {toast && hud.status === 'playing' && (
            <motion.p key={toast.id} className="fs-toast" initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }} onAnimationComplete={() => setTimeout(() => setToast((value) => (value?.id === toast.id ? null : value)), 500)}>
              {toast.text}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {hud.status === 'ready' && (
            <Overlay key="ready">
              <span className="fs-kicker">The playroom</span>
              <h2>Full Stack</h2>
              <p>Build each of Arthur's projects from the database up. Drop every layer squarely on the one below: overhangs get cut off.</p>
              <ol className="fs-layers-legend">{ORDER.map((kind) => <li key={kind}><i data-kind={kind} />{KIND_LABEL[kind]}</li>)}</ol>
              <button className="fs-button fs-button-primary" onClick={act}>Start building <ArrowRight size={16} /></button>
              <small>Tap, click, or press Space to drop</small>
            </Overlay>
          )}
          {hud.status === 'milestone' && shippedProject && (
            <Overlay key={`shipped-${shippedIndex}`}>
              <span className="fs-kicker fs-kicker-success"><Check size={14} /> Shipped</span>
              <h2>{presentationFor(shippedProject.id).name}</h2>
              <p>{shippedProject.executive.quantifiableImpact[0]}</p>
              <ul className="fs-chips">{shippedLevels.map((level) => <li key={level.kind} style={{ background: layerColor(level, 0.9) }}>{level.label}</li>)}</ul>
              <small>Deploy bonus: the tower widens before the next build.</small>
              <button className="fs-button fs-button-primary" onClick={act}>Next: {nextProject} <ArrowRight size={16} /></button>
            </Overlay>
          )}
          {hud.status === 'over' && (
            <Overlay key="over">
              <span className="fs-kicker">The stack collapsed</span>
              <h2>{hud.score} <small>points</small></h2>
              <p>{hud.shipped.length} of {projectsData.length} projects shipped.{newBest ? ' New personal best.' : ` Best: ${best}.`}</p>
              <button className="fs-button fs-button-primary" onClick={restart}><RotateCcw size={16} /> Try again</button>
            </Overlay>
          )}
          {hud.status === 'won' && (
            <Overlay key="won">
              <span className="fs-kicker fs-kicker-success"><Trophy size={14} /> All {projectsData.length} projects shipped</span>
              <h2>Full-stack developer</h2>
              <p>{hud.score} points{newBest ? ', a new personal best' : ''}. Every layer you just stacked is a real part of Arthur's work.</p>
              <div className="fs-actions">
                <a className="fs-button fs-button-primary" href={`mailto:${profileData.contact.email}?subject=Let%27s%20build%20something`}><Mail size={16} /> Get in touch</a>
                <button className="fs-button" onClick={() => openWindow('projects')}><FolderOpen size={16} /> Explore the projects</button>
                <button className="fs-button" onClick={restart}><RotateCcw size={16} /> Play again</button>
              </div>
            </Overlay>
          )}
        </AnimatePresence>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <motion.div className="fs-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div className="fs-card" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }} transition={{ duration: 0.45, ease: EASE }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Canvas drawing ---------- */

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, r);
}

function draw(context: CanvasRenderingContext2D, game: GameState, size: { width: number; height: number; dpr: number },
  cameraRef: { current: number }, effects: Effect[], theme: Theme, now: number, dt: number) {
  const { width, height, dpr } = size;
  const scale = Math.min(1, (width - 32) / STAGE);
  const blockHeight = BLOCK_HEIGHT * scale;
  const originX = (width - STAGE * scale) / 2;
  const groundY = height - 48;

  // The camera eases upward so the top of the tower stays in the upper half of the view.
  const towerTop = (game.tower.length + 1) * blockHeight;
  const target = Math.max(0, towerTop - height * 0.5);
  cameraRef.current += (target - cameraRef.current) * (1 - Math.exp(-dt * 5));
  const camera = cameraRef.current;
  const floorY = (floor: number) => groundY - (floor + 1) * blockHeight + camera;
  const sx = (x: number) => originX + x * scale;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.fillStyle = theme.canvas;
  context.fillRect(0, 0, width, height);

  // Dot grid drifts at half speed for a little depth.
  context.fillStyle = theme.line;
  const gap = 22;
  const drift = (camera * 0.5) % gap;
  for (let y = drift - gap; y < height; y += gap) for (let x = (width % gap) / 2; x < width; x += gap) context.fillRect(x, y, 1.5, 1.5);

  // Ground line.
  const groundLine = groundY + camera;
  if (groundLine < height + 4) {
    context.fillStyle = theme.line;
    context.fillRect(0, groundLine, width, 1);
  }

  // Tower.
  context.font = `500 ${Math.max(9, 11 * scale)}px "Geist Mono", ui-monospace, monospace`;
  context.textBaseline = 'middle';
  game.tower.forEach((block, floor) => {
    const y = floorY(floor);
    if (y > height + blockHeight || y < -blockHeight * 2) return;
    const x = sx(block.x);
    const w = block.width * scale;
    if (!block.level) {
      roundRect(context, x, y, w, blockHeight - 2, 6 * scale);
      context.fillStyle = theme.line;
      context.fill();
      context.fillStyle = theme.muted;
      context.fillText('git init', x + 12, y + blockHeight / 2 - 1);
      return;
    }
    drawBlock(context, block.level, x, y, w, blockHeight, scale);
    // Annotate where each shipped project tops out.
    const isProjectTop = block.level.kind === 'interface' && game.shipped.includes(block.level.projectIndex);
    if (isProjectTop) {
      context.fillStyle = theme.muted;
      context.fillText(`↳ ${block.level.projectName}`, x + w + 10, y + blockHeight / 2 - 1);
    }
  });

  // The sliding layer, with faint guides down to the tower top so the aim is readable.
  if (game.moving && game.status === 'playing') {
    const level = game.levels[game.next];
    const y = floorY(game.tower.length);
    const x = sx(game.moving.x);
    const w = game.moving.width * scale;
    const topY = floorY(game.tower.length - 1);
    context.fillStyle = layerColor(level, 0.16);
    context.fillRect(x, y + blockHeight - 2, 1, topY - y);
    context.fillRect(x + w - 1, y + blockHeight - 2, 1, topY - y);
    drawBlock(context, level, x, y, w, blockHeight, scale);
  }

  // Offcuts tumble away.
  for (const fragment of game.fragments) {
    const y = floorY(fragment.floor) + fragment.offsetY;
    const w = fragment.width * scale;
    const x = sx(fragment.x);
    context.save();
    context.globalAlpha = Math.max(0, 1 - fragment.offsetY / 700);
    context.translate(x + w / 2, y + blockHeight / 2);
    context.rotate(fragment.rotation);
    drawBlock(context, fragment.level, -w / 2, -blockHeight / 2, w, blockHeight, scale, false);
    context.restore();
  }

  // Perfect-drop ripples.
  for (let index = effects.length - 1; index >= 0; index--) {
    const effect = effects[index];
    const age = (now - effect.start) / 520;
    if (age >= 1) { effects.splice(index, 1); continue; }
    const grow = 4 + age * 18;
    const y = floorY(effect.floor);
    context.strokeStyle = theme.accent;
    context.globalAlpha = 1 - age;
    context.lineWidth = 2;
    roundRect(context, sx(effect.x) - grow, y - grow, effect.width * scale + grow * 2, blockHeight - 2 + grow * 2, 8);
    context.stroke();
    context.globalAlpha = 1;
  }
}

function drawBlock(context: CanvasRenderingContext2D, level: LayerDef, x: number, y: number, w: number, h: number, scale: number, label = true) {
  if (w <= 0) return;
  roundRect(context, x, y, w, h - 2, 5 * scale);
  context.fillStyle = layerColor(level);
  context.fill();
  // Top highlight gives each slab a little thickness.
  context.fillStyle = 'rgba(255, 255, 255, 0.16)';
  context.fillRect(x + 2, y + 1, Math.max(0, w - 4), 2);
  if (!label) return;
  // Full label if it fits, else its first part ("SQL Server / JSON repository" → "SQL Server").
  const text = [level.label, level.label.split(/\s+[+/]\s+/)[0]].find((candidate) => context.measureText(candidate).width + 20 <= w);
  if (!text) return;
  context.fillStyle = KIND_LIGHTNESS[level.kind] > 50 ? 'rgba(10, 16, 18, 0.82)' : 'rgba(255, 255, 255, 0.88)';
  context.fillText(text, x + 10, y + h / 2 - 1);
}
