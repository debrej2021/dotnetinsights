import { useState }      from 'react';
import PostLayout        from '../components/PostLayout.jsx';
import Section           from '../components/Section.jsx';
import HighlightBox      from '../components/HighlightBox.jsx';
import Card              from '../components/Card.jsx';
import Badge             from '../components/Badge.jsx';
import { colors, transition, radius } from '../styles/theme.js';
import { Helmet }        from 'react-helmet';

const JAVA_BG    = '#0f0800';
const JAVA_FG    = '#f0c080';
const JAVA_LABEL = '#f89820';
const CS_LABEL   = '#9b4dca';

// ── Replace with your actual payment links ──────────────────────────────────
//const PURCHASE_DOC_HREF  = 'https://your-payment-link.com/java-reference'; // $3
const PURCHASE_BOTH_HREF = 'https://your-payment-link.com/migration-bundle'; // $5

const PATTERNS = [
  {
    number: 1, title: 'Streams API → LINQ', icon: '🔗',
    accent: 'blue', tag: 'Collections',
    body: 'Java Streams and C# LINQ are conceptually identical — both are lazy, chainable, declarative pipelines. The operator names differ but map 1:1. LINQ also works natively with async EF Core queries.',
    javaSnippet:
`List<String> names = employees.stream()
    .filter(e ->
        e.getDepartment().equals("Engineering"))
    .sorted(Comparator
        .comparing(Employee::getSalary)
        .reversed())
    .limit(10)
    .map(Employee::getName)
    .collect(Collectors.toList());

// Parallel stream
long count = orders.parallelStream()
    .filter(o -> o.getTotal() > 1000)
    .count();`,
    csharpSnippet:
`// C# LINQ — same pipeline, different names
List<string> names = employees
    .Where(e  => e.Department == "Engineering")
    .OrderByDescending(e => e.Salary)
    .Take(10)
    .Select(e => e.Name)
    .ToList();

// Parallel LINQ (PLINQ)
long count = orders.AsParallel()
    .Where(o => o.Total > 1000)
    .LongCount();

// Async LINQ — EF Core
var names = await dbContext.Employees
    .Where(e  => e.Department == "Engineering")
    .OrderByDescending(e => e.Salary)
    .Take(10).Select(e => e.Name)
    .ToListAsync(ct);`,
    awsTools:   ['Amazon RDS (async query target)', 'AWS Lambda (LINQ in functions)', 'Amazon DynamoDB'],
    azureTools: ['Azure SQL / Cosmos DB (EF Core)', 'Azure Functions', 'Azure Synapse'],
  },
  {
    number: 2, title: 'Optional<T> → Nullable Reference Types', icon: '❓',
    accent: 'amber', tag: 'Null Safety',
    body: "Java's Optional<T> wraps a potentially-absent value. C# 8 nullable reference types (NRT) let the compiler track null-ability statically, eliminating the Optional wrapper entirely.",
    javaSnippet:
`Optional<User> user = userRepo.findById(id);

String email = user
    .map(User::getEmail)
    .filter(e -> !e.isBlank())
    .orElse("noreply@example.com");

// Chained Optional
String city = userRepo.findById(id)
    .flatMap(u -> addressRepo.findByUser(u))
    .map(Address::getCity)
    .orElseThrow(() ->
        new NotFoundException("Not found"));`,
    csharpSnippet:
`// Enable: <Nullable>enable</Nullable> in .csproj
// Compiler enforces null checks at build time

User? user = await userRepo.FindByIdAsync(id, ct);

string email = string.IsNullOrWhiteSpace(user?.Email)
    ? "noreply@example.com"
    : user.Email;

// Null-conditional chaining (flatMap equivalent)
string? city = user?.Address?.City;

// orElseThrow → guard clause
var address = await addressRepo.FindByUserAsync(id, ct)
    ?? throw new NotFoundException(
           $"User {id} not found");`,
    awsTools:   ['AWS Lambda (null-safe handlers)', 'Amazon API Gateway'],
    azureTools: ['Azure Functions (nullable bindings)', 'Azure APIM'],
  },
  {
    number: 3, title: 'CompletableFuture → Task / async-await', icon: '⚡',
    accent: 'green', tag: 'Async',
    body: "Java's CompletableFuture chains are verbose. C# async/await is a first-class language feature — the compiler rewrites sequential-looking code into a state machine, with full cancellation via CancellationToken.",
    javaSnippet:
`CompletableFuture<Order> future =
    CompletableFuture
        .supplyAsync(
            () -> orderRepo.findById(orderId))
        .thenApplyAsync(order -> {
            order.setStatus("PROCESSING");
            return orderRepo.save(order);
        })
        .exceptionally(ex -> {
            log.error("Failed", ex);
            return null;
        });

// allOf — parallel
CompletableFuture.allOf(
    fetchUser(userId),
    fetchInventory(productId)
).join();`,
    csharpSnippet:
`public async Task<Order?> ProcessOrderAsync(
    Guid orderId, CancellationToken ct)
{
    try
    {
        var order = await orderRepo
            .FindByIdAsync(orderId, ct);
        order.Status = OrderStatus.Processing;
        return await orderRepo.SaveAsync(order, ct);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex,
            "Order {Id} failed", orderId);
        return null;
    }
}

// Parallel (allOf) — WhenAll
var (user, stock) = await (
    userRepo.FindByIdAsync(userId, ct),
    inventoryRepo.GetStockAsync(productId, ct)
).WhenAll();`,
    awsTools:   ['AWS Lambda (async handlers)', 'Amazon SQS', 'AWS Step Functions'],
    azureTools: ['Azure Functions (async triggers)', 'Azure Service Bus', 'Azure Durable Functions'],
  },
  {
    number: 4, title: 'Spring Boot DI → ASP.NET Core DI', icon: '🌱',
    accent: 'green', tag: 'Dependency Injection',
    body: "Spring Boot uses annotation-based DI (@Autowired, @Service). ASP.NET Core uses a built-in IoC container with constructor injection — no annotations, dependencies are explicit and compiler-verified.",
    javaSnippet:
`@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private final OrderService orderService;

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @PathVariable UUID id) {
        return orderService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound()
                .build());
    }
}`,
    csharpSnippet:
`// Constructor injection — no annotations needed
[ApiController, Route("api/orders")]
public class OrderController(IOrderService svc)
    : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(
        Guid id, CancellationToken ct)
    {
        var order = await svc.FindByIdAsync(id, ct);
        return order is null ? NotFound() : Ok(order);
    }
}

// Program.cs — registration (@Service equivalent)
builder.Services.AddScoped<IOrderService,
    OrderService>();
builder.Services.AddScoped<IOrderRepository,
    EfOrderRepository>();`,
    awsTools:   ['AWS Lambda (.NET DI in function host)', 'Amazon ECS Fargate', 'AWS App Mesh'],
    azureTools: ['Azure Container Apps', 'AKS (Kubernetes)', 'Azure API Management'],
  },
  {
    number: 5, title: 'Java Records → C# Records', icon: '📦',
    accent: 'purple', tag: 'Immutable Data',
    body: "Java 16 Records and C# 9 Records both provide concise immutable data types. C# adds the with expression for non-destructive mutation — a feature Java Records lack.",
    javaSnippet:
`// Java 16+ Record
public record Point(double x, double y) {

    public Point {
        if (x < 0 || y < 0)
            throw new IllegalArgumentException(
                "Negative coordinates");
    }

    public double distanceTo(Point other) {
        return Math.sqrt(
            Math.pow(x - other.x, 2) +
            Math.pow(y - other.y, 2));
    }
}

var p = new Point(3.0, 4.0);
double d = p.distanceTo(new Point(0, 0));`,
    csharpSnippet:
`// C# 9+ positional record
public record Point(double X, double Y)
{
    public Point : this(X, Y)
    {
        if (X < 0 || Y < 0)
            throw new ArgumentOutOfRangeException(
                nameof(X), "Negative coordinates");
    }

    public double DistanceTo(Point other) =>
        Math.Sqrt(
            Math.Pow(X - other.X, 2) +
            Math.Pow(Y - other.Y, 2));
}

var p = new Point(3.0, 4.0);
double d = p.DistanceTo(new Point(0, 0)); // 5.0

// 'with' expression — Java has no equivalent
var p2 = p with { X = 6.0 };`,
    awsTools:   ['Amazon DynamoDB (record serialisation)', 'AWS Lambda (record as event payload)'],
    azureTools: ['Azure Cosmos DB (record documents)', 'Azure Functions (typed bindings)'],
  },
  {
    number: 6, title: 'Lombok → required / init properties', icon: '🔧',
    accent: 'amber', tag: 'Boilerplate Reduction',
    body: "Java developers use Lombok (@Data, @Builder, @NonNull) to eliminate boilerplate. C# records, init-only properties, and the required keyword provide identical compile-time guarantees without any annotation processor.",
    javaSnippet:
`@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @NonNull
    private String id;

    @NonNull
    private String email;

    private String displayName;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private List<String> roles = new ArrayList<>();
}`,
    csharpSnippet:
`// No library needed
// 'required' enforces Id & Email at compile time (C# 11)
public record UserProfile
{
    public required string         Id
        { get; init; }
    public required string         Email
        { get; init; }
    public string?                 DisplayName
        { get; init; }
    public bool                    Active
        { get; init; } = true;
    public IReadOnlyList<string>   Roles
        { get; init; } = [];
}

// Object initialiser — no .builder() needed
var user = new UserProfile
{
    Id    = "usr_123",
    Email = "dev@example.com",
    Roles = ["admin", "editor"],
};`,
    awsTools:   ['AWS CodeArtifact (NuGet / Maven hosting)', 'Amazon CodeGuru'],
    azureTools: ['Azure Artifacts (NuGet hosting)', 'Azure DevOps'],
  },
  {
    number: 7, title: 'JUnit 5 → xUnit + NSubstitute', icon: '🧪',
    accent: 'green', tag: 'Testing',
    body: "JUnit 5 with Mockito is the Java testing standard. The C# equivalent is xUnit + NSubstitute (mocking) + FluentAssertions. The Arrange/Act/Assert pattern and test lifecycle are nearly identical.",
    javaSnippet:
`@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository repo;
    @InjectMocks private OrderService svc;

    @Test
    @DisplayName("returns order when found")
    void returnsOrderWhenFound() {
        var order = new Order(
            UUID.randomUUID(), "PENDING");
        when(repo.findById(order.getId()))
            .thenReturn(Optional.of(order));

        var result = svc.findById(order.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getStatus())
            .isEqualTo("PENDING");
        verify(repo).findById(order.getId());
    }
}`,
    csharpSnippet:
`// NuGet: xunit  NSubstitute  FluentAssertions
public class OrderServiceTests
{
    private readonly IOrderRepository _repo =
        Substitute.For<IOrderRepository>();
    private readonly OrderService _svc;

    public OrderServiceTests() =>
        _svc = new OrderService(_repo);

    [Fact(DisplayName = "returns order when found")]
    public async Task ReturnsOrder_WhenFound()
    {
        var order = new Order(Guid.NewGuid(), "PENDING");
        _repo.FindByIdAsync(order.Id,
            Arg.Any<CancellationToken>())
             .Returns(order);

        var result = await _svc.FindByIdAsync(
            order.Id, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Status.Should().Be("PENDING");
    }
}`,
    awsTools:   ['AWS CodeBuild (CI test runner)', 'Amazon CodeGuru Reviewer'],
    azureTools: ['Azure DevOps Pipelines', 'Azure Test Plans', 'GitHub Actions'],
  },
  {
    number: 8, title: 'Generic Wildcards → C# Variance', icon: '🧬',
    accent: 'purple', tag: 'Generics',
    body: "Java uses bounded wildcards (? extends T, ? super T) to express variance at the call site. C# uses out (covariant) and in (contravariant) keywords at the interface declaration — verified by the compiler.",
    javaSnippet:
`// Java bounded wildcards
public static <T extends Comparable<T>>
    T max(List<? extends T> list) {

    return list.stream()
        .max(Comparator.naturalOrder())
        .orElseThrow(
            NoSuchElementException::new);
}

// Upper-bounded (covariance)
public void printAll(List<? extends Shape> s) {
    s.forEach(x -> System.out.println(x.area()));
}`,
    csharpSnippet:
`// C# constraints replace wildcards
public static T Max<T>(IEnumerable<T> source)
    where T : IComparable<T>
{
    return source.Max()
        ?? throw new InvalidOperationException(
               "Sequence is empty");
}

// IEnumerable<out T> is already covariant
public void PrintAll(IEnumerable<Shape> shapes)
{
    foreach (var s in shapes)
        Console.WriteLine(s.Area());
}

// Covariant interface — 'out' keyword
public interface IFactory<out T> { T Create(); }

// Contravariant interface — 'in' keyword
public interface IProcessor<in T>
{
    void Process(T item);
}`,
    awsTools:   ['AWS CodeArtifact (typed package feeds)', 'Amazon ECR'],
    azureTools: ['Azure Artifacts', 'Azure Container Registry'],
  },
];

function MigrationCard({ pattern }) {
  const [open, setOpen] = useState(false);
  const { number, title, icon, accent, tag, body,
          javaSnippet, csharpSnippet, awsTools, azureTools } = pattern;
  const accentColor = colors[accent] ?? colors.blue;

  return (
    <div style={{ marginBottom: '4px' }}>
      <Card number={number} title={title} icon={icon} accent={accent} tag={tag}>{body}</Card>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          width: '100%', background: `${accentColor}10`,
          border: `1px solid ${accentColor}30`, borderTop: 'none',
          color: accentColor, padding: '9px 0',
          borderRadius: `0 0 ${radius.lg} ${radius.lg}`,
          fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.02em',
          cursor: 'pointer', transition: transition.fast,
          marginBottom: open ? '0' : '20px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}1e`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${accentColor}10`; }}
      >
        <span style={{ fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
        {open ? 'Hide comparison & cloud tools' : 'Show Java → C# comparison & cloud tools'}
      </button>

      <div style={{ overflow: 'hidden', maxHeight: open ? '1400px' : '0', opacity: open ? 1 : 0, transition: 'max-height 0.5s ease, opacity 0.3s ease', marginBottom: open ? '20px' : '0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', border: `1px solid ${accentColor}30`, borderTop: 'none', borderRadius: `0 0 ${radius.lg} ${radius.lg}`, overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ flex: '1 1 300px', background: JAVA_BG, borderRight: `1px solid ${JAVA_LABEL}25`, padding: '18px 20px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: JAVA_LABEL, textTransform: 'uppercase', letterSpacing: '0.08em' }}>☕ Java</span>
              <div style={{ flex: 1, height: '1px', background: `${JAVA_LABEL}30` }} />
            </div>
            <pre style={{ margin: 0, overflow: 'auto', fontSize: '11.5px', lineHeight: 1.65, color: JAVA_FG, fontFamily: "'Fira Code','Consolas',monospace" }}><code>{javaSnippet}</code></pre>
          </div>
          <div style={{ flex: '1 1 300px', background: '#0d1117', padding: '18px 20px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: CS_LABEL, textTransform: 'uppercase', letterSpacing: '0.08em' }}>C# (.NET 8)</span>
              <div style={{ flex: 1, height: '1px', background: `${CS_LABEL}30` }} />
            </div>
            <pre style={{ margin: 0, overflow: 'auto', fontSize: '11.5px', lineHeight: 1.65, color: '#cdd9e5', fontFamily: "'Fira Code','Consolas',monospace" }}><code>{csharpSnippet}</code></pre>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px', background: '#ff990010', border: '1px solid #ff990030', borderRadius: radius.lg, padding: '16px 18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ff9900', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>☁ AWS Tools</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {awsTools.map(t => <span key={t} style={{ fontSize: '12px', background: '#ff99001a', color: '#ff9900', border: '1px solid #ff990035', borderRadius: radius.md, padding: '3px 10px', fontWeight: 500 }}>{t}</span>)}
            </div>
          </div>
          <div style={{ flex: '1 1 220px', background: '#0078d410', border: '1px solid #0078d430', borderRadius: radius.lg, padding: '16px 18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0078d4', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>⬡ Azure Tools</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {azureTools.map(t => <span key={t} style={{ fontSize: '12px', background: '#0078d41a', color: '#0078d4', border: '1px solid #0078d435', borderRadius: radius.md, padding: '3px 10px', fontWeight: 500 }}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JavaSalesSection() {
  return (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 240px', background: `${JAVA_LABEL}0a`, border: `1px solid ${JAVA_LABEL}35`, borderRadius: radius.lg, padding: '20px' }}>
        <div style={{ fontSize: '22px', marginBottom: '8px' }}>📄</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text, marginBottom: '6px' }}>Reference Guide</div>
        <div style={{ fontSize: '12.5px', color: colors.textMuted, marginBottom: '16px', lineHeight: 1.5 }}>
          All 8 patterns as a formatted Word doc — Java vs C# code comparisons, ecosystem table, AWS &amp; Azure tools, migration gotchas.
        </div>
        <a href="/downloads/java-to-csharp-reference.docx" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: JAVA_LABEL, color: '#fff', fontWeight: 700, fontSize: '14px', padding: '9px 22px', borderRadius: radius.md, textDecoration: 'none' }}>
          Get .docx — Free
        </a>
      </div>

      <div style={{ flex: '1 1 240px', background: `${CS_LABEL}0a`, border: `1px solid ${CS_LABEL}40`, borderRadius: radius.lg, padding: '20px' }}>
        <div style={{ fontSize: '22px', marginBottom: '8px' }}>📄 + 📄</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text, marginBottom: '6px' }}>Both Migration Guides</div>
        <div style={{ fontSize: '12.5px', color: colors.textMuted, marginBottom: '16px', lineHeight: 1.5 }}>
          Java → C# <strong>and</strong> COBOL → C# reference guides together, plus access to the COBOL AI Analyzer (10 credits).
        </div>
        <a href={PURCHASE_BOTH_HREF} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: CS_LABEL, color: '#fff', fontWeight: 700, fontSize: '14px', padding: '9px 22px', borderRadius: radius.md, textDecoration: 'none' }}>
          Get Bundle — $5
        </a>
      </div>
    </div>
  );
}

export default function JavaToCSharp() {
  const ecosystemRows = [
    ['Maven / Gradle',       'NuGet / dotnet CLI'],
    ['Spring Boot',          'ASP.NET Core'],
    ['JUnit 5 + Mockito',    'xUnit + NSubstitute + FluentAssertions'],
    ['Hibernate / JPA',      'EF Core / Dapper'],
    ['Lombok',               'Records + required + init'],
    ['Project Reactor',      'IAsyncEnumerable + Task / ValueTask'],
    ['SLF4J / Logback',      'Microsoft.Extensions.Logging'],
    ['Jackson',              'System.Text.Json'],
    ['Optional<T>',          'Nullable Reference Types (C# 8+)'],
    ['CompletableFuture<T>', 'Task<T> / ValueTask<T>'],
  ];

  return (
    <>
      <Helmet>
        <title>Java to C# Migration Guide | Deb Insights</title>
        <meta name="description" content="Practical Java to C# .NET 8 migration patterns with side-by-side code examples. Streams vs LINQ, Optional vs nullable, Spring Boot vs ASP.NET Core, and more." />
        <link rel="canonical" href="https://insights.debprod.com/java-to-csharp" />
      </Helmet>
      <PostLayout
        title="Java to C# Migration"
        subtitle="Java and C# share the same DNA — C-style syntax, OOP, JVM/CLR. But idioms diverge sharply. Here's how every major Java pattern maps to modern C# .NET 8."
        accent="amber" tag="Java → .NET 8 Migration" readTime="9 min read"
      >
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[
            { value: '8',    label: 'Migration patterns', accent: 'blue'  },
            { value: '~1:1', label: 'Concept mapping',    accent: 'green' },
            { value: '30%',  label: 'Less boilerplate',   accent: 'amber' },
          ].map(({ value, label, accent }) => (
            <div key={label} style={{ flex: 1, minWidth: '120px', background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: colors[accent] ?? colors.blue }}>{value}</div>
              <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        <Section title="🗺️ Ecosystem at a Glance" accent="amber">
          <HighlightBox accent="amber" icon="☕" label="Key Mindset Shifts"
            text="(1) async/await is first-class in C#, not a library. (2) C# properties replace getters/setters. (3) LINQ replaces the Streams API with a cleaner operator set. (4) Nullable reference types replace Optional<T>. (5) Records + 'with' expressions replace Lombok @Builder. (6) No annotation processors — everything is compiler-native." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '8px', marginTop: '14px' }}>
            {ecosystemRows.map(([java, cs]) => (
              <div key={java} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: '10px 14px' }}>
                <div style={{ fontSize: '11.5px', color: JAVA_LABEL, fontWeight: 600, marginBottom: '2px' }}>☕ {java}</div>
                <div style={{ fontSize: '11px', color: colors.textMuted }}>→ {cs}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="⚙️ Migration Patterns" accent="blue">
          {PATTERNS.map(p => <MigrationCard key={p.number} pattern={p} />)}
        </Section>

        <Section title="🏷️ Quick Reference" accent="green">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {PATTERNS.map(p => <Badge key={p.number} label={`${p.number}. ${p.title.split('→')[0].trim()}`} accent={p.accent} size="md" />)}
          </div>
        </Section>

        <Section title="📦 Get the Reference Guide" accent="amber">
          <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '18px' }}>
            Take these patterns offline. Download the formatted Word reference guide, or grab both migration guides plus the COBOL AI Analyzer as a bundle.
          </p>
          <JavaSalesSection />
        </Section>

        <Section title="⚠️ Migration Gotchas" accent="red">
          <HighlightBox accent="red" icon="🚨" label="Never Ignore These"
            text="1 — Java generics are erased at runtime; C# generics are reified — typeof(T) works at runtime. This affects serialisation and reflection-heavy code. 2 — Java checked exceptions don't exist in C# — all exceptions are unchecked; document them via XML comments. 3 — Java's equals() / hashCode() must be manually overridden; C# records generate them automatically. 4 — Thread.sleep() → await Task.Delay() — never block an async thread; it causes thread-pool starvation under load." />
        </Section>
      </PostLayout>
    </>
  );
}
