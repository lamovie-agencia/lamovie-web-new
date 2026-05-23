import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT key, value FROM site_settings');
      const settings = result.rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
      return res.status(200).json(settings);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'Key is required' });
      const result = await db.query(
        `INSERT INTO site_settings (key, value)
         VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [key, JSON.stringify(value ?? null)]
      );
      return res.status(200).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Settings API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

