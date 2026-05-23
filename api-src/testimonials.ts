import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { name, role, content, image_url, rating } = req.body || {};
      if (!name || !content) return res.status(400).json({ error: 'Name and content are required' });
      const result = await db.query(
        'INSERT INTO testimonials (name, role, content, image_url, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, role || '', content, image_url || '', Number(rating) || 5]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

