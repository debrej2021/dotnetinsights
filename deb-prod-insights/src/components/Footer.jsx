import React from 'react';
import { colors } from '../styles/theme.js';

// ── Replace these with your actual hosted file URLs (S3, Supabase Storage, etc.) ──
const DOCS = [
  {
    label: 'COBOL → C# Reference Guide',
    href:  '/downloads/cobol-to-csharp-reference.docx',
    icon:  '📄',
    color: '#C9842A',
  },
  {
    label: 'Java → C# Reference Guide',
    href:  '/downloads/java-to-csharp-reference.docx',
    icon:  '📄',
    color: '#F89820',
  },
];

const Footer = () => (
  <footer
    style={{
      marginTop:   '60px',
      borderTop:   `1px solid ${colors.border ?? '#1f2937'}`,
      background:  colors.bgCard ?? '#0f172a',
    }}
  >
    {/* ── Resource strip ── */}
    <div
      style={{
        maxWidth:   '900px',
        margin:     '0 auto',
        padding:    '28px 20px 20px',
        display:    'flex',
        flexWrap:   'wrap',
        gap:        '28px',
        alignItems: 'flex-start',
      }}
    >
      {/* Brand column */}
      <div style={{ flex: '1 1 220px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text ?? '#f1f5f9', marginBottom: '6px' }}>
          Deb Insights
        </div>
        <div style={{ fontSize: '12.5px', color: colors.textMuted ?? '#94a3b8', lineHeight: 1.6 }}>
          Practical .NET migration,<br />cloud architecture &amp; system design.
        </div>
      </div>

      {/* Reference guides column */}
      <div style={{ flex: '1 1 220px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textMuted ?? '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
          Free Reference Guides
        </div>
        {DOCS.map(({ label, href, icon, color }) => (
          <a
            key={label}
            href={href}
            download
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '8px',
              color:          color,
              textDecoration: 'none',
              fontSize:       '13px',
              fontWeight:     500,
              marginBottom:   '8px',
              transition:     'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <span>{icon}</span>
            {label}
            <span style={{ fontSize: '10px', opacity: 0.7 }}>↓ .docx</span>
          </a>
        ))}
      </div>

      {/* Migration guides column */}
      <div style={{ flex: '1 1 180px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textMuted ?? '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
          Migration Guides
        </div>
        {[
          { label: '.NET 7 Rs',    href: '/dotnet-7rs'         },
          { label: 'COBOL → C#',  href: '/cobol-to-csharp'    },
          { label: 'Java → C#',   href: '/java-to-csharp'     },
          { label: 'Architecture', href: '/migration-architecture' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              display:        'block',
              color:          colors.textMuted ?? '#94a3b8',
              textDecoration: 'none',
              fontSize:       '13px',
              marginBottom:   '6px',
              transition:     'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = colors.blue ?? '#3b82f6'; }}
            onMouseLeave={e => { e.currentTarget.style.color = colors.textMuted ?? '#94a3b8'; }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Connect column */}
      <div style={{ flex: '1 1 160px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textMuted ?? '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
          Connect
        </div>
        <a
          href="https://www.linkedin.com/in/debashis-mohapatra-it/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', color: '#0A66C2', textDecoration: 'none', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}
        >
          LinkedIn
        </a>
        <a
          href="https://x.com/Debsu15"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', color: '#1DA1F2', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}
        >
          Twitter (X)
        </a>
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div
      style={{
        borderTop:  `1px solid ${colors.border ?? '#1f2937'}`,
        padding:    '14px 20px',
        textAlign:  'center',
        fontSize:   '12px',
        color:      colors.textMuted ?? '#64748b',
      }}
    >
      © {new Date().getFullYear()} Deb Insights — Engineering Systems &amp; Architecture
    </div>
  </footer>
);

export default Footer;
