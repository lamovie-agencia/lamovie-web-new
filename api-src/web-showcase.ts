import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM web_showcase ORDER BY created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { title, description, image_url, live_url, category } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const result = await db.query(
        'INSERT INTO web_showcase (title, description, image_url, live_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description || '', image_url || '', live_url || '', category || '']
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Web showcase API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

