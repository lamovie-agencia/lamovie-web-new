import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const isAdmin = authenticateToken(req as AuthenticatedRequest);
      const result = await db.query(
        isAdmin
          ? 'SELECT * FROM client_partners ORDER BY created_at DESC, id DESC'
          : 'SELECT * FROM client_partners WHERE featured = TRUE ORDER BY created_at DESC, id DESC'
      );
      return res.status(200).json(result.rows);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { name, logo_url, website_url, featured } = req.body || {};
      if (!name || !logo_url) return res.status(400).json({ error: 'Name and logo_url are required' });
      const result = await db.query(
        'INSERT INTO client_partners (name, logo_url, website_url, featured) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, logo_url, website_url || '', featured !== false]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Partners API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
