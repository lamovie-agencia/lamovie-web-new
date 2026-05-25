import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM admin_notes ORDER BY created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { content, reminder } = req.body || {};
      if (!content) return res.status(400).json({ error: 'Content is required' });
      const result = await db.query(
        'INSERT INTO admin_notes (content, reminder) VALUES ($1, $2) RETURNING *',
        [content, reminder || null]
      );
      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const id = getId(req);
      if (!id) return res.status(400).json({ error: 'Valid id is required' });
      const body = req.body || {};
      const result = await db.query(
        `UPDATE admin_notes
         SET content = COALESCE($1, content),
             reminder = COALESCE($2, reminder)
         WHERE id = $3
         RETURNING *`,
        [firstDefined(body.content), firstDefined(body.reminder), id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = getId(req);
      if (!id) return res.status(400).json({ error: 'Valid id is required' });
      await db.query('DELETE FROM admin_notes WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin notes API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
