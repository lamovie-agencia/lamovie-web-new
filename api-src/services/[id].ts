import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, asArray, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../lib/apiDb.js';

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
        `UPDATE services
         SET title = COALESCE($1, title),
             subtitle = COALESCE($2, subtitle),
             description = COALESCE($3, description),
             icon = COALESCE($4, icon),
             items = COALESCE($5, items)
         WHERE id = $6
         RETURNING *`,
        [
          firstDefined(body.title),
          firstDefined(body.subtitle),
          firstDefined(body.description),
          firstDefined(body.icon),
          body.items === undefined && body.features === undefined ? null : asArray(body.items || body.features),
          id
        ]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Service not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM services WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Service item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

