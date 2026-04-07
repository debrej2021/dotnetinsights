import { useHover } from '../hooks/useHover.js';
import { colors, fonts, transition } from '../styles/theme.js';
//import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'The 7 Rs',      path: '/dotnet-7rs'            },
  { label: 'Architecture',  path: '/migration-architecture' },
  { label: 'About',         path: '/about'                  },

];

function NavLink({ label, path }) {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();
  const active = window.location.pathname === path;

  const style = {
    color:          active ? colors.blue : hovered ? colors.text : colors.textMuted,
    fontSize:       '14px',
    fontWeight:     active ? 600 : 400,
    textDecoration: 'none',
    padding:        '6px 0',
    borderBottom:   `2px solid ${active ? colors.blue : 'transparent'}`,
    transition:     transition.fast,
  };

  return (
    <a
      href={path}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
    </a>
  );
}

export default function Navbar() {
  const barStyle = {
    position:    'sticky',
    top:         0,
    zIndex:      100,
    background:  `${colors.bg}ee`,
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${colors.border}`,
    padding:     '0 24px',
  };

  const innerStyle = {
    maxWidth:       '900px',
    margin:         '0 auto',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    height:         '56px',
  };

  const logoStyle = {
    fontSize:    '15px',
    fontWeight:  800,
    fontFamily:  fonts.mono,
    color:       colors.blue,
    textDecoration: 'none',
    letterSpacing: '-0.02em',
  };

  const navLinksStyle = {
    display: 'flex',
    gap:     '28px',
  };

  const chipStyle = {
    fontSize:      '10px',
    fontWeight:    700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color:         colors.green,
    background:    `${colors.green}15`,
    border:        `1px solid ${colors.green}33`,
    padding:       '3px 10px',
    borderRadius:  '20px',
  };

  return (
    <nav style={barStyle}>
      <div style={innerStyle}>
        <a href="/" style={logoStyle}>deb-insights</a>
        <div style={navLinksStyle}>
          {LINKS.map(l => <NavLink key={l.path} {...l} />)}
        </div>
        <span style={chipStyle}>.NET 8 +</span>
      </div>
    </nav>
  );
}
