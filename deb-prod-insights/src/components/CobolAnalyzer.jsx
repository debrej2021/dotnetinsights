/**
 * CobolAnalyzer — AI-powered COBOL → C# explainer
 * License validation via Lemon Squeezy API (server-side)
 *
 * ── UNLOCK FLOW ───────────────────────────────────────────────────────────────
 * 1. User purchases the $5 bundle on Lemon Squeezy
 * 2. Lemon Squeezy emails them a license key (e.g. ABC123-DEF456-GHI789)
 * 3. User enters it in the "Already purchased?" section below
 * 4. Frontend calls POST /api/validate-license → Lemon Squeezy API
 * 5. If valid, license key + instance ID stored in localStorage → unlocked
 *
 * ── ENV REQUIRED ON BACKEND (validate-license.js) ────────────────────────────
 *   ANTHROPIC_API_KEY   — for analyze-cobol.js
 *   (No extra LS key needed — LS license API is public per-key)
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react';
import { colors, transition, radius } from '../styles/theme.js';

const MAX_CHARS     = 1500;
const MAX_CALLS     = 10;
const LS_KEY        = 'cobol_analyzer_calls';
const LS_LICENSE    = 'cobol_license_key';
const LS_INSTANCE   = 'cobol_instance_id';
const BUNDLE_HREF   = 'https://debprod.lemonsqueezy.com/checkout/buy/45681852-18dd-48f4-93aa-21c1272c4cf0'; // ← replace with LS link
const AMBER         = '#C9842A';

// ── localStorage helpers ───────────────────────────────────────────────────────
function getCallsUsed() {
  try { return parseInt(localStorage.getItem(LS_KEY) ?? '0', 10); } catch { return 0; }
}
function incrementCalls() {
  try { localStorage.setItem(LS_KEY, String(getCallsUsed() + 1)); } catch { /* SSR */ }
}
function saveUnlock(key, instanceId) {
  try {
    localStorage.setItem(LS_LICENSE,  key);
    localStorage.setItem(LS_INSTANCE, instanceId ?? '');
  } catch { /* SSR */ }
}
function loadUnlock() {
  try {
    return {
      key:        localStorage.getItem(LS_LICENSE)  ?? '',
      instanceId: localStorage.getItem(LS_INSTANCE) ?? '',
    };
  } catch { return { key: '', instanceId: '' }; }
}
function clearUnlock() {
  try {
    localStorage.removeItem(LS_LICENSE);
    localStorage.removeItem(LS_INSTANCE);
    localStorage.removeItem(LS_KEY);
  } catch { /* SSR */ }
}

// ── main component ─────────────────────────────────────────────────────────────
export default function CobolAnalyzer() {
  const saved                     = loadUnlock();
  const [unlocked,  setUnlocked]  = useState(!!saved.key);
  const [code,      setCode]      = useState('');
  const [question,  setQuestion]  = useState('');
  const [result,    setResult]    = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [callsUsed, setCallsUsed] = useState(getCallsUsed);

  // license-key entry state
  const [showKeyInput,  setShowKeyInput]  = useState(false);
  const [licenseKey,    setLicenseKey]    = useState('');
  const [keyLoading,    setKeyLoading]    = useState(false);
  const [keyError,      setKeyError]      = useState('');

  const remaining = MAX_CALLS - callsUsed;

  // ── validate license key ─────────────────────────────────────────────────────
  async function validateKey() {
    const trimmed = licenseKey.trim().toUpperCase();
    if (!trimmed) return setKeyError('Please enter your license key.');

    setKeyError('');
    setKeyLoading(true);

    try {
      const res = await fetch('/api/validate-license', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ licenseKey: trimmed }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        saveUnlock(trimmed, data.instanceId ?? '');
        setUnlocked(true);
      } else {
        setKeyError(data.error ?? 'Invalid license key. Check your purchase email and try again.');
      }
    } catch {
      setKeyError('Could not reach validation server. Please try again.');
    }

    setKeyLoading(false);
  }

  // ── analyze ──────────────────────────────────────────────────────────────────
  async function analyze() {
    if (!code.trim())   return setError('Paste some COBOL code first.');
    if (remaining <= 0) return setError('You have used all 10 analyses. Purchase again to continue.');
    setError('');
    setResult('');
    setLoading(true);

    try {
      const res = await fetch('/api/analyze-cobol', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: code.slice(0, MAX_CHARS), question }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      setResult(data.explanation ?? 'No explanation returned.');
      incrementCalls();
      setCallsUsed(getCallsUsed());
    } catch (err) {
      setError(err.message ?? 'Analysis failed. Please try again.');
    }

    setLoading(false);
  }

  // ── LOCKED STATE ─────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div style={{
        background:   `${AMBER}0a`,
        border:       `1px solid ${AMBER}40`,
        borderRadius: radius.lg,
        padding:      '36px 28px',
        textAlign:    'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤖</div>
        <div style={{ fontSize: '18px', fontWeight: 800, color: colors.text, marginBottom: '8px' }}>
          COBOL Code Analyzer
        </div>
        <div style={{ fontSize: '14px', color: colors.textMuted, maxWidth: '420px', margin: '0 auto 20px' }}>
          Paste any COBOL snippet and get an instant plain-English explanation,
          key construct breakdown, and the direct C# .NET 8 equivalent — powered by Claude AI.
        </div>

        {/* Feature badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['10 analyses included', 'Max 1500 chars', 'Claude Haiku AI', 'Instant output'].map(f => (
            <span key={f} style={{
              fontSize: '12px', background: `${AMBER}18`,
              color: AMBER, border: `1px solid ${AMBER}35`,
              borderRadius: radius.md, padding: '4px 10px', fontWeight: 500,
            }}>{f}</span>
          ))}
        </div>

        {/* Buy CTA */}
        <a
          href={BUNDLE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        'inline-block',
            background:     AMBER,
            color:          '#fff',
            fontWeight:     700,
            fontSize:       '15px',
            padding:        '12px 32px',
            borderRadius:   radius.lg,
            textDecoration: 'none',
            marginBottom:   '20px',
          }}
        >
          Unlock Analyzer — $5
        </a>

        {/* License key entry */}
        <div>
          {!showKeyInput ? (
            <button
              onClick={() => setShowKeyInput(true)}
              style={{
                background: 'none', border: 'none',
                color: colors.textMuted, fontSize: '12.5px',
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Already purchased? Enter your license key
            </button>
          ) : (
            <div style={{
              marginTop:    '4px',
              background:   colors.bgCard,
              border:       `1px solid ${AMBER}30`,
              borderRadius: radius.md,
              padding:      '18px 20px',
              textAlign:    'left',
              maxWidth:     '440px',
              margin:       '4px auto 0',
            }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: colors.textMuted, marginBottom: '8px' }}>
                Enter the license key from your purchase email:
              </div>
              <input
                type="text"
                value={licenseKey}
                onChange={e => setLicenseKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validateKey()}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                style={{
                  width:        '100%',
                  boxSizing:    'border-box',
                  background:   '#0d1117',
                  border:       `1px solid ${keyError ? '#ef4444' : AMBER + '50'}`,
                  borderRadius: radius.md,
                  color:        '#d4b896',
                  fontFamily:   "'Fira Code', 'Consolas', monospace",
                  fontSize:     '13px',
                  padding:      '10px 12px',
                  outline:      'none',
                  marginBottom: '10px',
                  letterSpacing: '0.5px',
                }}
              />
              {keyError && (
                <div style={{
                  fontSize: '12px', color: '#f87171',
                  background: '#ef444415', border: '1px solid #ef444430',
                  borderRadius: radius.md, padding: '8px 12px',
                  marginBottom: '10px',
                }}>
                  {keyError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={validateKey}
                  disabled={keyLoading}
                  style={{
                    flex:         1,
                    background:   keyLoading ? '#374151' : AMBER,
                    color:        '#fff',
                    border:       'none',
                    borderRadius: radius.md,
                    padding:      '9px 0',
                    fontSize:     '13.5px',
                    fontWeight:   700,
                    cursor:       keyLoading ? 'not-allowed' : 'pointer',
                    transition:   transition.fast,
                  }}
                >
                  {keyLoading ? 'Validating…' : 'Activate'}
                </button>
                <button
                  onClick={() => { setShowKeyInput(false); setKeyError(''); setLicenseKey(''); }}
                  style={{
                    background:   'none',
                    border:       `1px solid ${colors.border ?? '#1f2937'}`,
                    borderRadius: radius.md,
                    color:        colors.textMuted,
                    padding:      '9px 16px',
                    fontSize:     '13px',
                    cursor:       'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── UNLOCKED STATE ────────────────────────────────────────────────────────────
  return (
    <div style={{
      background:   colors.bgCard,
      border:       `1px solid ${AMBER}40`,
      borderRadius: radius.lg,
      overflow:     'hidden',
    }}>
      {/* Header */}
      <div style={{
        background:     `${AMBER}18`,
        borderBottom:   `1px solid ${AMBER}30`,
        padding:        '14px 20px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🤖</span>
          <span style={{ fontWeight: 700, fontSize: '14px', color: colors.text }}>COBOL Code Analyzer</span>
          <span style={{
            fontSize: '11px', background: `${AMBER}25`,
            color: AMBER, border: `1px solid ${AMBER}40`,
            borderRadius: radius.sm, padding: '2px 8px', fontWeight: 600,
          }}>Claude AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '12px', color: remaining <= 2 ? '#ef4444' : AMBER, fontWeight: 600 }}>
            {remaining} / {MAX_CALLS} analyses remaining
          </span>
          <button
            onClick={() => { clearUnlock(); setUnlocked(false); setResult(''); setError(''); }}
            style={{
              background: 'none', border: 'none',
              color: colors.textFaint ?? '#475569',
              fontSize: '11px', cursor: 'pointer',
              textDecoration: 'underline',
            }}
            title="Remove license and lock analyzer"
          >
            sign out
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* COBOL input */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '6px', fontSize: '12px',
          }}>
            <span style={{ fontWeight: 600, color: AMBER }}>COBOL Code</span>
            <span style={{ color: code.length > MAX_CHARS * 0.9 ? '#ef4444' : colors.textMuted }}>
              {code.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value.slice(0, MAX_CHARS))}
            placeholder={`       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01  WS-COUNTER  PIC 9(4).\n       ...\n\nPaste your COBOL code here`}
            rows={10}
            style={{
              width:        '100%',
              boxSizing:    'border-box',
              background:   '#0d1117',
              border:       `1px solid ${AMBER}30`,
              borderRadius: radius.md,
              color:        '#d4b896',
              fontFamily:   "'Fira Code', 'Consolas', monospace",
              fontSize:     '12.5px',
              lineHeight:   1.65,
              padding:      '14px',
              resize:       'vertical',
              outline:      'none',
            }}
          />
        </div>

        {/* Optional question */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: colors.textMuted, fontWeight: 600, marginBottom: '6px' }}>
            Optional: What specifically do you want to understand?
          </div>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. What does the COMPUTE statement do? How does PERFORM VARYING work?"
            style={{
              width:        '100%',
              boxSizing:    'border-box',
              background:   colors.bgCard,
              border:       `1px solid ${colors.border ?? '#1f2937'}`,
              borderRadius: radius.md,
              color:        colors.text,
              fontSize:     '13px',
              padding:      '10px 14px',
              outline:      'none',
            }}
          />
        </div>

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={loading || !code.trim() || remaining <= 0}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '8px',
            background:   loading || remaining <= 0 ? '#374151' : AMBER,
            color:        '#fff',
            border:       'none',
            borderRadius: radius.lg,
            padding:      '10px 24px',
            fontSize:     '14px',
            fontWeight:   700,
            cursor:       loading || remaining <= 0 ? 'not-allowed' : 'pointer',
            transition:   transition.fast,
          }}
        >
          {loading ? '⟳ Analyzing…' : '▶ Analyze Code'}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '12px', padding: '10px 14px',
            background: '#ef444415', border: '1px solid #ef444430',
            borderRadius: radius.md, fontSize: '13px', color: '#f87171',
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            marginTop:    '20px',
            background:   '#0d1117',
            border:       `1px solid ${AMBER}30`,
            borderRadius: radius.lg,
            padding:      '20px',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, color: AMBER,
              textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px',
            }}>
              ✦ AI Explanation
            </div>
            <div style={{
              fontSize: '13.5px', color: '#cdd9e5', lineHeight: 1.75,
              whiteSpace: 'pre-wrap', fontFamily: 'Arial, sans-serif',
            }}>
              {result}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${colors.border ?? '#1f2937'}`,
        padding: '10px 20px',
        fontSize: '11px', color: colors.textMuted,
      }}>
        Powered by Claude Haiku · Max {MAX_CHARS} chars · Results are AI-generated — verify before use
      </div>
    </div>
  );
}
