import PostLayout   from '../components/PostLayout.jsx';
import Section      from '../components/Section.jsx';
import HighlightBox from '../components/HighlightBox.jsx';
import Card         from '../components/Card.jsx';
import CodeBlock    from '../components/CodeBlock.jsx';
import { useToggle } from '../hooks/useToggle.js';
import { colors, radius, shadow, transition } from '../styles/theme.js';
import architectureVideo from '../assets/architecture.mp4';

// ── Data ──────────────────────────────────────────────────────────────────────
const DECISIONS = [
  {
    title:  'Hybrid API Style',
    icon:   '⚙️',
    accent: 'blue',
    tag:    'ASP.NET Core',
    body:   'Minimal APIs for lightweight, high-throughput endpoints. Controller-based APIs for domain-heavy services with versioning. gRPC for internal service-to-service. SignalR for real-time push.',
  },
  {
    title:  'Event-Driven Messaging',
    icon:   '📨',
    accent: 'amber',
    tag:    'Kafka / Azure SB',
    body:   'Async communication via Kafka or Azure Service Bus decouples services and enables retry, dead-lettering, and fan-out without tight coupling.',
  },
  {
    title:  'Outbox Pattern',
    icon:   '📬',
    accent: 'purple',
    tag:    'Reliability',
    body:   'Guarantee at-least-once message delivery by writing events to a local outbox table in the same DB transaction as domain state — then relaying asynchronously.',
  },
  {
    title:  'Redis Caching Layer',
    icon:   '⚡',
    accent: 'red',
    tag:    'Performance',
    body:   'Distributed cache for hot read paths, session state, and rate limiting counters. TTL policies prevent stale data. Pub/Sub for cache invalidation.',
  },
  {
    title:  'OpenTelemetry',
    icon:   '🔭',
    accent: 'green',
    tag:    'Observability',
    body:   'Vendor-agnostic instrumentation across all services. Traces, metrics, and logs shipped to Azure Monitor or Grafana stack. W3C TraceContext propagated end-to-end.',
  },
];

const OUTBOX_CODE = `// 1. Write domain event to outbox in same transaction
await using var tx = await db.BeginTransactionAsync();

db.Orders.Add(order);
db.OutboxMessages.Add(new OutboxMessage {
  Id:        Guid.NewGuid(),
  Type:      nameof(OrderCreatedEvent),
  Payload:   JsonSerializer.Serialize(new OrderCreatedEvent(order.Id)),
  CreatedAt: DateTime.UtcNow,
});

await db.SaveChangesAsync();
await tx.CommitAsync();

// 2. Background worker polls outbox and publishes
// -- No event lost even if the broker is temporarily down`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function MigrationArchitecture() {
  const { state: videoExpanded, toggle: toggleVideo } = useToggle(false);

  const videoContainerStyle = {
    borderRadius: radius.lg,
    border:       `1px solid ${colors.border}`,
    overflow:     'hidden',
    background:   colors.bgCode,
    boxShadow:    shadow.card,
    marginTop:    '16px',
    transition:   transition.normal,
  };

  const videoStyle = {
    width:   '100%',
    display: 'block',
  };

  const expandBtnStyle = {
    display:       'inline-flex',
    alignItems:    'center',
    gap:           '8px',
    background:    `${colors.purple}18`,
    border:        `1px solid ${colors.purple}44`,
    color:         colors.purple,
    padding:       '8px 18px',
    borderRadius:  radius.lg,
    fontSize:      '13px',
    fontWeight:    600,
    cursor:        'pointer',
    transition:    transition.fast,
    marginBottom:  '12px',
  };

  return (
    <PostLayout
      title=".NET 8 Migration Architecture"
      subtitle="From monolith to cloud-native — the engineering decisions that actually matter in production."
      accent="purple"
      tag=".NET 8 · Cloud Native"
      readTime="8 min read"
    >

      {/* Video section */}
      <Section title="📺 Architecture Walkthrough" accent="purple">
        <p style={{ color: colors.textMuted, fontSize: '15px', marginBottom: '16px' }}>
          This animation shows data flowing from client through the API gateway,
          microservices, message bus, background workers, and into the managed database —
          with observability baked in at every layer.
        </p>

        <button style={expandBtnStyle} onClick={toggleVideo}>
          {videoExpanded ? '▲ Collapse video' : '▶ Play architecture walkthrough'}
        </button>

        <div style={{
          ...videoContainerStyle,
          maxHeight: videoExpanded ? '600px' : '0',
          opacity:   videoExpanded ? 1 : 0,
          overflow:  'hidden',
          transition: 'max-height 0.5s ease, opacity 0.3s ease',
        }}>
          <video style={videoStyle} controls autoPlay={videoExpanded} loop muted>
            <source src={architectureVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Section>

      {/* Key decisions */}
      <Section title="⚙️ Key Engineering Decisions" accent="blue">
        {DECISIONS.map(({ title, icon, accent, tag, body }) => (
          <Card key={title} title={title} icon={icon} accent={accent} tag={tag}>
            {body}
          </Card>
        ))}
      </Section>

      {/* Code example */}
      <Section title="📋 Pattern in Practice" accent="green">
        <p style={{ color: colors.textMuted, fontSize: '15px', marginBottom: '20px' }}>
          The Outbox Pattern in .NET 8 — guaranteeing no event is lost even during transient failures:
        </p>
        <CodeBlock
          code={OUTBOX_CODE}
          language="csharp"
          title="OrderService.cs — Outbox Pattern"
        />
      </Section>

      {/* Closing insight */}
      <HighlightBox
        accent="green"
        icon="💡"
        label="Engineering Principle"
        text="The goal is not microservices — it's resilience and scalability. Microservices are a means to an end. Start with a modular monolith, extract services where boundaries are proven, and automate everything else."
      />

    </PostLayout>
  );
}
