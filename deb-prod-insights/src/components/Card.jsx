import { useHover } from '../hooks/useHover.js';
import { colors, radius, shadow, transition, accentMap } from '../styles/theme.js';

/**
 * Card — versatile content card with optional accent, number badge, and hover glow.
 *
 * Props:
 *   title    {string}          — card heading
 *   children {ReactNode}       — body content
 *   accent   {string}          — colour key: 'blue'|'purple'|'green'|'amber'|'red'|'pink'
 *   number   {number|string}   — optional step number shown in top-left circle
 *   icon     {string}          — optional emoji icon next to title
 *   tag      {string}          — optional small tag below title (e.g. "Recommended")
 */
export default function Card({
  title,
  children,
  accent = 'blue',
  number,
  icon,
  tag,
}) {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();
  const accentColor = accentMap[accent] ?? accentMap.blue;

  const cardStyle = {
    position:       'relative',
    background:     hovered ? colors.bgCardHover : colors.bgCard,
    border:         `1px solid ${hovered ? accentColor + '55' : colors.border}`,
    borderRadius:   radius.lg,
    padding:        '24px 24px 20px',
    marginBottom:   '16px',
    boxShadow:      hovered ? shadow.cardHover : shadow.card,
    transition:     transition.normal,
    cursor:         'default',
    overflow:       'hidden',
  };

  const accentBarStyle = {
    position:   'absolute',
    top:        0,
    left:       0,
    width:      '4px',
    height:     '100%',
    background: `linear-gradient(180deg, ${accentColor}, ${accentColor}44)`,
    borderRadius: `${radius.lg} 0 0 ${radius.lg}`,
    opacity:    hovered ? 1 : 0.5,
    transition: transition.normal,
  };

  const numberStyle = {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    width:          '32px',
    height:         '32px',
    borderRadius:   '50%',
    background:     `${accentColor}22`,
    border:         `1px solid ${accentColor}55`,
    color:          accentColor,
    fontWeight:     800,
    fontSize:       '14px',
    marginRight:    '12px',
    flexShrink:     0,
    fontFamily:     'inherit',
  };

  const titleRowStyle = {
    display:    'flex',
    alignItems: 'center',
    marginBottom: tag ? '6px' : '10px',
  };

  const titleStyle = {
    fontSize:   '17px',
    fontWeight: 700,
    color:      hovered ? colors.text : colors.text,
    margin:     0,
  };

  const tagStyle = {
    display:        'inline-block',
    fontSize:       '10px',
    fontWeight:     700,
    letterSpacing:  '0.08em',
    textTransform:  'uppercase',
    color:          accentColor,
    background:     `${accentColor}15`,
    padding:        '2px 8px',
    borderRadius:   radius.sm,
    marginBottom:   '10px',
  };

  const bodyStyle = {
    color:      colors.textMuted,
    fontSize:   '15px',
    lineHeight: 1.65,
    margin:     0,
  };

  return (
    <div style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div style={accentBarStyle} />

      <div style={titleRowStyle}>
        {number !== undefined && (
          <span style={numberStyle}>{number}</span>
        )}
        <h3 style={titleStyle}>
          {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
          {title}
        </h3>
      </div>

      {tag && <div style={tagStyle}>{tag}</div>}

      <div style={bodyStyle}>{children}</div>
    </div>
  );
}
