import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMode } from '../../context/ModeContext';
import '../../styles/cursor.css';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  isSquare?: boolean;
}

export const CustomCursor: React.FC = () => {
  const { mode } = useMode();
  const [enabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const corePositionerRef = useRef<HTMLDivElement>(null);
  const mcCrosshairRef = useRef<HTMLDivElement>(null);
  const diamondCoreRef = useRef<HTMLDivElement>(null);
  const mcTooltipRef = useRef<HTMLDivElement>(null);
  const execBadgeRef = useRef<HTMLDivElement>(null);

  // 4 Corner Brackets for Executive Mode
  const bracketTLRef = useRef<HTMLDivElement>(null);
  const bracketTRRef = useRef<HTMLDivElement>(null);
  const bracketBLRef = useRef<HTMLDivElement>(null);
  const bracketBRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const corePositioner = corePositionerRef.current;
    const mcCrosshair = mcCrosshairRef.current;
    const diamondCore = diamondCoreRef.current;
    const mcTooltip = mcTooltipRef.current;
    const execBadge = execBadgeRef.current;
    const bTL = bracketTLRef.current;
    const bTR = bracketTRRef.current;
    const bBL = bracketBLRef.current;
    const bBR = bracketBRRef.current;
    if (!canvas || !corePositioner) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Trail & Particle State
    const trailPoints: TrailPoint[] = [];
    const maxTrailPoints = mode === 'technical' ? 10 : 16;
    const particles: SparkParticle[] = [];

    const mouse = { x: -100, y: -100 };
    const bracketOffset = { val: 0 };
    let targetBracketOffset = 0;
    let isHovering = false;
    let hasMoved = false;
    let rafId: number;

    // Instant 0ms hardware positioner
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      corePositioner.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;

      trailPoints.unshift({ x: mouse.x, y: mouse.y, age: 0 });
      if (trailPoints.length > maxTrailPoints) {
        trailPoints.pop();
      }

      if (!hasMoved) {
        hasMoved = true;
        if (mcCrosshair) mcCrosshair.style.opacity = '1';
        if (diamondCore) diamondCore.style.opacity = '1';
      }
    };

    // Render loop for Canvas (Comet Ribbon & Particles)
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Trail Rendering
      if (trailPoints.length > 0) {
        ctx.save();
        if (mode === 'technical') {
          // Minecraft Mode: Subtle floating pixel dust
          for (let i = 0; i < trailPoints.length; i++) {
            const pt = trailPoints[i];
            pt.age += 1;
            const alpha = Math.max(0, 0.6 - pt.age * 0.05);
            ctx.fillStyle = `rgba(80, 240, 160, ${alpha})`;
            ctx.fillRect(pt.x - 1, pt.y - 1, 3, 3);
          }
        } else {
          // Executive Mode: Smooth Luminous Comet Ribbon
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(trailPoints[0].x, trailPoints[0].y);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
          ctx.lineWidth = 4;
          ctx.stroke();

          for (let i = 0; i < trailPoints.length - 1; i++) {
            const pt = trailPoints[i];
            const nextPt = trailPoints[i + 1];
            pt.age += 1;

            const progress = 1 - i / trailPoints.length;
            const strokeWidth = progress * 3.5;
            const alpha = progress * 0.7;

            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(nextPt.x, nextPt.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = Math.max(strokeWidth, 0.5);
            ctx.stroke();
          }
        }

        while (trailPoints.length > 0 && trailPoints[trailPoints.length - 1].age > 18) {
          trailPoints.pop();
        }

        ctx.restore();
      }

      // 2. Click Particles (Square block debris in Minecraft mode, stardust in Executive mode)
      if (particles.length > 0) {
        ctx.save();
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.isSquare) {
            // Minecraft block debris gravity physics
            p.vy += 0.22;
            p.vx *= 0.94;
            p.alpha -= 0.024;
          } else {
            // Executive stardust physics
            p.vx *= 0.93;
            p.vy *= 0.93;
            p.alpha -= 0.028;
          }

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.alpha, 0);

          if (p.isSquare) {
            // Render crisp square pixel particle
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          } else {
            // Render circular glowing spark
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 3. Update HUD Elements
      if (mode === 'executive' && bTL && bTR && bBL && bBR) {
        bracketOffset.val += (targetBracketOffset - bracketOffset.val) * 0.25;
        const off = bracketOffset.val;

        bTL.style.transform = `translate3d(${mouse.x - off - 9}px, ${mouse.y - off - 9}px, 0)`;
        bTR.style.transform = `translate3d(${mouse.x + off}px, ${mouse.y - off - 9}px, 0)`;
        bBL.style.transform = `translate3d(${mouse.x - off - 9}px, ${mouse.y + off}px, 0)`;
        bBR.style.transform = `translate3d(${mouse.x + off}px, ${mouse.y + off}px, 0)`;

        if (execBadge) {
          execBadge.style.transform = `translate3d(${mouse.x + off + 6}px, ${mouse.y + off + 6}px, 0)`;
        }
      } else if (mode === 'technical' && mcTooltip) {
        mcTooltip.style.transform = `translate3d(${mouse.x + 14}px, ${mouse.y + 14}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    // Mousedown interaction
    const handleMouseDown = (e: MouseEvent) => {
      if (mode === 'technical') {
        // Minecraft punch pulse
        if (mcCrosshair) {
          gsap.to(mcCrosshair, { scale: 0.8, duration: 0.08, yoyo: true, repeat: 1 });
        }

        // Spawn Minecraft block break debris particles
        const mcColors = [
          '#866043', // Dirt
          '#797979', // Stone
          '#855f38', // Oak Wood
          '#4dedf4', // Diamond
          '#fcee4b', // Gold
          '#17dd62', // Emerald
          '#e74c3c', // Redstone
        ];

        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.5, // initial upward kick
            size: Math.random() > 0.5 ? 4 : 3,
            alpha: 1,
            color: mcColors[Math.floor(Math.random() * mcColors.length)],
            isSquare: true,
          });
        }
      } else {
        // Executive mode click
        if (diamondCore) {
          gsap.to(diamondCore, { scale: 0.65, rotation: 135, duration: 0.08 });
        }
        targetBracketOffset = isHovering ? 14 : 8;

        for (let i = 0; i < 14; i++) {
          const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
          const speed = 2.5 + Math.random() * 4.5;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1.5 + Math.random() * 2,
            alpha: 1,
            color: '#38bdf8',
            isSquare: false,
          });
        }
      }
    };

    const handleMouseUp = () => {
      if (mode === 'executive' && diamondCore) {
        gsap.to(diamondCore, { scale: isHovering ? 1.3 : 1, rotation: 45, duration: 0.2, ease: 'back.out(2)' });
        targetBracketOffset = isHovering ? 20 : 0;
      }
    };

    // Hover Interaction
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], .desktop-icon-item, .xp-btn, .xp-start-btn, .xp-task-tab, .ide-tab, .ide-tree-node, .work-card, .case-study-card, .cert-card, .explorer-card, .perspective-toggle, .sound-toggle-btn'
      );

      if (interactive) {
        isHovering = true;

        if (mode === 'technical') {
          // Minecraft Mode: Pulse crosshair and show tooltip
          if (mcCrosshair) {
            gsap.to(mcCrosshair, { scale: 1.25, duration: 0.15 });
          }
          if (mcTooltip) {
            let label = 'Interact';
            if (target.closest('.desktop-icon-item')) {
              label = target.closest('.desktop-icon-item')?.querySelector('.desktop-icon-label')?.textContent || 'Open Program';
            } else if (target.closest('.xp-start-btn')) {
              label = 'Start Menu';
            } else if (target.closest('.xp-task-tab')) {
              label = 'Window Tab';
            } else if (target.closest('.ide-tab')) {
              label = 'Editor File';
            } else if (target.closest('.xp-btn-close')) {
              label = 'Close Window';
            } else if (target.closest('.perspective-toggle')) {
              label = 'Switch Perspective';
            }
            mcTooltip.textContent = label;
            mcTooltip.classList.add('is-visible');
          }
        } else {
          // Executive Mode: Brackets & Badge
          const card = target.closest('.work-card, .case-study-card, .cert-card, .explorer-card');
          targetBracketOffset = card ? 24 : 18;
          if (bTL && bTR && bBL && bBR) {
            gsap.to([bTL, bTR, bBL, bBR], { opacity: card ? 1 : 0.9, duration: 0.2 });
          }
          if (diamondCore) {
            gsap.to(diamondCore, { scale: card ? 1.35 : 1.25, rotation: 90, duration: 0.2 });
          }
          if (execBadge) {
            const isCert = Boolean(target.closest('.cert-card'));
            execBadge.textContent = isCert ? 'VERIFY' : card ? 'EXPLORE' : 'ACTION';
            execBadge.classList.add('is-visible');
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], .desktop-icon-item, .xp-btn, .xp-start-btn, .xp-task-tab, .ide-tab, .ide-tree-node, .work-card, .case-study-card, .cert-card, .explorer-card, .perspective-toggle, .sound-toggle-btn'
      );

      if (interactive && isHovering) {
        const related = e.relatedTarget as HTMLElement | null;
        if (related && related.closest('a, button, input, textarea, select, [role="button"], .desktop-icon-item, .xp-btn, .xp-start-btn, .xp-task-tab, .ide-tab, .ide-tree-node, .work-card, .case-study-card, .cert-card, .explorer-card, .perspective-toggle, .sound-toggle-btn')) {
          return;
        }

        isHovering = false;

        if (mode === 'technical') {
          if (mcCrosshair) {
            gsap.to(mcCrosshair, { scale: 1, duration: 0.15 });
          }
          if (mcTooltip) {
            mcTooltip.classList.remove('is-visible');
          }
        } else {
          targetBracketOffset = 0;
          if (bTL && bTR && bBL && bBR) {
            gsap.to([bTL, bTR, bBL, bBR], { opacity: 0, duration: 0.15 });
          }
          if (diamondCore) {
            gsap.to(diamondCore, { scale: 1, rotation: 45, duration: 0.2 });
          }
          if (execBadge) {
            execBadge.classList.remove('is-visible');
          }
        }
      }
    };

    const handleMouseLeave = () => {
      if (mcCrosshair) mcCrosshair.style.opacity = '0';
      if (diamondCore) diamondCore.style.opacity = '0';
      if (bTL && bTR && bBL && bBR) {
        gsap.to([bTL, bTR, bBL, bBR], { opacity: 0, duration: 0.15 });
      }
      if (mcTooltip) mcTooltip.classList.remove('is-visible');
      if (execBadge) execBadge.classList.remove('is-visible');
    };

    const handleMouseEnter = () => {
      if (hasMoved) {
        if (mcCrosshair) mcCrosshair.style.opacity = '1';
        if (diamondCore) diamondCore.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mode, enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Hardware-accelerated Canvas for Ribbon Trail & Particle Debris */}
      <canvas ref={canvasRef} className="cursor-canvas-layer" />

      {/* Cybernetic / Minecraft HUD Overlays */}
      <div className={`cursor-hud-container ${mode}`} aria-hidden="true">
        {/* Instant 0ms Positioner */}
        <div ref={corePositionerRef} className="cursor-core-positioner">
          {mode === 'technical' ? (
            /* Authentic Minecraft Pixel-Art Crosshair */
            <div ref={mcCrosshairRef} className="cursor-minecraft-crosshair">
              <svg
                width="22"
                height="22"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
              >
                {/* 1px Black Pixel Outline */}
                <path d="M6,0 H9 V6 H15 V9 H9 V15 H6 V9 H0 V6 H6 V0 Z" fill="#000000" />
                {/* Inner White Pixel Cross */}
                <path d="M7,1 H8 V7 H14 V8 H8 V14 H7 V8 H1 V7 H7 V1 Z" fill="#ffffff" />
              </svg>
            </div>
          ) : (
            /* Executive Precision Diamond Crystal */
            <div ref={diamondCoreRef} className="cursor-diamond-core" />
          )}
        </div>

        {mode === 'technical' ? (
          /* Minecraft In-Game Item Tooltip */
          <div ref={mcTooltipRef} className="cursor-minecraft-tooltip" />
        ) : (
          /* Executive HUD Corner Brackets & Badge */
          <>
            <div ref={bracketTLRef} className="cursor-bracket cursor-bracket-tl" />
            <div ref={bracketTRRef} className="cursor-bracket cursor-bracket-tr" />
            <div ref={bracketBLRef} className="cursor-bracket cursor-bracket-bl" />
            <div ref={bracketBRRef} className="cursor-bracket cursor-bracket-br" />
            <div ref={execBadgeRef} className="cursor-hud-badge" />
          </>
        )}
      </div>
    </>
  );
};
