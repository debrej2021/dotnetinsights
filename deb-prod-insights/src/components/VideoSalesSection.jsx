import { useState } from 'react';
import Section from './Section.jsx';
import { colors, radius, shadow, transition } from '../styles/theme.js';

const CHECKOUT_URL =
  'https://debprod.lemonsqueezy.com/checkout/buy/19786116-1933-4439-a3ba-4daab6ab9f5c';

const INCLUDES = [
  'All 7 Rs with real .NET 8 examples',
  'Decision framework you apply to every service',
  '3-min HD video — download and keep forever',
  'Processed securely via Lemon Squeezy',
];

const META = [
  ['⏱', '3 min 22 sec'],
  ['📐', '1080p Full HD'],
  ['📦', 'MP4 · 5.3 MB'],
];

// ── Sub-components ────────────────────────────────────────────────────────────

function VideoPreviewCard() {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex:         '1 1 320px',
        background:   colors.bgCard,
        border:       `1px solid ${hover ? colors.borderHover : colors.border}`,
        borderRadius: radius.lg,
        overflow:     'hidden',
        transition:   transition.normal,
        boxShadow:    hover ? shadow.cardHover : shadow.card,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        aspectRatio: '16 / 9',
        background:  `linear-gradient(135deg, ${colors.bgCode ?? '#060b16'} 0%, ${colors.bgCard} 55%, ${colors.bgCode ?? '#060b16'} 100%)`,
        display:     'flex',
        alignItems:  'center',
        justifyContent: 'center',
        position:    'relative',
        overflow:    'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: `radial-gradient(ellipse at 50% 50%, ${colors.blue}12 0%, transparent 68%)`,
          pointerEvents: 'none',
        }} />

        {/* Grid lines overlay */}
        <div style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    `linear-gradient(${colors.border}28 1px, transparent 1px),
                               linear-gradient(90deg, ${colors.border}28 1px, transparent 1px)`,
          backgroundSize:     '60px 60px',
          pointerEvents:      'none',
        }} />

        {/* Content */}
        <div style={{ textAlign: 'center', zIndex: 1, padding: '24px' }}>
          <div style={{
            display:        'inline-block',
            border:         `1px solid ${colors.blue}55`,
            color:          colors.blue,
            borderRadius:   '999px',
            padding:        '3px 14px',
            fontSize:       '11px',
            fontWeight:     700,
            letterSpacing:  '1.8px',
            textTransform:  'uppercase',
            marginBottom:   '12px',
          }}>
            .NET 8 &amp; Above Migration
          </div>

          <div style={{
            fontSize:   '22px',
            fontWeight: 800,
            color:      colors.text,
            lineHeight: 1.2,
          }}>
            .NET Migration —{' '}
            <span style={{ color: colors.blue }}>The 7 Rs</span>
          </div>

          <div style={{
            fontSize:      '12px',
            color:         colors.textMuted,
            marginBottom:  '18px',
            marginTop:     '4px',
          }}>
            deb//insights · Architecture Series
          </div>

          {/* Play button */}
          <div style={{
            width:         '52px',
            height:        '52px',
            background:    colors.blue,
            borderRadius:  '50%',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            margin:        '0 auto',
            boxShadow:     shadow.glow(colors.blue),
            transition:    transition.fast,
            transform:     hover ? 'scale(1.12)' : 'scale(1)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.bg}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div style={{
        display:    'flex',
        gap:        '20px',
        padding:    '10px 16px',
        borderTop:  `1px solid ${colors.border}`,
        flexWrap:   'wrap',
      }}>
        {META.map(([icon, label]) => (
          <span key={label} style={{ fontSize: '12px', color: colors.textMuted }}>
            {icon} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PricingCard() {
  const [hover, setHover] = useState(false);

  return (
    <div style={{
      flex:           '1 1 280px',
      background:     colors.bgCard,
      border:         `1px solid ${colors.blue}44`,
      borderRadius:   radius.lg,
      padding:        '28px 28px 24px',
      boxShadow:      shadow.glow(colors.blue),
      display:        'flex',
      flexDirection:  'column',
    }}>
      {/* Price */}
      <div style={{
        fontSize:      '11px',
        color:         colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom:  '6px',
      }}>
        One-time purchase
      </div>

      <div style={{
        fontSize:      '56px',
        fontWeight:    800,
        color:         colors.text,
        lineHeight:    1,
        letterSpacing: '-2px',
        marginBottom:  '4px',
      }}>
        <sup style={{ fontSize: '22px', verticalAlign: 'super', letterSpacing: 0 }}>$</sup>
        3
      </div>

      <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '24px' }}>
        USD · Instant download · No subscription
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${colors.border}`, marginBottom: '20px' }} />

      {/* Includes list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '24px', flex: 1 }}>
        {INCLUDES.map(item => (
          <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: colors.green, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>
              ✓
            </span>
            <span style={{ fontSize: '13px', color: colors.textMuted, lineHeight: 1.55 }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display:        'block',
          textAlign:      'center',
          padding:        '13px',
          background:     colors.blue,
          color:          colors.bg,
          fontWeight:     800,
          fontSize:       '15px',
          borderRadius:   radius.md,
          textDecoration: 'none',
          transition:     transition.fast,
          transform:      hover ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow:      hover ? `0 8px 28px ${colors.blue}44` : 'none',
          letterSpacing:  '0.3px',
        }}
      >
        Get the video — $3
      </a>

      <p style={{
        textAlign:  'center',
        fontSize:   '12px',
        color:      colors.textFaint,
        marginTop:  '12px',
        marginBottom: 0,
      }}>
        🔒 Secure checkout · Delivered instantly to your email
      </p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function VideoSalesSection() {
  return (
    <div id="video-section">
      <Section title="🎬 Architecture Deep-Dive Video" accent="blue">
        <p style={{
          color:         colors.textMuted,
          marginBottom:  '24px',
          fontSize:      '15px',
          lineHeight:    1.7,
        }}>
          Everything above — distilled into a tight{' '}
          <span style={{ color: colors.blue, fontWeight: 600 }}>3-minute visual reference</span>.
          Every strategy, every trade-off, the decision framework.
          Download it and keep it for your next architecture review.
        </p>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <VideoPreviewCard />
          <PricingCard />
        </div>
      </Section>
    </div>
  );
}
