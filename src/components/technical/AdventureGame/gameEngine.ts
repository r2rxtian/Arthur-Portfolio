import type { ShrineMilestone } from './gameData';
import { shrinesData } from './gameData';

export interface GameEngineOptions {
  canvas: HTMLCanvasElement;
  onNearShrine: (shrine: ShrineMilestone | null) => void;
  onInteract: (shrine: ShrineMilestone) => void;
  onDiscover: (shrineId: string) => void;
}

export class AdventureGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onNearShrine: (shrine: ShrineMilestone | null) => void;
  private onInteract: (shrine: ShrineMilestone) => void;
  private onDiscover: (shrineId: string) => void;

  private isRunning: boolean = false;
  private rafId: number = 0;

  // World dimensions
  private readonly tileSize = 32;
  private readonly mapWidth = 25;
  private readonly mapHeight = 23;

  // Player state
  private player = {
    x: 12 * 32,
    y: 13 * 32,
    vx: 0,
    vy: 0,
    speed: 3.2,
    facing: 'up' as 'down' | 'up' | 'left' | 'right',
    animFrame: 0,
    animTimer: 0,
    isMoving: false,
  };

  // Keys state
  private keys: Record<string, boolean> = {};

  // Discovered shrines
  private discoveredShrines: Set<string> = new Set();
  private currentNearShrine: ShrineMilestone | null = null;

  // Ambient particles
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
  }> = [];

  // Torches
  private torches: Array<{ x: number; y: number }> = [
    { x: 10, y: 11 },
    { x: 14, y: 11 },
    { x: 10, y: 7 },
    { x: 14, y: 7 },
    { x: 10, y: 15 },
    { x: 14, y: 15 },
    { x: 6, y: 9 },
    { x: 18, y: 9 },
  ];

  constructor(opts: GameEngineOptions) {
    this.canvas = opts.canvas;
    this.ctx = opts.canvas.getContext('2d')!;
    this.onNearShrine = opts.onNearShrine;
    this.onInteract = opts.onInteract;
    this.onDiscover = opts.onDiscover;

    this.bindEvents();
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.resize();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }

  public destroy() {
    this.stop();
    this.unbindEvents();
  }

  public triggerInteract() {
    if (this.currentNearShrine) {
      this.discoveredShrines.add(this.currentNearShrine.id);
      this.onDiscover(this.currentNearShrine.id);
      this.onInteract(this.currentNearShrine);
      this.spawnCelebration(
        this.currentNearShrine.x * this.tileSize + 16,
        this.currentNearShrine.y * this.tileSize + 16,
        this.currentNearShrine.color
      );
    }
  }

  public moveVirtual(direction: 'up' | 'down' | 'left' | 'right', active: boolean) {
    if (direction === 'up') this.keys['ArrowUp'] = active;
    if (direction === 'down') this.keys['ArrowDown'] = active;
    if (direction === 'left') this.keys['ArrowLeft'] = active;
    if (direction === 'right') this.keys['ArrowRight'] = active;
  }

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.resize);
  }

  private unbindEvents() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.resize);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Only capture if game window is active
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
      this.keys[e.code] = true;
    }

    if (e.code === 'KeyE' || e.code === 'Space') {
      if (this.currentNearShrine) {
        e.preventDefault();
        this.triggerInteract();
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (this.keys[e.code]) {
      this.keys[e.code] = false;
    }
  };

  private resize = () => {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.canvas.width = parent.clientWidth || 800;
    this.canvas.height = parent.clientHeight || 500;
  };

  private loop = () => {
    if (!this.isRunning) return;

    this.update();
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update() {
    // Input handling
    let dx = 0;
    let dy = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    // Normalize diagonal speed
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.player.isMoving = dx !== 0 || dy !== 0;

    if (this.player.isMoving) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.facing = dx > 0 ? 'right' : 'left';
      } else {
        this.player.facing = dy > 0 ? 'down' : 'up';
      }

      this.player.animTimer += 1;
      if (this.player.animTimer % 8 === 0) {
        this.player.animFrame = (this.player.animFrame + 1) % 4;

        // Spawn footstep dust
        this.particles.push({
          x: this.player.x + 16 + (Math.random() - 0.5) * 6,
          y: this.player.y + 26,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.3,
          size: 2,
          color: '#65a30d',
          alpha: 0.6,
          life: 20,
        });
      }
    } else {
      this.player.animFrame = 0;
    }

    // World boundary collisions
    const nextX = this.player.x + dx * this.player.speed;
    const nextY = this.player.y + dy * this.player.speed;

    const minX = 32;
    const maxX = (this.mapWidth - 2) * this.tileSize;
    const minY = 32;
    const maxY = (this.mapHeight - 2) * this.tileSize;

    if (nextX >= minX && nextX <= maxX) {
      this.player.x = nextX;
    }
    if (nextY >= minY && nextY <= maxY) {
      this.player.y = nextY;
    }

    // Shrine Proximity Detection
    let near: ShrineMilestone | null = null;
    const playerCenterX = this.player.x + 16;
    const playerCenterY = this.player.y + 16;

    for (const shrine of shrinesData) {
      const sx = shrine.x * this.tileSize + 16;
      const sy = shrine.y * this.tileSize + 16;
      const dist = Math.hypot(playerCenterX - sx, playerCenterY - sy);

      if (dist < 52) {
        near = shrine;
        break;
      }
    }

    if (near !== this.currentNearShrine) {
      this.currentNearShrine = near;
      this.onNearShrine(near);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      p.alpha = Math.max(0, p.life / 25);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Ambient shrine sparkles
    if (Math.random() < 0.25) {
      const randomShrine = shrinesData[Math.floor(Math.random() * shrinesData.length)];
      this.particles.push({
        x: randomShrine.x * this.tileSize + 16 + (Math.random() - 0.5) * 20,
        y: randomShrine.y * this.tileSize + 8 + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.6 - Math.random() * 0.6,
        size: 2.5,
        color: randomShrine.color,
        alpha: 0.9,
        life: 30,
      });
    }
  }

  private spawnCelebration(x: number, y: number, color: string) {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 2,
        color,
        alpha: 1,
        life: 35 + Math.floor(Math.random() * 20),
      });
    }
  }

  private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Calculate camera offset to center on player smoothly
    const camX = Math.round(w / 2 - (this.player.x + 16));
    const camY = Math.round(h / 2 - (this.player.y + 16));

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Clear background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    ctx.translate(camX, camY);

    // 1. Draw Map Tiles
    this.renderTilemap();

    // 2. Draw Torches & Ambient Light
    this.renderTorches();

    // 3. Draw Project Shrines
    this.renderShrines();

    // 4. Draw Particles (below player)
    this.renderParticles();

    // 5. Draw Player Character
    this.renderPlayer();

    // 6. Draw Interaction Speech Bubble
    if (this.currentNearShrine) {
      this.renderInteractPrompt(this.currentNearShrine);
    }

    ctx.restore();
  }

  private renderTilemap() {
    const ctx = this.ctx;

    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const px = x * this.tileSize;
        const py = y * this.tileSize;

        // Border walls
        if (x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(px, py, this.tileSize, this.tileSize);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px + 2, py + 2, this.tileSize - 4, this.tileSize - 4);
          continue;
        }

        // Cobblestone path (Cross pattern connecting all shrines and citadel)
        const isPath =
          x === 12 ||
          y === 11 ||
          (x >= 6 && x <= 18 && (y === 6 || y === 16)) ||
          (y >= 6 && y <= 16 && (x === 6 || x === 18));

        if (isPath) {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(px, py, this.tileSize, this.tileSize);
          // Cobblestone speckles
          ctx.fillStyle = '#475569';
          ctx.fillRect(px + 4, py + 4, 6, 6);
          ctx.fillRect(px + 16, py + 14, 8, 7);
          ctx.fillRect(px + 6, py + 22, 6, 5);
        } else {
          // Lush Grass field
          ctx.fillStyle = '#3f6212';
          ctx.fillRect(px, py, this.tileSize, this.tileSize);
          ctx.fillStyle = '#4d7c0f';
          ctx.fillRect(px + 2, py + 2, this.tileSize - 4, this.tileSize - 4);

          // Grass blade details
          if ((x * 7 + y * 13) % 5 === 0) {
            ctx.fillStyle = '#65a30d';
            ctx.fillRect(px + 6, py + 8, 2, 6);
            ctx.fillRect(px + 9, py + 6, 2, 8);
          }
        }
      }
    }
  }

  private renderTorches() {
    const ctx = this.ctx;
    const time = Date.now() * 0.005;

    for (const t of this.torches) {
      const tx = t.x * this.tileSize + 16;
      const ty = t.y * this.tileSize + 16;

      // Wooden Post
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 2, ty - 2, 4, 14);

      // Flickering Flame
      const flicker = Math.sin(time + t.x) * 1.5;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(tx, ty - 6 + flicker, 4, 0, Math.PI * 2);
      ctx.fill();

      // Flame core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(tx, ty - 6 + flicker, 2, 0, Math.PI * 2);
      ctx.fill();

      // Ambient radial light
      const grad = ctx.createRadialGradient(tx, ty - 6, 2, tx, ty - 6, 42);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(tx, ty - 6, 42, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderShrines() {
    const ctx = this.ctx;
    const time = Date.now() * 0.003;

    for (const shrine of shrinesData) {
      const sx = shrine.x * this.tileSize;
      const sy = shrine.y * this.tileSize;
      const isDiscovered = this.discoveredShrines.has(shrine.id);

      // 1. Outer Glow Ring
      const bob = Math.sin(time + shrine.x) * 3;
      ctx.fillStyle = shrine.glowColor;
      ctx.beginPath();
      ctx.arc(sx + 16, sy + 16, 28, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ancient Stone Pedestal
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sx + 2, sy + 14, 28, 16);
      ctx.fillStyle = '#334155';
      ctx.fillRect(sx + 4, sy + 16, 24, 12);

      // 3. Floating Legendary Crystal / Glyph
      ctx.fillStyle = shrine.color;
      ctx.shadowColor = shrine.color;
      ctx.shadowBlur = 10;

      // Diamond Crystal shape
      ctx.beginPath();
      ctx.moveTo(sx + 16, sy + 2 + bob);
      ctx.lineTo(sx + 24, sy + 10 + bob);
      ctx.lineTo(sx + 16, sy + 18 + bob);
      ctx.lineTo(sx + 8, sy + 10 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Checkmark if discovered
      if (isDiscovered) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(sx + 26, sy + 4, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('✓', sx + 24, sy + 7);
      }

      // Shrine Label Banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = shrine.color;
      ctx.lineWidth = 1;
      const textWidth = ctx.measureText(shrine.title).width;
      ctx.strokeRect(sx + 16 - textWidth / 2 - 6, sy + 34, textWidth + 12, 14);
      ctx.fillRect(sx + 16 - textWidth / 2 - 6, sy + 34, textWidth + 12, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(shrine.title, sx + 16, sy + 44);
    }
  }

  private renderParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  private renderPlayer() {
    const ctx = this.ctx;
    const px = Math.round(this.player.x);
    const py = Math.round(this.player.y);
    const frame = this.player.animFrame;

    // Shadow below player
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(px + 16, py + 28, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body / Coat (Dark Navy Blue)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 10, py + 14, 12, 12);

    // Cyan Trim on Architect Coat
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + 15, py + 14, 2, 12);

    // Legs / Walking animation
    ctx.fillStyle = '#1e293b';
    if (this.player.facing === 'down' || this.player.facing === 'up') {
      const legOffset = frame === 1 ? -2 : frame === 3 ? 2 : 0;
      ctx.fillRect(px + 10, py + 24, 4, 6 + legOffset);
      ctx.fillRect(px + 18, py + 24, 4, 6 - legOffset);
    } else {
      const walkOffset = frame % 2 === 1 ? 3 : 0;
      ctx.fillRect(px + 12, py + 24, 8, 6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 13 + walkOffset, py + 28, 4, 2);
    }

    // Head / Face
    ctx.fillStyle = '#fbd38d';
    ctx.fillRect(px + 10, py + 5, 12, 10);

    // Modern Stylized Glasses / Visor
    if (this.player.facing !== 'up') {
      ctx.fillStyle = '#38bdf8';
      if (this.player.facing === 'down') {
        ctx.fillRect(px + 11, py + 8, 4, 3);
        ctx.fillRect(px + 17, py + 8, 4, 3);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(px + 15, py + 9, 2, 1);
      } else if (this.player.facing === 'left') {
        ctx.fillRect(px + 9, py + 8, 5, 3);
      } else if (this.player.facing === 'right') {
        ctx.fillRect(px + 18, py + 8, 5, 3);
      }
    }

    // Hair (Dark Brown / Black)
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(px + 9, py + 2, 14, 5);
    if (this.player.facing === 'left') {
      ctx.fillRect(px + 16, py + 5, 5, 4);
    } else if (this.player.facing === 'right') {
      ctx.fillRect(px + 9, py + 5, 5, 4);
    }
  }

  private renderInteractPrompt(shrine: ShrineMilestone) {
    const ctx = this.ctx;
    const sx = shrine.x * this.tileSize + 16;
    const sy = shrine.y * this.tileSize - 12;
    const time = Date.now() * 0.006;
    const bounce = Math.sin(time) * 3;

    ctx.save();
    ctx.textAlign = 'center';

    const text = ' [E] Examine Project ';
    ctx.font = 'bold 10px monospace';
    const textW = ctx.measureText(text).width;

    // Speech bubble background
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sx - textW / 2 - 4, sy - 14 + bounce, textW + 8, 18, 6);
    ctx.fill();
    ctx.stroke();

    // Downward arrow pointer
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy + 4 + bounce);
    ctx.lineTo(sx + 4, sy + 4 + bounce);
    ctx.lineTo(sx, sy + 8 + bounce);
    ctx.closePath();
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, sx, sy + bounce);

    ctx.restore();
  }
}
