# CLAUDE.md — dotnetinsights

This file documents the codebase structure, development workflows, and conventions for AI assistants working in this repository.

## Project Overview

**deb-prod-insights** is a React SPA that serves as a .NET migration guide and tooling platform. It covers the "7 Rs" of .NET modernisation and includes an AI-powered COBOL-to-C# analyser backed by the Anthropic Claude API. The app also offers Java-to-C# migration guidance and a migration architecture reference.

Monetisation is handled via **Lemon Squeezy** license-key validation to gate the AI analyser feature.

## Repository Layout

```
dotnetinsights/
├── .vscode/
└── deb-prod-insights/          ← THE APPLICATION ROOT
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── vercel.json              # Vercel deploy config + security headers
    ├── package.json
    ├── validate-license.js      # Lemon Squeezy license validation (serverless)
    ├── api/
    │   └── analyze-cobol.js    # Vercel serverless function — Anthropic API call
    ├── Netlify/
    │   └── functions/
    │       └── analyze-cobol.js # Mirror of api/analyze-cobol.js for Netlify
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── assets/
        ├── components/
        │   ├── Badge.jsx
        │   ├── Card.jsx
        │   ├── CobolAnalyzer.jsx
        │   ├── CodeBlock.jsx
        │   ├── Footer.jsx
        │   ├── HighlightBox.jsx
        │   ├── Navbar.jsx
        │   ├── PostLayout.jsx
        │   ├── Section.jsx
        │   └── VideoSalesSection.jsx
        ├── hooks/
        │   ├── useHover.js
        │   └── useToggle.js
        ├── pages/
        │   ├── About.jsx
        │   ├── DotNet7Rs.jsx
        │   ├── DotNet7Rs_backup.jsx  ← stale backup, should be deleted
        │   ├── MigrationArchitecture.jsx
        │   ├── TermsAndConditions.jsx
        │   ├── cobol-to-csharp.jsx
        │   └── java-to-csharp.jsx
        └── styles/
```

All development work happens inside `deb-prod-insights/`.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 + `@rolldown/plugin-babel` |
| Routing | React Router DOM v7 |
| AI / Claude | `@anthropic-ai/sdk` v0.82 |
| Analytics | `@vercel/analytics` |
| SEO | `react-helmet` |
| License gating | Lemon Squeezy API (via `/api/validate-license.js`) |
| Serverless runtime | Node.js — Vercel Functions (`/api/`) or Netlify Functions (`/Netlify/functions/`) |
| Compiler | React Compiler (via `babel-plugin-react-compiler`) |
| Linting | ESLint 9 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` |
| Deploy | Vercel (primary), Netlify (alternative) |
| Language | JavaScript (`.jsx`) — no TypeScript |

## Development Commands

All commands must be run from `deb-prod-insights/`:

```bash
cd deb-prod-insights
npm install      # install dependencies
npm run dev      # start Vite dev server (proxies /api → localhost:3001)
npm run build    # production build → dist/
npm run preview  # preview production build locally
npm run lint     # run ESLint
```

### Running the API locally

The Vite dev server proxies `/api/*` to `http://localhost:3001`. To develop the serverless functions locally, run a local Express server on port 3001 that imports and mounts the handler functions, or use the Vercel CLI:

```bash
npm i -g vercel
vercel dev   # runs Vite + serverless functions together
```

### Required environment variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Required by `api/analyze-cobol.js` — Claude API key (`sk-ant-...`) |
| `COBOL_ANALYZER_SECRET` | Optional — validates purchase before allowing AI analysis |

Create a `.env` file in `deb-prod-insights/` for local development. **Never commit `.env`.**

## Architecture

### Routing (`src/App.jsx`)

| Route | Component |
|---|---|
| `/` | `DotNet7Rs` (same as `/dotnet-7rs`) |
| `/dotnet-7rs` | `DotNet7Rs` |
| `/migration-architecture` | `MigrationArchitecture` |
| `/about` | `About` |
| `/cobol-to-csharp` | `CobolToCSharp` |
| `/java-to-csharp` | `JavaToCSharp` |
| `/terms` | `TermsAndConditions` |

Each page wraps its content in the shared `<Navbar>` (top) and `<Footer>` (bottom) from `App.jsx`.

### Serverless API (`api/analyze-cobol.js`)

- Accepts `POST /api/analyze-cobol` with JSON body `{ code: string, question?: string }`.
- Input is capped at 1 500 characters of COBOL code; questions at 300 characters.
- Calls `claude-haiku-4-5-20251001` with `max_tokens: 1024`.
- Returns `{ explanation: string, tokensUsed: number, model: string }`.
- The same file is mirrored at `Netlify/functions/analyze-cobol.js` for Netlify deployments.
- To switch to a more capable model for richer output, change the `model` field to `claude-sonnet-4-6`.

### License Validation (`validate-license.js` / Lemon Squeezy)

- Accepts `POST` with `{ licenseKey, instanceId? }`.
- On first use (no `instanceId`): activates the Lemon Squeezy license key and returns an `instanceId`.
- On subsequent calls: validates key + instance; falls back to fresh activation if the instance is stale.
- No environment variables required — the Lemon Squeezy license API is public (key-based).
- Store the returned `instanceId` in `localStorage` on the client side for re-validation.

### Component Library (`src/components/`)

| Component | Purpose |
|---|---|
| `Navbar` | Top navigation bar |
| `Footer` | Site-wide footer |
| `Card` | Generic content card |
| `Badge` | Status/label badge chip |
| `CodeBlock` | Syntax-highlighted code display |
| `CobolAnalyzer` | AI-powered COBOL analysis UI (calls `/api/analyze-cobol`) |
| `HighlightBox` | Callout/highlight box |
| `PostLayout` | Shared page layout wrapper for content pages |
| `Section` | Section divider with heading |
| `VideoSalesSection` | Promotional video + CTA section |

### Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useHover` | Tracks hover state of a ref |
| `useToggle` | Boolean toggle state |

## Security Headers

`vercel.json` sets comprehensive security headers on all routes:
- `Strict-Transport-Security` (HSTS, 2 years, preload)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (blocks camera, mic, geolocation, payment, USB, FLoC)
- `Content-Security-Policy` (restrictive — `'self'` for most directives)
- `Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy: same-origin`

Do not weaken these headers without good reason.

## Key Conventions

1. **No TypeScript** — keep files as `.jsx` / `.js`.
2. **React Compiler is active** — avoid manual `useMemo`/`useCallback` unless the compiler cannot handle the case.
3. **ESLint rule**: `no-unused-vars` errors on lowercase names; `^[A-Z_]` pattern is allowed unused.
4. **No tests** — there is currently no test suite.
5. **Inline styles and/or `src/styles/`** — no CSS framework.
6. **AI model**: the serverless function uses `claude-haiku-4-5-20251001` for cost efficiency. If richer analysis is needed, switch the `model` constant in `api/analyze-cobol.js` to `claude-sonnet-4-6`.
7. **Naming convention for pages**: PascalCase (e.g. `DotNet7Rs.jsx`) for primary pages, but kebab-case is also present (e.g. `cobol-to-csharp.jsx`) — follow the existing pattern for the file you're editing.
8. **Backup files**: `DotNet7Rs_backup.jsx` is a stale snapshot — do not use it as a reference; it should be deleted.

## Deployment

### Vercel (primary)

- Root directory: `deb-prod-insights`
- Framework preset: Vite
- Serverless functions are auto-detected from the `api/` directory.
- Set `ANTHROPIC_API_KEY` in Vercel environment variables.
- `vercel.json` catch-all rewrite handles client-side routing.

### Netlify (alternative)

- Functions live in `deb-prod-insights/Netlify/functions/`.
- Rename the export signature from `export default async function handler(req, res)` to the Netlify event-based signature if deploying there.

## What NOT to Do

- Do not run commands from the repo root — the application lives in `deb-prod-insights/`.
- Do not commit `.env` files or the `ANTHROPIC_API_KEY`.
- Do not remove or weaken the security headers in `vercel.json`.
- Do not use `DotNet7Rs_backup.jsx` as source of truth — it is outdated.
- Do not add rate limiting in client-side code — implement it server-side (see commented Upstash example in `api/analyze-cobol.js`).
- Do not add TypeScript without explicit agreement.
