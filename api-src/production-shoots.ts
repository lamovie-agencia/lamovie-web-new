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
      const result = await db.query('SELECT * FROM production_shoots ORDER BY date DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { title, date, status, crew, location, notes } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await db.query(
        `INSERT INTO production_shoots (title, date, status, crew, location, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, date || '', status || 'Pre-producción', crew || '', location || '', notes || '']
      );

      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Production shoots API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
