import { useState, useCallback } from 'react';
import { colors, fonts, radius, transition } from '../styles/theme.js';

/**
 * CodeBlock — syntax-highlighted-look code panel with a copy button.
 *
 * Props:
 *   code     {string}   — the code string to display
 *   language {string}   — label shown top-right (e.g. "csharp", "bash")
 *   title    {string}   — optional filename / caption shown top-left
 */
export default function CodeBlock({ code, language = '', title = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const wrapperStyle = {
    borderRadius:  radius.lg,
    border:        `1px solid ${colors.border}`,
    overflow:      'hidden',
    marginBottom:  '20px',
    background:    colors.bgCode,
  };

  const headerStyle = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '10px 16px',
    background:     `${colors.bgCard}`,
    borderBottom:   `1px solid ${colors.border}`,
  };

  const dotsStyle = {
    display: 'flex',
    gap:     '6px',
  };

  const dot = (color) => ({
    width:        '10px',
    height:       '10px',
    borderRadius: '50%',
    background:   color,
  });

  const titleStyle = {
    fontSize:    '12px',
    color:       colors.textFaint,
    fontFamily:  fonts.mono,
    marginLeft:  '12px',
    flex:        1,
  };

  const langStyle = {
    fontSize:      '11px',
    fontWeight:    600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color:         colors.blue,
    fontFamily:    fonts.mono,
  };

  const copyBtnStyle = {
    background:    'transparent',
    border:        `1px solid ${copied ? colors.green + '88' : colors.border}`,
    borderRadius:  radius.sm,
    color:         copied ? colors.green : colors.textFaint,
    fontSize:      '11px',
    fontFamily:    fonts.mono,
    padding:       '3px 10px',
    cursor:        'pointer',
    transition:    transition.fast,
    marginLeft:    '12px',
  };

  const preStyle = {
    margin:      0,
    padding:     '20px',
    overflowX:   'auto',
    fontFamily:  fonts.mono,
    fontSize:    '14px',
    lineHeight:  1.7,
    color:       '#a5d6ff',         // VS Code-ish token colour for readability
    background:  'transparent',
    whiteSpace:  'pre',
  };

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div style={dotsStyle}>
          <span style={dot('#f87171')} />
          <span style={dot('#fbbf24')} />
          <span style={dot('#34d399')} />
        </div>
        {title && <span style={titleStyle}>{title}</span>}
        {language && <span style={langStyle}>{language}</span>}
        <button style={copyBtnStyle} onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre style={preStyle}>{code}</pre>
    </div>
  );
}
