// ─── Central design tokens ───────────────────────────────────────────────────
// Import this anywhere you need consistent colours, spacing, or typography.

export const colors = {
  bg:           '#080d1a',
  bgCard:       '#0f1629',
  bgCardHover:  '#141e35',
  bgCode:       '#060b16',
  border:       '#1e2d4a',
  borderHover:  '#2d4470',

  // accent palette
  blue:   '#38bdf8',
  purple: '#818cf8',
  green:  '#34d399',
  amber:  '#fbbf24',
  red:    '#f87171',
  pink:   '#f472b6',

  // text
  text:       '#e2e8f0',
  textMuted:  '#94a3b8',
  textFaint:  '#475569',
};

export const fonts = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
};

export const radius = {
  sm:  '8px',
  md:  '12px',
  lg:  '16px',
  xl:  '24px',
};

export const shadow = {
  card:      '0 4px 24px rgba(0,0,0,0.5)',
  cardHover: '0 8px 40px rgba(56,189,248,0.12)',
  glow:      (color) => `0 0 20px ${color}33`,
};

export const transition = {
  fast:   'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow:   'all 0.4s ease',
};

// Map accent names → hex (used by Card, Badge, HighlightBox etc.)
export const accentMap = {
  blue:   colors.blue,
  purple: colors.purple,
  green:  colors.green,
  amber:  colors.amber,
  red:    colors.red,
  pink:   colors.pink,
};

export default { colors, fonts, radius, shadow, transition, accentMap };
