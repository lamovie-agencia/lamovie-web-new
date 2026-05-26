import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, asArray, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM pricing_packages ORDER BY created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { name, category, price, period, description, features, recommended, color, icon, page } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Name is required' });

      const result = await db.query(
        `INSERT INTO pricing_packages (name, category, price, period, description, features, recommended, color, icon, page)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [name, category || 'social', String(price || '0'), period || '', description || '', asArray(features), Boolean(recommended), color || '', icon || '', page || 'pricing']
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Pricing API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

