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
        `UPDATE pricing_packages
         SET name = COALESCE($1, name),
             category = COALESCE($2, category),
             price = COALESCE($3, price),
             period = COALESCE($4, period),
             description = COALESCE($5, description),
             features = COALESCE($6, features),
             recommended = COALESCE($7, recommended),
             color = COALESCE($8, color),
             icon = COALESCE($9, icon)
         WHERE id = $10
         RETURNING *`,
        [
          firstDefined(body.name),
          firstDefined(body.category),
          body.price === undefined ? null : String(body.price),
          firstDefined(body.period),
          firstDefined(body.description),
          body.features === undefined ? null : asArray(body.features),
          body.recommended === undefined ? null : Boolean(body.recommended),
          firstDefined(body.color),
          firstDefined(body.icon),
          id
        ]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Pricing package not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM pricing_packages WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Pricing item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

