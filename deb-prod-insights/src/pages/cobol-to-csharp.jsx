import { useState }      from 'react';
import PostLayout        from '../components/PostLayout.jsx';
import Section           from '../components/Section.jsx';
import HighlightBox      from '../components/HighlightBox.jsx';
import Card              from '../components/Card.jsx';
import Badge             from '../components/Badge.jsx';
import CobolAnalyzer     from '../components/CobolAnalyzer.jsx';
import { colors, transition, radius } from '../styles/theme.js';
import { Helmet }        from 'react-helmet';

const COBOL_BG    = '#120f00';
const COBOL_FG    = '#d4b896';
const COBOL_LABEL = '#c9842a';
const CS_LABEL    = '#9b4dca';

// ── Replace with your actual Gumroad / Stripe / Paddle links ─────────────────
const PURCHASE_DOC_HREF    = 'https://debprod.lemonsqueezy.com/checkout/buy/19786116-1933-4439-a3ba-4daab6ab9f5c';  // $3
const PURCHASE_BUNDLE_HREF = 'https://debprod.lemonsqueezy.com/checkout/buy/45681852-18dd-48f4-93aa-21c1272c4cf0';     // $5

const PATTERNS = [
  {
    number: 1, title: 'Data Division → Class / Record', icon: '📋',
    accent: 'amber', tag: 'Data Structures',
    body: "COBOL's WORKING-STORAGE SECTION declares all variables globally at fixed offsets. In C# you model the same data as immutable records or typed classes with strong compile-time guarantees and no fixed-width padding.",
    cobolSnippet:
`       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-CUSTOMER.
           05  WS-CUST-ID    PIC 9(6).
           05  WS-CUST-NAME  PIC X(50).
           05  WS-BALANCE    PIC S9(9)V99 COMP-3.
           05  WS-ACTIVE     PIC X(1).
               88 CUST-ACTIVE   VALUE 'Y'.
               88 CUST-INACTIVE VALUE 'N'.`,
    csharpSnippet:
`// Immutable record (recommended for DTOs)
public record Customer(
    int     CustomerId,
    string  Name,
    decimal Balance,
    bool    IsActive
);

// Mutable class for domain aggregates
public class Customer
{
    public int     CustomerId { get; set; }
    public string  Name       { get; set; } = string.Empty;
    public decimal Balance    { get; set; }
    public bool    IsActive   { get; set; }
}`,
    awsTools:   ['AWS Schema Conversion Tool', 'AWS DMS', 'Amazon DynamoDB', 'Amazon RDS'],
    azureTools: ['Azure Database Migration Service', 'Azure SQL / Cosmos DB', 'Azure Mainframe Migration', 'Azure Data Factory'],
  },
  {
    number: 2, title: 'PERFORM VARYING → for / foreach', icon: '🔁',
    accent: 'blue', tag: 'Loop Logic',
    body: "COBOL's PERFORM VARYING drives indexed table processing. C# replaces it with idiomatic for / foreach or LINQ, eliminating explicit index management.",
    cobolSnippet:
`       01  WS-IDX    PIC 9(4).
       01  WS-MAX    PIC 9(4) VALUE 100.
       01  WS-TOTAL  PIC S9(9)V99 COMP-3.
       01  WS-TABLE.
           05  WS-AMT OCCURS 100 TIMES
               PIC S9(7)V99.

       MOVE ZEROS TO WS-TOTAL
       PERFORM VARYING WS-IDX FROM 1 BY 1
           UNTIL WS-IDX > WS-MAX
           ADD WS-AMT(WS-IDX) TO WS-TOTAL
       END-PERFORM.`,
    csharpSnippet:
`// PERFORM VARYING → for loop
decimal total = 0m;
for (int i = 0; i < amounts.Length; i++)
    total += amounts[i];

// More idiomatic — foreach
foreach (var amount in amounts)
    total += amount;

// Most idiomatic — LINQ
decimal total = amounts.Sum();`,
    awsTools:   ['AWS Mainframe Modernization', 'AWS Migration Hub', 'Amazon Comprehend'],
    azureTools: ['Azure Migrate', 'Azure Logic Apps', 'Azure DevOps Pipelines'],
  },
  {
    number: 3, title: 'EVALUATE WHEN → switch expression', icon: '🔀',
    accent: 'green', tag: 'Branching',
    body: "COBOL's EVALUATE / WHEN is a multi-way branch. C# 8 switch expressions are more concise and exhaustiveness-checked by the compiler.",
    cobolSnippet:
`       EVALUATE WS-TX-CODE
           WHEN 'CR'
               PERFORM CREDIT-ACCOUNT
           WHEN 'DB'
               PERFORM DEBIT-ACCOUNT
           WHEN 'TF'
               PERFORM TRANSFER-FUNDS
           WHEN OTHER
               PERFORM HANDLE-UNKNOWN
       END-EVALUATE.`,
    csharpSnippet:
`// EVALUATE WHEN → switch expression (C# 8+)
var action = txCode switch
{
    "CR" => CreditAccount,
    "DB" => DebitAccount,
    "TF" => TransferFunds,
    _    => HandleUnknown,   // WHEN OTHER
};
await action(transaction);

// Pattern matching for richer conditions
var fee = (txCode, transaction.Amount) switch
{
    ("TF", > 10_000m) => 25.00m,
    ("TF", _)         => 5.00m,
    _                 => 0m,
};`,
    awsTools:   ['AWS Step Functions', 'Amazon EventBridge', 'AWS Lambda'],
    azureTools: ['Azure Logic Apps', 'Azure Durable Functions', 'Azure Event Grid'],
  },
  {
    number: 4, title: 'File I/O → StreamReader / EF Core', icon: '📂',
    accent: 'purple', tag: 'File Handling',
    body: "COBOL was built for sequential flat-file processing. Replace it with StreamReader for legacy file feeds or EF Core for relational data access.",
    cobolSnippet:
`       FILE-CONTROL.
           SELECT CUST-FILE ASSIGN TO 'CUST.DAT'
               ORGANIZATION IS SEQUENTIAL.
       FD  CUST-FILE.
       01  CUST-REC.
           05  R-ID    PIC 9(6).
           05  R-NAME  PIC X(50).

       OPEN INPUT CUST-FILE
       PERFORM UNTIL WS-EOF = 'Y'
           READ CUST-FILE INTO WS-CUSTOMER
               AT END MOVE 'Y' TO WS-EOF
               NOT AT END PERFORM PROCESS-REC
           END-READ
       END-PERFORM
       CLOSE CUST-FILE.`,
    csharpSnippet:
`// Async sequential file read
await using var reader = new StreamReader("CUST.DAT");
while (await reader.ReadLineAsync() is { } line)
{
    var record = new CustomerRecord(
        Id:   int.Parse(line[..6]),
        Name: line[6..56].Trim()
    );
    await ProcessRecordAsync(record);
}

// Structured data → EF Core
await foreach (var c in dbContext.Customers
    .Where(c => c.IsActive).AsAsyncEnumerable())
{
    await ProcessRecordAsync(c);
}`,
    awsTools:   ['Amazon S3', 'AWS Glue (ETL)', 'Amazon RDS / Aurora', 'AWS Transfer Family'],
    azureTools: ['Azure Blob Storage', 'Azure Data Factory', 'Azure SQL', 'Azure Files'],
  },
  {
    number: 5, title: 'STRING / INSPECT → string methods', icon: '🔤',
    accent: 'green', tag: 'String Handling',
    body: "COBOL string handling is verbose and position-based. C# strings are Unicode objects with a rich method library — no padding or delimited concatenation required.",
    cobolSnippet:
`       01  WS-FIRST   PIC X(20).
       01  WS-LAST    PIC X(20).
       01  WS-FULL    PIC X(41).

       MOVE 'John'  TO WS-FIRST
       MOVE 'Smith' TO WS-LAST

       STRING WS-FIRST DELIMITED SPACE
              ' '       DELIMITED SIZE
              WS-LAST   DELIMITED SPACE
          INTO WS-FULL

       MOVE FUNCTION UPPER-CASE(WS-LAST)
           TO WS-UPPER`,
    csharpSnippet:
`string first = "John";
string last  = "Smith";

// STRING DELIMITED → string interpolation
string full  = $"{first} {last}";

// UPPER-CASE function
string upper = last.ToUpperInvariant();

// INSPECT TALLYING → LINQ Count
int count = last.Count(c => c == 'S');

// UNSTRING → Split
string[] parts = full.Split(' ',
    StringSplitOptions.RemoveEmptyEntries);

// Reference modification → Range
string sub = full[..4]; // "John"`,
    awsTools:   ['Amazon Comprehend (NLP)', 'AWS Glue DataBrew'],
    azureTools: ['Azure AI Language', 'Azure Data Factory'],
  },
  {
    number: 6, title: 'COMPUTE / ADD → decimal arithmetic', icon: '🧮',
    accent: 'amber', tag: 'Arithmetic',
    body: "COBOL's packed-decimal (COMP-3) avoids floating-point error. In C# always use decimal — never double — to maintain the same precision in financial calculations.",
    cobolSnippet:
`       01  WS-PRINCIPAL  PIC 9(9)V99 COMP-3.
       01  WS-RATE       PIC 9(3)V9(6) COMP-3.
       01  WS-INTEREST   PIC 9(9)V99 COMP-3.

       MOVE 10000.00 TO WS-PRINCIPAL
       MOVE 0.035    TO WS-RATE

       COMPUTE WS-INTEREST ROUNDED =
           WS-PRINCIPAL * WS-RATE

       ADD WS-INTEREST TO WS-PRINCIPAL
           GIVING WS-TOTAL

       DIVIDE 12 INTO WS-TOTAL
           GIVING WS-MONTHLY ROUNDED`,
    csharpSnippet:
`// NEVER use double/float for financial values
decimal principal = 10_000.00m;
decimal rate      = 0.035m;

decimal interest = Math.Round(
    principal * rate, 2,
    MidpointRounding.AwayFromZero);

decimal total   = principal + interest;

decimal monthly = Math.Round(
    total / 12, 2,
    MidpointRounding.AwayFromZero);

// The 'm' suffix is mandatory: 0.035m`,
    awsTools:   ['Amazon Aurora (decimal types)', 'AWS Lambda (financial microservice)'],
    azureTools: ['Azure SQL (decimal precision)', 'Azure Functions'],
  },
  {
    number: 7, title: 'CALL Subroutine → Interface + DI', icon: '📞',
    accent: 'blue', tag: 'Modularity',
    body: "COBOL CALL passes data BY REFERENCE to a separately compiled program. C# replaces this with interfaces and dependency injection — testable, swappable, no recompile of callers.",
    cobolSnippet:
`      * Caller
       CALL 'CALC-TAX' USING
           BY REFERENCE WS-INCOME
           BY REFERENCE WS-TAX-OUT
       END-CALL.

      * Called program CALC-TAX
       LINKAGE SECTION.
       01  LS-INCOME   PIC 9(9)V99 COMP-3.
       01  LS-TAX-OUT  PIC 9(9)V99 COMP-3.

       PROCEDURE DIVISION USING LS-INCOME LS-TAX-OUT.
           COMPUTE LS-TAX-OUT ROUNDED =
               LS-INCOME * 0.20
           STOP RUN.`,
    csharpSnippet:
`// Contract (replaces LINKAGE SECTION)
public interface ITaxCalculator
{
    decimal Calculate(decimal income);
}

public sealed class TaxCalculator : ITaxCalculator
{
    public decimal Calculate(decimal income) =>
        Math.Round(income * 0.20m, 2,
            MidpointRounding.AwayFromZero);
}

// Register (Program.cs)
builder.Services.AddScoped<ITaxCalculator,
    TaxCalculator>();

// Consume via constructor injection
public class PayrollService(ITaxCalculator tax)
{
    public decimal NetPay(decimal gross) =>
        gross - tax.Calculate(gross);
}`,
    awsTools:   ['AWS Lambda', 'Amazon API Gateway', 'AWS SAM'],
    azureTools: ['Azure Functions', 'Azure APIM', 'Azure Container Apps'],
  },
  {
    number: 8, title: 'DECLARATIVES → try / catch', icon: '🛡️',
    accent: 'red', tag: 'Error Handling',
    body: "COBOL error handling relies on status code checks and DECLARATIVES sections. C# structured exception handling is explicit, composable, and propagates automatically up the call stack.",
    cobolSnippet:
`       01  WS-STATUS   PIC XX.
       01  WS-ERR-MSG  PIC X(100).

       OPEN INPUT CUST-FILE
       IF WS-STATUS NOT = '00'
           MOVE 'File open error' TO WS-ERR-MSG
           PERFORM HANDLE-ERROR
           STOP RUN
       END-IF.

       DECLARATIVES.
       FILE-ERR SECTION.
           USE AFTER ERROR ON CUST-FILE.
           DISPLAY 'I/O Error: ' WS-STATUS.
       END DECLARATIVES.`,
    csharpSnippet:
`public async Task<IReadOnlyList<Customer>>
    LoadAsync(string path, CancellationToken ct)
{
    try
    {
        await using var stream = File.OpenRead(path);
        return await JsonSerializer
            .DeserializeAsync<List<Customer>>(
                stream, cancellationToken: ct) ?? [];
    }
    catch (FileNotFoundException ex)
    {
        _logger.LogError(ex, "File not found: {Path}", path);
        throw new CustomerDataException(
            "File open error", ex);
    }
    catch (IOException ex)
    {
        _logger.LogError(ex, "I/O error");
        throw;
    }
}

public sealed class CustomerDataException(
    string msg, Exception? inner = null)
    : Exception(msg, inner);`,
    awsTools:   ['CloudWatch Alarms', 'AWS X-Ray', 'Amazon SNS'],
    azureTools: ['Application Insights', 'Azure Monitor Alerts', 'Azure Service Bus (DLQ)'],
  },
];

function MigrationCard({ pattern }) {
  const [open, setOpen] = useState(false);
  const { number, title, icon, accent, tag, body,
          cobolSnippet, csharpSnippet, awsTools, azureTools } = pattern;
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
        {open ? 'Hide comparison & cloud tools' : 'Show COBOL → C# comparison & cloud tools'}
      </button>

      <div style={{ overflow: 'hidden', maxHeight: open ? '1400px' : '0', opacity: open ? 1 : 0, transition: 'max-height 0.5s ease, opacity 0.3s ease', marginBottom: open ? '20px' : '0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', border: `1px solid ${accentColor}30`, borderTop: 'none', borderRadius: `0 0 ${radius.lg} ${radius.lg}`, overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ flex: '1 1 300px', background: COBOL_BG, borderRight: `1px solid ${COBOL_LABEL}25`, padding: '18px 20px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: COBOL_LABEL, textTransform: 'uppercase', letterSpacing: '0.08em' }}>COBOL (Legacy)</span>
              <div style={{ flex: 1, height: '1px', background: `${COBOL_LABEL}30` }} />
            </div>
            <pre style={{ margin: 0, overflow: 'auto', fontSize: '11.5px', lineHeight: 1.65, color: COBOL_FG, fontFamily: "'Fira Code','Consolas',monospace" }}><code>{cobolSnippet}</code></pre>
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

function CobolSalesSection() {
  return (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 240px', background: `${COBOL_LABEL}0a`, border: `1px solid ${COBOL_LABEL}35`, borderRadius: radius.lg, padding: '20px' }}>
        <div style={{ fontSize: '22px', marginBottom: '8px' }}>📄</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text, marginBottom: '6px' }}>Reference Guide</div>
        <div style={{ fontSize: '12.5px', color: colors.textMuted, marginBottom: '16px', lineHeight: 1.5 }}>
          All 8 patterns as a formatted Word doc — code comparisons, AWS &amp; Azure tools, migration gotchas. Print it, share it, keep it offline.
        </div>
        <a href={PURCHASE_DOC_HREF} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: COBOL_LABEL, color: '#fff', fontWeight: 700, fontSize: '14px', padding: '9px 22px', borderRadius: radius.md, textDecoration: 'none' }}>
          Get .docx — $3
        </a>
      </div>

      <div style={{ flex: '1 1 240px', background: `${CS_LABEL}0a`, border: `2px solid ${CS_LABEL}50`, borderRadius: radius.lg, padding: '20px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '-10px', left: '16px', background: CS_LABEL, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: radius.md, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Best Value
        </span>
        <div style={{ fontSize: '22px', marginBottom: '8px' }}>🤖 + 📄</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text, marginBottom: '6px' }}>Reference Guide + AI Analyzer</div>
        <div style={{ fontSize: '12.5px', color: colors.textMuted, marginBottom: '16px', lineHeight: 1.5 }}>
          Word doc <strong>+</strong> 10 AI-powered COBOL analysis credits. Paste your own code, get instant C# migration advice powered by Claude Haiku.
        </div>
        <a href={PURCHASE_BUNDLE_HREF} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: CS_LABEL, color: '#fff', fontWeight: 700, fontSize: '14px', padding: '9px 22px', borderRadius: radius.md, textDecoration: 'none' }}>
          Get Bundle — $5
        </a>
      </div>
    </div>
  );
}

export default function CobolToCSharp() {
  return (
    <>
      <Helmet>
        <title>COBOL to C# Migration Guide | Deb Insights</title>
        <meta name="description" content="Practical COBOL to C# .NET 8 migration patterns with side-by-side code examples. Data division, PERFORM loops, EVALUATE, file I/O, subroutines and more." />
        <link rel="canonical" href="https://insights.debprod.com/cobol-to-csharp" />
      </Helmet>
      <PostLayout
        title="COBOL to C# Migration"
        subtitle="Billions of lines of COBOL still run the world's banks, insurers, and government systems. Here's how every major construct maps to modern C# — pattern by pattern."
        accent="amber" tag="Mainframe Modernisation" readTime="8 min read"
      >
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[
            { value: '800B+', label: 'COBOL lines in production', accent: 'amber' },
            { value: '8',     label: 'Migration patterns',        accent: 'blue'  },
            { value: '95%',   label: 'Logic is 1:1 mappable',     accent: 'green' },
          ].map(({ value, label, accent }) => (
            <div key={label} style={{ flex: 1, minWidth: '130px', background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: colors[accent] ?? colors.blue }}>{value}</div>
              <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        <Section title="📖 What is COBOL?" accent="amber">
          <HighlightBox accent="amber" icon="🏦" label="Why COBOL Still Matters"
            text="COBOL (1959) processes an estimated $3 trillion in daily commerce. Designed for fixed-width record processing, packed-decimal arithmetic, and sequential file I/O — without a heap or garbage collector. Understanding its four-DIVISION structure is essential before any migration." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '14px' }}>
            {[
              { d: 'IDENTIFICATION', desc: 'Program name & metadata' },
              { d: 'ENVIRONMENT',    desc: 'File & I/O assignments' },
              { d: 'DATA DIVISION',  desc: 'All variables: WORKING-STORAGE, FILE, LINKAGE' },
              { d: 'PROCEDURE',      desc: 'All logic — PARAGRAPHs & SECTIONs, no functions' },
            ].map(({ d, desc }) => (
              <div key={d} style={{ background: `${COBOL_LABEL}0d`, border: `1px solid ${COBOL_LABEL}30`, borderRadius: radius.md, padding: '12px 14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: COBOL_LABEL, marginBottom: '4px' }}>{d} DIV.</div>
                <div style={{ fontSize: '12px', color: colors.textMuted }}>{desc}</div>
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
            Take these patterns offline or unlock the AI-powered COBOL Analyzer to decode your own codebase — powered by Claude Haiku.
          </p>
          <CobolSalesSection />
        </Section>

        <Section title="🤖 COBOL Code Analyzer" accent="amber">
          <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '18px' }}>
            Paste any COBOL snippet and receive a plain-English explanation, key construct breakdown,
            and the direct C# .NET 8 equivalent. Included with the $5 bundle.
          </p>
          <CobolAnalyzer />
        </Section>

        <Section title="⚠️ Migration Gotchas" accent="red">
          <HighlightBox accent="red" icon="🚨" label="Never Ignore These"
            text="1 — Always use decimal in C#, never double. COBOL COMP-3 is packed decimal; one wrong float type introduces rounding errors across millions of transactions. 2 — COBOL strings are fixed-width space-padded — always .Trim() after conversion. 3 — Copybooks map to shared C# class libraries, not inline records. 4 — PERFORM can fall through in some dialects — ensure all converted logic has explicit return paths." />
        </Section>
      </PostLayout>
    </>
  );
}
