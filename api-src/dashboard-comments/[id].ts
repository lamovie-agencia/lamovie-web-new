import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Valid id is required' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = req.body || {};
      const result = await db.query(
        `UPDATE dashboard_comments
         SET author = COALESCE($1, author),
             avatar = COALESCE($2, avatar),
             text = COALESCE($3, text),
             date = COALESCE($4, date),
             page = COALESCE($5, page),
             status = COALESCE($6, status),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
          firstDefined(body.author),
          firstDefined(body.avatar),
          firstDefined(body.text),
          firstDefined(body.date),
          firstDefined(body.page),
          firstDefined(body.status),
          id
        ]
      );

      if (!result.rows[0]) return res.status(404).json({ error: 'Comment not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM dashboard_comments WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Dashboard comment item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
