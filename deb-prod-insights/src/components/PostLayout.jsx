import { colors, fonts, accentMap } from '../styles/theme.js';

/**
 * PostLayout — full-page wrapper with hero section + content column.
 *
 * Props:
 *   title       {string}     — large hero heading
 *   subtitle    {string}     — smaller hero subheading
 *   accent      {string}     — colour key used in the gradient title
 *   readTime    {string}     — e.g. "5 min read"
 *   tag         {string}     — e.g. ".NET 8"
 *   children    {ReactNode}  — page body
 */
export default function PostLayout({
  title,
  subtitle,
  accent = 'blue',
  readTime,
  tag,
  children,
}) {
  const accentColor  = accentMap[accent] ?? accentMap.blue;
  const accentColor2 = accentMap['purple'];

  const wrapperStyle = {
    minHeight:  '100vh',
    background: colors.bg,
  };

  const heroStyle = {
    background:     `radial-gradient(ellipse at top, ${accentColor}12 0%, transparent 65%)`,
    borderBottom:   `1px solid ${colors.border}`,
    padding:        '64px 24px 56px',
    textAlign:      'center',
  };

  const metaRowStyle = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '12px',
    marginBottom:   '24px',
  };

  const tagStyle = {
    fontSize:      '11px',
    fontWeight:    700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color:         accentColor,
    background:    `${accentColor}18`,
    border:        `1px solid ${accentColor}44`,
    padding:       '4px 12px',
    borderRadius:  '20px',
    fontFamily:    fonts.mono,
  };

  const readTimeStyle = {
    fontSize:   '13px',
    color:      colors.textFaint,
    fontFamily: fonts.mono,
  };

  const h1Style = {
    fontSize:       'clamp(28px, 5vw, 48px)',
    fontWeight:     800,
    lineHeight:     1.15,
    letterSpacing:  '-0.02em',
    marginBottom:   '16px',
    background:     `linear-gradient(135deg, ${accentColor}, ${accentColor2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor:  'transparent',
    backgroundClip:       'text',
  };

  const subtitleStyle = {
    fontSize:   'clamp(15px, 2vw, 18px)',
    color:      colors.textMuted,
    maxWidth:   '600px',
    margin:     '0 auto',
    lineHeight: 1.6,
  };

  const contentStyle = {
    maxWidth: '820px',
    margin:   '0 auto',
    padding:  '52px 24px 80px',
  };

  return (
    <div style={wrapperStyle}>
      {/* hero */}
      <header style={heroStyle}>
        <div style={metaRowStyle}>
          {tag      && <span style={tagStyle}>{tag}</span>}
          {readTime && <span style={readTimeStyle}>· {readTime}</span>}
        </div>
        <h1 style={h1Style}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </header>

      {/* body */}
      <main style={contentStyle}>
        {children}
      </main>
    </div>
  );
}
