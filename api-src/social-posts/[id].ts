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
        `UPDATE social_posts
         SET text = COALESCE($1, text),
             platform = COALESCE($2, platform),
             date = COALESCE($3, date),
             status = COALESCE($4, status),
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [
          firstDefined(body.text),
          firstDefined(body.platform),
          firstDefined(body.date),
          firstDefined(body.status),
          id
        ]
      );

      if (!result.rows[0]) return res.status(404).json({ error: 'Social post not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM social_posts WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Social post item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
