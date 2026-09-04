import React from 'react';
import { profileData } from '../../data/profile';

export const AboutApp: React.FC = () => {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: 'rgba(255, 255, 255, 0.03)',
          padding: 20,
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <img
          src="/profile.png"
          alt={profileData.name}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            border: '2px solid #38bdf8',
            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>
            {profileData.name}
          </h2>
          <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>
            {profileData.title}
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            @{profileData.handle} • {profileData.location}
          </span>
        </div>
      </div>

      {/* Bio / Pitch */}
      <div style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 }}>
        {profileData.technicalPitch}
      </div>

      {/* System Specifications / Architecture Tenets */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: 14,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            OS Kernel & Engine
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
            React 19 + TypeScript (WebOS)
          </span>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: 14,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Experience in Production
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
            Full-Stack Software Engineering
          </span>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: 14,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Status & Availability
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>
            {profileData.status}
          </span>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: 14,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Direct Contact
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8' }}>
            {profileData.contact.email}
          </span>
        </div>
      </div>
    </div>
  );
};
