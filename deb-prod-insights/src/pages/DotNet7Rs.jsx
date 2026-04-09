import { useState }      from 'react';
import PostLayout        from '../components/PostLayout.jsx';
import Section           from '../components/Section.jsx';
import HighlightBox      from '../components/HighlightBox.jsx';
import Card              from '../components/Card.jsx';
import Badge             from '../components/Badge.jsx';
import VideoSalesSection from '../components/VideoSalesSection.jsx';
import { useToggle }     from '../hooks/useToggle.js';
import { colors, transition, radius } from '../styles/theme.js';
import { Helmet }        from 'react-helmet';

// ── Data ──────────────────────────────────────────────────────────────────────
const RS = [
  {
    number:  1,
    title:   'Rehost',
    icon:    '☁️',
    accent:  'blue',
    tag:     'Lift & Shift',
    body:    'Move the application to cloud infrastructure without any code changes. Fastest path, lowest risk — but you carry all existing tech debt with you.',
    codeSnippet:
`// No app-code changes needed — containerise your existing .NET Framework app
// Dockerfile for Windows Containers (IIS-hosted .NET Framework 4.8)

FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2022
WORKDIR /inetpub/wwwroot
COPY ./publish .

// ── Deploy to AWS Elastic Beanstalk ────────────────────────────────────────
// aws elasticbeanstalk create-environment \\
//   --application-name MyLegacyApp \\
//   --environment-name prod \\
//   --solution-stack "64bit Windows Server 2022 v2.x running IIS 10.0"

// ── Deploy to Azure App Service ────────────────────────────────────────────
// az webapp up \\
//   --runtime "ASPNET:4.8" \\
//   --name my-legacy-app \\
//   --resource-group rg-prod

// Tip: Use AWS MGN or Azure Migrate to automate VM-level replication
// before switching DNS — zero downtime, same codebase.`,
    awsComponents: [
      'AWS MGN (Application Migration Service)',
      'EC2 (Windows Server)',
      'Elastic Beanstalk',
      'Elastic Load Balancer',
      'RDS for SQL Server',
    ],
    azureComponents: [
      'Azure Migrate',
      'Azure VMs (Windows)',
      'Azure App Service',
      'Azure Load Balancer',
      'Azure SQL (same engine)',
    ],
  },
  {
    number:  2,
    title:   'Replatform',
    icon:    '⚙️',
    accent:  'purple',
    tag:     'Modernise Runtime',
    body:    'Upgrade the runtime (.NET Framework → .NET 8), containerise with Docker, and deploy to managed services (AKS, ACA). Code changes are minimal.',
    codeSnippet:
`// Program.cs — Migrated from .NET Framework to .NET 8 minimal hosting model
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHealthChecks();              // Kubernetes readiness / liveness probes
builder.Services.AddOpenTelemetry()              // Structured observability
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());

var app = builder.Build();
app.UseHttpsRedirection();
app.MapHealthChecks("/healthz");
app.MapControllers();
app.Run();

// ── Multi-stage Dockerfile ─────────────────────────────────────────────────
// FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
// WORKDIR /src
// COPY ["MyApp.csproj", "."]
// RUN dotnet restore
// COPY . .
// RUN dotnet publish -c Release -o /app/publish
//
// FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
// WORKDIR /app
// COPY --from=build /app/publish .
// ENTRYPOINT ["dotnet", "MyApp.dll"]

// Push to registry
// docker build -t myapp:latest .
// docker tag  myapp:latest  myregistry.azurecr.io/myapp:latest
// docker push myregistry.azurecr.io/myapp:latest`,
    awsComponents: [
      'ECR (Container Registry)',
      'ECS Fargate',
      'RDS Managed',
      'ElastiCache',
      'CloudWatch + X-Ray',
      'ALB',
    ],
    azureComponents: [
      'Azure Container Registry',
      'AKS / Azure Container Apps',
      'Azure SQL Managed Instance',
      'Azure Cache for Redis',
      'Azure Monitor + App Insights',
      'Application Gateway',
    ],
  },
  {
    number:  3,
    title:   'Refactor',
    icon:    '🔄',
    accent:  'green',
    tag:     'Re-architect',
    body:    'Break the monolith into microservices, adopt event-driven patterns (Kafka / Azure Service Bus), CQRS, and clean architecture. Highest ROI long-term.',
    codeSnippet:
`// CQRS + MediatR + MassTransit — Clean Architecture (.NET 8)
// NuGet: MediatR  FluentValidation  MassTransit.RabbitMQ (or .AmazonSQS / .Azure)

// ── Command ────────────────────────────────────────────────────────────────
public record CreateOrderCommand(Guid CustomerId, List<OrderItem> Items)
    : IRequest<Result<Guid>>;

// ── Validator ──────────────────────────────────────────────────────────────
public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Items).NotEmpty()
            .WithMessage("Order must have at least one item");
    }
}

// ── Handler ────────────────────────────────────────────────────────────────
public class CreateOrderHandler(IOrderRepository repo, IPublishEndpoint bus)
    : IRequestHandler<CreateOrderCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(
        CreateOrderCommand cmd, CancellationToken ct)
    {
        var order = Order.Create(cmd.CustomerId, cmd.Items);  // Domain aggregate
        await repo.SaveAsync(order, ct);
        await bus.Publish(new OrderCreatedEvent(order.Id), ct); // → Kafka / Service Bus
        return Result.Ok(order.Id);
    }
}

// ── Registration ───────────────────────────────────────────────────────────
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssemblyContaining<Program>()
       .AddOpenBehavior(typeof(ValidationBehavior<,>)));

builder.Services.AddMassTransit(x =>
{
    x.UsingAmazonSqs((ctx, cfg) =>   // swap for .UsingAzureServiceBus(...)
    {
        cfg.Host("us-east-1");
        cfg.ConfigureEndpoints(ctx);
    });
});`,
    awsComponents: [
      'Lambda',
      'API Gateway',
      'SQS / SNS',
      'MSK (Kafka)',
      'DynamoDB',
      'EventBridge',
      'Step Functions',
    ],
    azureComponents: [
      'Azure Functions',
      'APIM',
      'Service Bus',
      'Event Hub (Kafka-compatible)',
      'Cosmos DB',
      'Event Grid',
      'Durable Functions',
    ],
  },
  {
    number:  4,
    title:   'Repurchase',
    icon:    '🛒',
    accent:  'amber',
    tag:     'Buy vs. Build',
    body:    'Replace a custom-built system with a SaaS solution. Auth → Auth0/Entra ID. CRM → Salesforce. Only build what differentiates your business.',
    codeSnippet:
`// Replace custom auth with Azure Entra ID — Microsoft.Identity.Web (NuGet)

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("RequireAdmin",  p => p.RequireRole("Admin"));
    opt.AddPolicy("RequireEditor", p => p.RequireRole("Editor", "Admin"));
});

// appsettings.json
// {
//   "AzureAd": {
//     "Instance": "https://login.microsoftonline.com/",
//     "TenantId": "your-tenant-id",
//     "ClientId": "your-api-client-id",
//     "Audience": "api://your-api-client-id"
//   }
// }

// ── AWS Cognito alternative ────────────────────────────────────────────────
// NuGet: (standard JWT Bearer — Cognito issues standard JWTs)
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        var region   = builder.Configuration["Cognito:Region"];
        var poolId   = builder.Configuration["Cognito:UserPoolId"];
        o.Authority  = $"https://cognito-idp.{region}.amazonaws.com/{poolId}";
        o.TokenValidationParameters = new() { ValidateAudience = false };
    });`,
    awsComponents: [
      'Amazon Cognito',
      'AWS IAM Identity Center (SSO)',
      'Amazon Connect (contact centre)',
      'AWS Marketplace SaaS',
    ],
    azureComponents: [
      'Entra ID / Azure AD B2C',
      'Dynamics 365 (CRM)',
      'Power Platform',
      'Azure Marketplace SaaS',
    ],
  },
  {
    number:  5,
    title:   'Retire',
    icon:    '🗑️',
    accent:  'red',
    tag:     'Decommission',
    body:    'Identify and switch off systems that are no longer used or have been superseded. Every removed service reduces cost, attack surface, and complexity.',
    codeSnippet:
`// Graceful retirement with Feature Flags — Microsoft.FeatureManagement
// NuGet: Microsoft.FeatureManagement.AspNetCore

builder.Services.AddFeatureManagement();

[ApiController, Route("api/[controller]")]
public class LegacyReportController(IFeatureManager features) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        if (!await features.IsEnabledAsync("LegacyReports"))
            return StatusCode(410, new ProblemDetails
            {
                Status = 410,
                Title  = "Endpoint Retired",
                Detail = "This API has been decommissioned. Use /api/analytics/v2 instead.",
                Instance = HttpContext.Request.Path,
            });

        return Ok(await GenerateReportAsync());
    }

    private Task<object> GenerateReportAsync() => Task.FromResult<object>(new { });
}

// appsettings.json — flip flag to false when traffic reaches zero
// {
//   "FeatureManagement": {
//     "LegacyReports": false
//   }
// }

// Validate zero traffic before removing:
// aws cloudwatch get-metric-statistics \\
//   --namespace AWS/ApplicationELB --metric-name RequestCount \\
//   --dimensions Name=TargetGroup,Value=tg/legacy-api/xxx ...`,
    awsComponents: [
      'AWS Config (drift detection)',
      'Cost Explorer',
      'AWS Trusted Advisor',
      'CloudWatch Alarms',
      'AWS Resource Explorer',
    ],
    azureComponents: [
      'Azure Policy',
      'Azure Cost Management',
      'Azure Advisor',
      'Application Insights (usage)',
      'Azure Resource Graph',
    ],
  },
  {
    number:  6,
    title:   'Retain',
    icon:    '⏸️',
    accent:  'pink',
    tag:     'Keep for Now',
    body:    'Some systems are not yet ready to migrate — tightly coupled databases, compliance-frozen code, or simply not worth the effort. Revisit later.',
    codeSnippet:
`// Strangler Fig Pattern with YARP Reverse Proxy
// Route NEW endpoints to the new microservice; fall back to legacy for the rest.
// NuGet: Yarp.ReverseProxy

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

app.MapReverseProxy();

// appsettings.json
// {
//   "ReverseProxy": {
//     "Routes": {
//       "new-orders": {
//         "ClusterId": "orders-svc",
//         "Match": { "Path": "/api/orders/{**rest}" }
//       },
//       "legacy-catch-all": {
//         "ClusterId": "legacy",
//         "Match": { "Path": "/{**catch-all}" }
//       }
//     },
//     "Clusters": {
//       "orders-svc": {
//         "Destinations": { "d1": { "Address": "https://orders.internal/" } }
//       },
//       "legacy": {
//         "Destinations": { "d1": { "Address": "https://legacy-app.internal/" } }
//       }
//     }
//   }
// }

// Gradually move routes from legacy-catch-all → dedicated clusters
// Monitor p99 latency in Application Insights / CloudWatch before each cutover.`,
    awsComponents: [
      'AWS Direct Connect / Site-to-Site VPN',
      'AWS Transit Gateway',
      'Route 53 (weighted routing)',
      'AWS Outposts (on-prem extension)',
    ],
    azureComponents: [
      'Azure ExpressRoute',
      'Azure Arc (manage on-prem VMs)',
      'Azure VPN Gateway',
      'Azure Traffic Manager',
    ],
  },
  {
    number:  7,
    title:   'Relocate',
    icon:    '📦',
    accent:  'blue',
    tag:     'Move Infrastructure',
    body:    'Move the physical or virtual infrastructure to the cloud without changing the OS, runtime, or application code. Common with VMware-based migrations.',
    codeSnippet:
`// Zero application code changes — pure Infrastructure as Code

// ── Azure Bicep — Provision Azure VMware Solution (AVS) ────────────────────
// resource privateCloud 'Microsoft.AVS/privateClouds@2023-03-01' = {
//   name:     'avs-prod'
//   location: resourceGroup().location
//   sku:      { name: 'AV36P' }
//   properties: {
//     networkBlock:      '192.168.48.0/22'
//     managementCluster: { clusterSize: 3 }
//   }
// }
//
// Deploy: az deployment group create \\
//           --resource-group rg-vmware \\
//           --template-file avs.bicep

// ── Terraform — VMware Cloud on AWS ───────────────────────────────────────
// resource "aws_ec2_host" "vmware_dedicated" {
//   instance_type     = "u-6tb1.metal"
//   availability_zone = "us-east-1a"
//   auto_placement    = "off"
//
//   tags = {
//     Name = "vmware-host-prod"
//     Env  = "production"
//   }
// }
//
// Apply: terraform init && terraform apply

// Use Azure Site Recovery or AWS CloudEndure to replicate running VMs,
// then perform a live cutover in a maintenance window — no recompile needed.`,
    awsComponents: [
      'VMware Cloud on AWS',
      'AWS Outposts',
      'CloudEndure Migration',
      'EC2 Dedicated Hosts',
    ],
    azureComponents: [
      'Azure VMware Solution (AVS)',
      'Azure Stack HCI',
      'Azure Site Recovery',
      'Azure Migrate (agentless)',
    ],
  },
];

// ── Expand/Collapse per-card ───────────────────────────────────────────────
function StrategyCard({ strategy }) {
  const [open, setOpen] = useState(false);
  const { number, title, icon, accent, tag, body, codeSnippet, awsComponents, azureComponents } = strategy;
  const accentColor = colors[accent] ?? colors.blue;

  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Existing Card component — unchanged */}
      <Card number={number} title={title} icon={icon} accent={accent} tag={tag}>
        {body}
      </Card>

      {/* Toggle button — flush to bottom of card */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '6px',
          width:           '100%',
          background:      `${accentColor}10`,
          border:          `1px solid ${accentColor}30`,
          borderTop:       'none',
          color:           accentColor,
          padding:         '9px 0',
          borderRadius:    `0 0 ${radius.lg} ${radius.lg}`,
          fontSize:        '12.5px',
          fontWeight:      700,
          letterSpacing:   '0.02em',
          cursor:          'pointer',
          transition:      transition.fast,
          marginBottom:    open ? '0' : '20px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}1e`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${accentColor}10`; }}
      >
        <span style={{ fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
        {open ? 'Hide .NET example & cloud services' : 'Show .NET example & cloud services'}
      </button>

      {/* Expandable panel */}
      <div
        style={{
          overflow:    'hidden',
          maxHeight:   open ? '1000px' : '0',
          opacity:     open ? 1 : 0,
          transition:  'max-height 0.45s ease, opacity 0.3s ease',
          marginBottom: open ? '20px' : '0',
        }}
      >
        {/* ── Code snippet ──────────────────────────────────────────────── */}
        <div
          style={{
            background:   '#0d1117',
            border:       `1px solid ${accentColor}30`,
            borderTop:    'none',
            borderRadius: `0 0 ${radius.lg} ${radius.lg}`,
            padding:      '20px 22px',
            marginBottom: '10px',
          }}
        >
          {/* Label row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              fontSize:      '10.5px',
              fontWeight:    700,
              color:         accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              whiteSpace:    'nowrap',
            }}>
              ⚙ .NET Code Example
            </span>
            <div style={{ flex: 1, height: '1px', background: `${accentColor}25` }} />
          </div>

          {/* Code block */}
          <pre
            style={{
              margin:     0,
              overflow:   'auto',
              fontSize:   '12px',
              lineHeight: 1.65,
              color:      '#cdd9e5',
              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            }}
          >
            <code>{codeSnippet}</code>
          </pre>
        </div>

        {/* ── Cloud services ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>

          {/* AWS */}
          <div style={{
            flex:         '1 1 220px',
            background:   '#ff990010',
            border:       '1px solid #ff990030',
            borderRadius: radius.lg,
            padding:      '16px 18px',
          }}>
            <div style={{
              fontSize:      '11px',
              fontWeight:    700,
              color:         '#ff9900',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom:  '10px',
            }}>
              ☁ AWS Services
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {awsComponents.map(svc => (
                <span
                  key={svc}
                  style={{
                    fontSize:     '12px',
                    background:   '#ff99001a',
                    color:        '#ff9900',
                    border:       '1px solid #ff990035',
                    borderRadius: radius.md,
                    padding:      '3px 10px',
                    fontWeight:   500,
                  }}
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Azure */}
          <div style={{
            flex:         '1 1 220px',
            background:   '#0078d410',
            border:       '1px solid #0078d430',
            borderRadius: radius.lg,
            padding:      '16px 18px',
          }}>
            <div style={{
              fontSize:      '11px',
              fontWeight:    700,
              color:         '#0078d4',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom:  '10px',
            }}>
              ⬡ Azure Services
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {azureComponents.map(svc => (
                <span
                  key={svc}
                  style={{
                    fontSize:     '12px',
                    background:   '#0078d41a',
                    color:        '#0078d4',
                    border:       '1px solid #0078d435',
                    borderRadius: radius.md,
                    padding:      '3px 10px',
                    fontWeight:   500,
                  }}
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────
export default function DotNet7Rs() {
  const { state: showInsight, toggle } = useToggle(false);

  const btnStyle = {
    display:      'inline-flex',
    alignItems:   'center',
    gap:          '8px',
    background:   `${colors.blue}18`,
    border:       `1px solid ${colors.blue}44`,
    color:        colors.blue,
    padding:      '10px 22px',
    borderRadius: radius.lg,
    fontSize:     '14px',
    fontWeight:   600,
    cursor:       'pointer',
    transition:   transition.fast,
    marginTop:    '8px',
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
            { value: '7',    label: 'Strategies',    accent: 'blue'  },
            { value: '80%',  label: 'Teams rehost',  accent: 'amber' },
            { value: '#1',   label: 'ROI: Refactor', accent: 'green' },
          ].map(({ value, label, accent }) => (
            <div key={label} style={{
              flex:         1,
              minWidth:     '120px',
              background:   colors.bgCard,
              border:       `1px solid ${colors.border}`,
              borderRadius: radius.lg,
              padding:      '20px',
              textAlign:    'center',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: colors[accent] ?? colors.blue }}>{value}</div>
              <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Video teaser CTA ─────────────────────────────────────────────── */}
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
            e.currentTarget.style.background  = `${colors.blue}18`;
            e.currentTarget.style.borderColor = `${colors.blue}66`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background  = `${colors.blue}0d`;
            e.currentTarget.style.borderColor = `${colors.blue}33`;
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
            See details ↓
          </div>
        </div>

        {/* ── Cards with expand/collapse ────────────────────────────────────── */}
        <Section title="🚀 The 7 Rs Explained" accent="blue">
          {RS.map(strategy => (
            <StrategyCard key={strategy.number} strategy={strategy} />
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

        {/* ── Migration Guides Hub ─────────────────────────────────────────── */}
        <Section title="🗺️ Go Deeper — Migration Guides" accent="purple">
          <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '20px' }}>
            Ready to migrate your COBOL mainframe or Java Spring Boot app to .NET 8?
            Each guide includes 8 pattern-by-pattern code comparisons, AWS &amp; Azure tooling,
            a downloadable Word reference, and — for COBOL — an AI-powered code analyzer.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* COBOL card */}
            {[
              {
                href:      '/cobol-to-csharp',
                icon:      '🖥️',
                lang:      'COBOL',
                arrow:     'C#',
                color:     '#C9842A',
                bg:        '#C9842A',
                tag:       'Mainframe Modernisation',
                blurb:     '8 patterns · Data Division, PERFORM, EVALUATE, File I/O, CALL subroutines → .NET 8',
                badge:     '+ AI Analyzer',
                price:     '$5',
              },
              {
                href:      '/java-to-csharp',
                icon:      '☕',
                lang:      'Java',
                arrow:     'C#',
                color:     '#F89820',
                bg:        '#F89820',
                tag:       'Spring Boot → ASP.NET Core',
                blurb:     '8 patterns · Streams → LINQ, Optional, CompletableFuture, Spring DI, Records, JUnit',
                badge:     '+ Ref Guide'
               // price:     '$3',
              },
            ].map(({ href, icon, lang, arrow, color, tag, blurb, badge, price }) => (
              <a
                key={lang}
                href={href}
                style={{
                  flex:           '1 1 260px',
                  display:        'block',
                  background:     colors.bgCard,
                  border:         `1px solid ${color}40`,
                  borderRadius:   radius.lg,
                  padding:        '20px',
                  textDecoration: 'none',
                  transition:     'border-color 0.2s, transform 0.15s',
                  cursor:         'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.transform   = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${color}40`;
                  e.currentTarget.style.transform   = 'none';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{icon}</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color }}>
                      {lang} → {arrow}
                    </span>
                  </div>
                  <span style={{
                    background: color, color: '#fff', fontWeight: 700,
                    fontSize: '13px', padding: '4px 12px', borderRadius: radius.md,
                  }}>
                    {price}
                  </span>
                </div>

                {/* Tag + badge */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color, fontWeight: 600, background: `${color}15`, padding: '2px 8px', borderRadius: radius.sm ?? '4px' }}>
                    {tag}
                  </span>
                  <span style={{ fontSize: '11px', color: colors.textMuted, background: `${colors.blue}18`, padding: '2px 8px', borderRadius: radius.sm ?? '4px' }}>
                    {badge}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '12.5px', color: colors.textMuted, margin: 0, lineHeight: 1.5 }}>
                  {blurb}
                </p>

                <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: 600, color }}>
                  View guide →
                </div>
              </a>
            ))}
          </div>

          {/* Bundle note */}
          <div style={{
            marginTop:    '16px',
            padding:      '12px 18px',
            background:   `${colors.blue}0d`,
            border:       `1px solid ${colors.blue}30`,
            borderRadius: radius.md,
            fontSize:     '13px',
            color:        colors.textMuted,
          }}>
            💡 <strong style={{ color: colors.text }}>Bundle:</strong> Get both guides + COBOL Analyzer for{' '}
            <strong style={{ color: colors.blue }}>$5 - see details</strong> — links on each guide page.
          </div>
        </Section>

        {/* ── Video sales section ───────────────────────────────────────────── */}
        <VideoSalesSection />

      </PostLayout>
    </>
  );
}
