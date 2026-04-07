/**
 * api/validate-license.js  —  Vercel serverless function
 *
 * Validates a Lemon Squeezy license key.
 * Place this file at: /api/validate-license.js (project root)
 *
 * Flow:
 *  1. First call (no instanceId): activates the key → returns instanceId
 *  2. Subsequent calls (with instanceId): validates key + instance
 *
 * No extra env vars needed — LS license API is public (key-based).
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { licenseKey, instanceId } = req.body ?? {};

  if (!licenseKey?.trim()) {
    return res.status(400).json({ error: 'License key is required.' });
  }

  const key = licenseKey.trim().toUpperCase();

  try {
    // ── If we already have an instance ID, just validate ──────────────────────
    if (instanceId) {
      const vRes  = await lsPost('licenses/validate', { license_key: key, instance_id: instanceId });
      const vData = await vRes.json();

      if (vData.valid) {
        return res.json({ valid: true, instanceId });
      }
      // Instance may be stale — fall through to fresh activation below
    }

    // ── First use: activate the license key ───────────────────────────────────
    const aRes  = await lsPost('licenses/activate', {
      license_key:   key,
      instance_name: 'deb-insights-web',
    });
    const aData = await aRes.json();

    if (aData.activated) {
      return res.json({ valid: true, instanceId: aData.instance?.id ?? null });
    }

    // ── Activation failed — possibly already at activation limit ──────────────
    // Try a bare validate (works for keys that were already activated elsewhere)
    const v2Res  = await lsPost('licenses/validate', { license_key: key });
    const v2Data = await v2Res.json();

    if (v2Data.valid) {
      return res.json({ valid: true, instanceId: v2Data.instance?.id ?? null });
    }

    // All checks failed
    const errMsg = aData.error ?? v2Data.error ?? 'Invalid or expired license key.';
    return res.status(400).json({ valid: false, error: errMsg });

  } catch (err) {
    console.error('License validation error:', err.message);
    return res.status(500).json({ error: 'Validation service unavailable. Please try again.' });
  }
}

// ── Lemon Squeezy API helper ──────────────────────────────────────────────────
function lsPost(endpoint, body) {
  return fetch(`https://api.lemonsqueezy.com/v1/${endpoint}`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    body: JSON.stringify(body),
  });
}
