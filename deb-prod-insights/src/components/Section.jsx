import { colors, accentMap, radius } from '../styles/theme.js';

/**
 * Section — page section with a styled heading and optional accent underline.
 *
 * Props:
 *   title    {string}   — section heading
 *   accent   {string}   — colour key for the heading underline
 *   children {ReactNode}
 */
export default function Section({ title, children, accent = 'blue' }) {
  const accentColor = accentMap[accent] ?? accentMap.blue;

  const sectionStyle = {
    marginBottom: '48px',
  };

  const headingWrapStyle = {
    display:      'flex',
    alignItems:   'center',
    gap:          '12px',
    marginBottom: '24px',
    paddingBottom: '14px',
    borderBottom: `1px solid ${colors.border}`,
    position:     'relative',
  };

  const headingStyle = {
    fontSize:   '22px',
    fontWeight: 700,
    color:      colors.text,
    margin:     0,
  };

  // short coloured bar under the heading text
  const underlineStyle = {
    position:   'absolute',
    bottom:     '-1px',
    left:       0,
    width:      '60px',
    height:     '2px',
    background: accentColor,
    borderRadius: radius.sm,
  };

  return (
    <div style={sectionStyle}>
      <div style={headingWrapStyle}>
        <h2 style={headingStyle}>{title}</h2>
        <div style={underlineStyle} />
      </div>
      <div>{children}</div>
    </div>
  );
}
