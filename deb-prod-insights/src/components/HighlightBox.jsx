import { colors, radius, shadow, accentMap } from '../styles/theme.js';

/**
 * HighlightBox — pull-quote / callout panel.
 *
 * Props:
 *   text    {string|ReactNode}  — main content
 *   accent  {string}            — colour key: 'blue'|'green'|'amber'|'red'|'purple'|'pink'
 *   icon    {string}            — optional leading emoji
 *   label   {string}            — optional small uppercase label (e.g. "Pro Tip", "Warning")
 */
export default function HighlightBox({
  text,
  accent = 'blue',
  icon,
  label,
}) {
  const accentColor = accentMap[accent] ?? accentMap.blue;

  const wrapperStyle = {
    display:        'flex',
    gap:            '16px',
    background:     `${accentColor}0d`,
    border:         `1px solid ${accentColor}33`,
    borderLeft:     `4px solid ${accentColor}`,
    borderRadius:   radius.lg,
    padding:        '20px 22px',
    marginTop:      '24px',
    marginBottom:   '24px',
    boxShadow:      shadow.card,
  };

  const iconStyle = {
    fontSize:   '22px',
    lineHeight: 1,
    flexShrink: 0,
    marginTop:  '2px',
  };

  const labelStyle = {
    display:       'block',
    fontSize:      '10px',
    fontWeight:    700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color:         accentColor,
    marginBottom:  '6px',
  };

  const textStyle = {
    fontSize:   '15px',
    lineHeight: 1.7,
    color:      colors.text,
    margin:     0,
    fontStyle:  'italic',
  };

  return (
    <div style={wrapperStyle}>
      {icon && <span style={iconStyle}>{icon}</span>}
      <div>
        {label && <span style={labelStyle}>{label}</span>}
        <p style={textStyle}>{text}</p>
      </div>
    </div>
  );
}
