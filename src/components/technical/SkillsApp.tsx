import React from 'react';
import { skillCategoriesData } from '../../data/skills';

export const SkillsApp: React.FC = () => {
  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {skillCategoriesData.map((category) => (
          <div
            key={category.id}
            style={{
              background: 'rgba(18, 24, 38, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{category.title}</h3>
              <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{category.subtitle}</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {category.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    background: item.highlight ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: item.highlight ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: item.highlight ? '#38bdf8' : '#cbd5e1',
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ fontSize: 9.5, opacity: 0.6, textTransform: 'uppercase' }}>
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
