import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { profileData } from '../../data/profile';

export const HeroSection: React.FC = () => {
  return (
    <section className="exec-hero" id="overview">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="exec-status-badge"
      >
        <span className="exec-status-dot" />
        <span>{profileData.status}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="exec-hero-title"
      >
        Architecting <span className="exec-gradient-text">high-throughput systems</span> and product-focused web platforms.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="exec-hero-pitch"
      >
        {profileData.executivePitch}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="exec-hero-actions"
      >
        <a href="#case-studies" className="exec-btn exec-btn-primary">
          <span>Explore Case Studies</span>
          <ArrowRight size={16} />
        </a>

        <a
          href={profileData.contact.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="exec-btn exec-btn-secondary"
        >
          <Calendar size={16} color="#38bdf8" />
          <span>Schedule Introduction</span>
        </a>

        <a
          href={`mailto:${profileData.contact.email}`}
          className="exec-btn exec-btn-secondary"
        >
          <ShieldCheck size={16} color="#10b981" />
          <span>Get in Touch</span>
        </a>
      </motion.div>

      {/* Production Impact Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="exec-metrics-grid"
      >
        {profileData.metrics.map((metric, i) => (
          <div key={i} className="exec-metric-card">
            <span className="exec-metric-value">{metric.value}</span>
            <span className="exec-metric-label">{metric.label}</span>
            <span className="exec-metric-subtext">{metric.subtext}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
