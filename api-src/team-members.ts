import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM team_members ORDER BY active DESC, created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, role, email, phone, rateUSD, rateCycle, active, notes } = req.body || {};
      if (!String(name || '').trim()) return res.status(400).json({ error: 'Name is required' });
      const result = await db.query(
        `INSERT INTO team_members (name, role, email, phone, rate_usd, rate_cycle, active, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          String(name).trim(),
          role || '',
          email || '',
          phone || '',
          Number(rateUSD) || 0,
          rateCycle || 'project',
          active !== false,
          notes || ''
        ]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Team members API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
