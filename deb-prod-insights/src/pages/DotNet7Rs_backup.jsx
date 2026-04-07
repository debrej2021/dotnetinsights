import PostLayout        from '../components/PostLayout.jsx';
import Section           from '../components/Section.jsx';
import HighlightBox      from '../components/HighlightBox.jsx';
import Card              from '../components/Card.jsx';
import Badge             from '../components/Badge.jsx';
import VideoSalesSection from '../components/VideoSalesSection.jsx';
import { useToggle }     from '../hooks/useToggle.js';
import { colors, transition, radius } from '../styles/theme.js';
import { Helmet} from 'react-helmet';

// ── Data ──────────────────────────────────────────────────────────────────────
const RS = [
  {
    number:  1,
    title:   'Rehost',
    icon:    '☁️',
    accent:  'blue',
    tag:     'Lift & Shift',
    body:    'Move the application to cloud infrastructure without any code changes. Fastest path, lowest risk — but you carry all existing tech debt with you.',
  },
  {
    number:  2,
    title:   'Replatform',
    icon:    '⚙️',
    accent:  'purple',
    tag:     'Modernise Runtime',
    body:    'Upgrade the runtime (.NET Framework → .NET 8), containerise with Docker, and deploy to managed services (AKS, ACA). Code changes are minimal.',
  },
  {
    number:  3,
    title:   'Refactor',
    icon:    '🔄',
    accent:  'green',
    tag:     'Re-architect',
    body:    'Break the monolith into microservices, adopt event-driven patterns (Kafka / Azure Service Bus), CQRS, and clean architecture. Highest ROI long-term.',
  },
  {
    number:  4,
    title:   'Repurchase',
    icon:    '🛒',
    accent:  'amber',
    tag:     'Buy vs. Build',
    body:    'Replace a custom-built system with a SaaS solution. Auth → Auth0/Entra ID. CRM → Salesforce. Only build what differentiates your business.',
  },
  {
    number:  5,
    title:   'Retire',
    icon:    '🗑️',
    accent:  'red',
    tag:     'Decommission',
    body:    'Identify and switch off systems that are no longer used or have been superseded. Every removed service reduces cost, attack surface, and complexity.',
  },
  {
    number:  6,
    title:   'Retain',
    icon:    '⏸️',
    accent:  'pink',
    tag:     'Keep for Now',
    body:    'Some systems are not yet ready to migrate — tightly coupled databases, compliance-frozen code, or simply not worth the effort. Revisit later.',
  },
  {
    number:  7,
    title:   'Relocate',
    icon:    '📦',
    accent:  'blue',
    tag:     'Move Infrastructure',
    body:    'Move the physical or virtual infrastructure to the cloud without changing the OS, runtime, or application code. Common with VMware-based migrations.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function DotNet7Rs() {
  const { state: showInsight, toggle } = useToggle(false);

  const btnStyle = {
    display:       'inline-flex',
    alignItems:    'center',
    gap:           '8px',
    background:    `${colors.blue}18`,
    border:        `1px solid ${colors.blue}44`,
    color:         colors.blue,
    padding:       '10px 22px',
    borderRadius:  radius.lg,
    fontSize:      '14px',
    fontWeight:    600,
    cursor:        'pointer',
    transition:    transition.fast,
    marginTop:     '8px',
  };

  const insightWrapStyle = {
    overflow:   'hidden',
    maxHeight:  showInsight ? '200px' : '0',
    opacity:    showInsight ? 1 : 0,
    transition: 'max-height 0.4s ease, opacity 0.3s ease',
  };

  return (
    <>
    <Helmet>
      <title>.NET Migration — The 7 Rs | Deb Insights</title>
      <meta
        name="description"
  content=".NET migration strategies explained using the 7 Rs — rehost, replatform, refactor and more. Practical cloud architecture and system design insights."

      />
      <link rel="canonical" href="https://insights.debprod.com/dotnet-7rs" />
    </Helmet>
    <PostLayout
      title=".NET Migration — The 7 Rs"
      subtitle="Are you modernizing… or just moving tech debt to the cloud? Understand which strategy fits your system before you write a single line of migration code."
      accent="blue"
      tag=".NET 8 & above Migration"
      readTime="6 min read"
    >

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {[
          { value: '7',    label: 'Strategies',    accent: 'blue'   },
          { value: '80%',  label: 'Teams rehost',  accent: 'amber'  },
          { value: '#1',   label: 'ROI: Refactor', accent: 'green'  },
        ].map(({ value, label, accent }) => (
          <div key={label} style={{
            flex: 1, minWidth: '120px',
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.lg,
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: colors[accent] ?? colors.blue }}>{value}</div>
            <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Video teaser CTA ───────────────────────────────────────────────── */}
      <div
        onClick={() =>
          document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '16px',
          background:     `${colors.blue}0d`,
          border:         `1px solid ${colors.blue}33`,
          borderRadius:   radius.lg,
          padding:        '14px 20px',
          marginBottom:   '40px',
          cursor:         'pointer',
          transition:     transition.fast,
          flexWrap:       'wrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background     = `${colors.blue}18`;
          e.currentTarget.style.borderColor    = `${colors.blue}66`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background     = `${colors.blue}0d`;
          e.currentTarget.style.borderColor    = `${colors.blue}33`;
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🎬</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>
              Get the 3-min quick-reference video
            </div>
            <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
              All 7 Rs · Decision framework · 1080p HD download
            </div>
          </div>
        </div>
        <div style={{
          display:      'inline-flex',
          alignItems:   'center',
          gap:          '6px',
          background:   colors.blue,
          color:        colors.bg,
          fontWeight:   700,
          fontSize:     '13px',
          padding:      '7px 16px',
          borderRadius: radius.md,
          whiteSpace:   'nowrap',
          flexShrink:   0,
        }}>
          $3 — See details ↓
        </div>
      </div>

      {/* Cards */}
      <Section title="🚀 The 7 Rs Explained" accent="blue">
        {RS.map(({ number, title, icon, accent, tag, body }) => (
          <Card
            key={number}
            number={number}
            title={title}
            icon={icon}
            accent={accent}
            tag={tag}
          >
            {body}
          </Card>
        ))}
      </Section>

      {/* Interactive insight */}
      <Section title="💡 The Reality Check" accent="amber">
        <p style={{ color: colors.textMuted, marginBottom: '16px', fontSize: '15px' }}>
          Teams often over-estimate where they are in the maturity curve.
          Hit the button to reveal the most common blind spot.
        </p>

        <button style={btnStyle} onClick={toggle}>
          {showInsight ? '▲ Hide insight' : '▼ Reveal insight'}
        </button>

        <div style={insightWrapStyle}>
          <HighlightBox
            accent="amber"
            icon="⚠️"
            label="Common Trap"
            text="Most teams think they are Refactoring — but are actually Rehosting with a Kubernetes label slapped on top. Cloud-native is not a deployment target. It's a design philosophy."
          />
        </div>
      </Section>

      {/* Badges summary */}
      <Section title="🏷️ Quick Reference" accent="green">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {RS.map(r => (
            <Badge key={r.number} label={`${r.number}. ${r.title}`} accent={r.accent} size="md" />
          ))}
        </div>
      </Section>

      {/* ── Video sales section ─────────────────────────────────────────────── */}
      <VideoSalesSection />

    </PostLayout>
    </>
  );
}
