/**
 * analyze-cobol.js — Serverless function for COBOL AI analysis
 *
 * Deploy this as:
 *   • Vercel:   /api/analyze-cobol.js  (auto-detected)
 *   • Netlify:  /netlify/functions/analyze-cobol.js
 *   • AWS:      Lambda via API Gateway
 *
 * ENV required:
 *   ANTHROPIC_API_KEY=sk-ant-...
 *   COBOL_ANALYZER_SECRET=your-random-secret  (optional — validate purchase)
 *
 * npm install @anthropic-ai/sdk
 *
 * ── PRICING SUMMARY ─────────────────────────────────────────────────────────
 *   claude-haiku-4-5-20251001
 *     Input:  $0.80 / 1M tokens
 *     Output: $4.00 / 1M tokens
 *   Typical call: ~675 input + ~900 output ≈ $0.004 per analysis
 *   10 analyses = $0.04 API cost → profitable at $5 purchase price
 * ────────────────────────────────────────────────────────────────────────────
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a senior COBOL-to-C# migration expert.
When given COBOL code, you produce a concise, actionable explanation structured as:

## What This Code Does
One to three sentences in plain English — what business problem it solves.

## Key COBOL Constructs
A short list (max 5 items) identifying the COBOL-specific statements used and what they mean.

## C# .NET 8 Equivalent
A focused code block showing the idiomatic C# replacement, with brief inline comments.

## Migration Notes
Up to 3 bullet points flagging gotchas (e.g., decimal vs double, string trimming, DI patterns).

Keep each section concise. Use markdown. Always prefer modern C# idioms (records, LINQ, async/await).`;

export default async function handler(req, res) {
  // ── Method guard ────────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  const { code, question } = req.body ?? {};

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'code is required' });
  }

  // ── Input limits ────────────────────────────────────────────────────────────
  const trimmedCode = code.slice(0, 1500);

  const userMessage = [
    'Analyze this COBOL code:',
    '```cobol',
    trimmedCode,
    '```',
    question ? `\nSpecific question: ${question.slice(0, 300)}` : '',
  ].filter(Boolean).join('\n');

  // ── Call Anthropic ──────────────────────────────────────────────────────────
  try {
    const response = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',   // swap to claude-sonnet-4-6 for richer output
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userMessage }],
    });

    const explanation = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    return res.status(200).json({
      explanation,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      model:      response.model,
    });
  } catch (err) {
    console.error('Anthropic error:', err);
    return res.status(500).json({
      error: 'AI analysis failed. Please try again.',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

/*
 * ── Vercel config (add to same file for Vercel Edge) ───────────────────────
 * export const config = { runtime: 'nodejs20.x' };
 *
 * ── Netlify config ──────────────────────────────────────────────────────────
 * Rename file to:  netlify/functions/analyze-cobol.mjs
 * Export as:       export const handler = async (event) => { ... }
 *
 * ── Rate limiting (recommended for production) ──────────────────────────────
 * Use Upstash Redis + @upstash/ratelimit:
 *
 *   import { Ratelimit } from '@upstash/ratelimit';
 *   import { Redis }     from '@upstash/redis';
 *
 *   const ratelimit = new Ratelimit({
 *     redis:    Redis.fromEnv(),
 *     limiter:  Ratelimit.slidingWindow(10, '30d'), // 10 per 30 days per IP
 *     prefix:   'cobol_analyzer',
 *   });
 *
 *   const { success } = await ratelimit.limit(req.headers['x-forwarded-for']);
 *   if (!success) return res.status(429).json({ error: 'Rate limit exceeded' });
 */
