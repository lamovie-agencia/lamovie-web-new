import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT id, date, description, type, amount_usd AS "amountUSD", category FROM admin_transactions ORDER BY id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { date, description, type, amountUSD, category } = req.body || {};
      const result = await db.query(
        'INSERT INTO admin_transactions (date, description, type, amount_usd, category) VALUES ($1, $2, $3, $4, $5) RETURNING id, date, description, type, amount_usd AS "amountUSD", category',
        [date || new Date().toISOString().split('T')[0], description || '', type || 'income', Number(amountUSD) || 0, category || '']
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Finance transactions API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
