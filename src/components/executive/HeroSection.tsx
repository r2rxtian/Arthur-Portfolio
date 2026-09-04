import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Award, Mail, ShieldCheck } from 'lucide-react';
import { profileData } from '../../data/profile';
import { HeroAvatar } from './HeroAvatar';
import { TechMarquee } from './TechMarquee';

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Staggered hero entrance
      tl.from('.exec-status-badge', {
        opacity: 0,
        y: -12,
        duration: 0.5,
      })
        .from(
          '.exec-hero-title',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          '.exec-hero-pitch',
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.exec-hero-actions',
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.exec-avatar-perspective-wrapper',
          {
            opacity: 0,
            scale: 0.92,
            duration: 0.7,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        )
        .from(
          '.exec-metric-card',
          {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
          },
          '-=0.3'
        );

      // Number tick animation for metrics
      metricRefs.current.forEach((el, index) => {
        if (!el) return;
        const targetVal = profileData.metrics[index].value;
        const numMatch = targetVal.match(/[\d.]+/);
        if (numMatch) {
          const targetNum = parseFloat(numMatch[0]);
          const suffix = targetVal.replace(/[\d.]+/, '');
          const obj = { val: 0 };

          gsap.to(obj, {
            val: targetNum,
            duration: 1.6,
            ease: 'power2.out',
            delay: 0.4 + index * 0.1,
            onUpdate: () => {
              if (el) {
                el.textContent =
                  (Number.isInteger(targetNum) ? Math.floor(obj.val) : obj.val.toFixed(1)) + suffix;
              }
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="exec-hero" id="overview">
      <div className="exec-hero-grid">
        {/* Left Column: Core Positioning & Metrics */}
        <div className="exec-hero-content">
          <div className="exec-status-badge">
            <span className="exec-status-dot" />
            <ShieldCheck size={14} color="#34d399" />
            <span>{profileData.status}</span>
          </div>

          <h1 className="exec-hero-title">
            Architecting <span className="exec-gradient-text">high-throughput systems</span> and product-focused web platforms.
          </h1>

          <p className="exec-hero-pitch">
            {profileData.executivePitch}
          </p>

          <div className="exec-hero-actions">
            <a href="#work" className="exec-btn exec-btn-primary">
              <span>Explore Work</span>
              <ArrowRight size={16} />
            </a>

            <a href="#certificates" className="exec-btn exec-btn-secondary">
              <Award size={16} color="#38bdf8" />
              <span>Certifications</span>
            </a>

            <a href="#contact" className="exec-btn exec-btn-secondary">
              <Mail size={16} color="#10b981" />
              <span>Contact Me</span>
            </a>
          </div>

          {/* Production Impact Metrics Grid */}
          <div className="exec-metrics-grid">
            {profileData.metrics.map((metric, i) => (
              <div key={i} className="exec-metric-card">
                <span
                  ref={(el) => {
                    metricRefs.current[i] = el;
                  }}
                  className="exec-metric-value"
                >
                  {metric.value}
                </span>
                <span className="exec-metric-label">{metric.label}</span>
                <span className="exec-metric-subtext">{metric.subtext}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive 3D Avatar Portrait */}
        <div className="exec-hero-right">
          <HeroAvatar />
        </div>
      </div>

      {/* Infinite Competency Ticker Marquee */}
      <TechMarquee />
    </section>
  );
};

