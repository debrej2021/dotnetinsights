import { accentMap, colors, radius, fonts } from '../styles/theme.js';

/**
 * Badge — small coloured pill label.
 *
 * Props:
 *   label  {string}  — text inside badge
 *   accent {string}  — colour key: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'pink'
 *   size   {string}  — 'sm' | 'md' (default 'sm')
 */
export default function Badge({ label, accent = 'blue', size = 'sm' }) {
  const color = accentMap[accent] ?? accentMap.blue;

  const style = {
    display:       'inline-block',
    padding:       size === 'sm' ? '3px 10px' : '5px 14px',
    borderRadius:  radius.xl,
    fontSize:      size === 'sm' ? '11px' : '13px',
    fontWeight:    700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily:    fonts.mono,
    color,
    background:    `${color}18`,
    border:        `1px solid ${color}44`,
  };

  return <span style={style}>{label}</span>;
}
