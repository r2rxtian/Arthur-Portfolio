import React, { useRef, useState } from 'react';
import { Zap, Award } from 'lucide-react';
import profileImg from '../../assets/profile.png';

export const HeroAvatar: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10deg to +10deg)
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="exec-avatar-perspective-wrapper">
      <div
        ref={cardRef}
        className={`exec-avatar-3d-card ${isHovered ? 'is-interacting' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        }}
      >
        {/* Layer 0: Radial Ambient Light Flare */}
        <div className="exec-avatar-halo" />

        {/* Layer 1: High-Tech Cyber Glass Frame */}
        <div className="exec-avatar-frame">
          {/* Executive Real Photo Portrait Canvas */}
          <div className="exec-avatar-art">
            <img
              src={profileImg}
              alt="Arthur Christian"
              className="exec-avatar-img"
              loading="eager"
            />

            {/* Ambient Dark Tech Vignette Overlay */}
            <div className="exec-avatar-vignette" />

            {/* Glass Surface Sheen Overlay */}
            <div className="exec-avatar-sheen" />
          </div>
        </div>

        {/* Layer 2: Floating Badge Top-Right (Depth = 38px) */}
        <div className="exec-avatar-badge exec-badge-top-right">
          <div className="exec-badge-icon">
            <Award size={15} color="#38bdf8" />
          </div>
          <div>
            <div className="exec-badge-title">Staff Systems Architect</div>
            <div className="exec-badge-sub">Distributed Systems & AI</div>
          </div>
        </div>

        {/* Layer 3: Floating Status Badge Bottom-Left (Depth = 48px) */}
        <div className="exec-avatar-badge exec-badge-bottom-left">
          <span className="exec-badge-status-dot" />
          <div>
            <div className="exec-badge-title">Available for High-Impact Roles</div>
            <div className="exec-badge-sub">Remote · Global Reach</div>
          </div>
        </div>

        {/* Layer 4: Floating Production Metric Badge Bottom-Right (Depth = 28px) */}
        <div className="exec-avatar-badge exec-badge-bottom-right">
          <div className="exec-badge-icon-emerald">
            <Zap size={14} color="#10b981" />
          </div>
          <div>
            <div className="exec-badge-title">12.5M req/min Peak</div>
            <div className="exec-badge-sub">100% SLA Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};
