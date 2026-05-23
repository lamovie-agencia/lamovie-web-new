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
        `UPDATE web_showcase
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             image_url = COALESCE($3, image_url),
             live_url = COALESCE($4, live_url),
             category = COALESCE($5, category)
         WHERE id = $6
         RETURNING *`,
        [firstDefined(body.title), firstDefined(body.description), firstDefined(body.image_url), firstDefined(body.live_url), firstDefined(body.category), id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Web showcase item not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM web_showcase WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Web showcase item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

