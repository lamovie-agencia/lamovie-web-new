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
        `UPDATE production_shoots
         SET title = COALESCE($1, title),
             date = COALESCE($2, date),
             status = COALESCE($3, status),
             crew = COALESCE($4, crew),
             location = COALESCE($5, location),
             notes = COALESCE($6, notes),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
          firstDefined(body.title),
          firstDefined(body.date),
          firstDefined(body.status),
          firstDefined(body.crew),
          firstDefined(body.location),
          firstDefined(body.notes),
          id
        ]
      );

      if (!result.rows[0]) return res.status(404).json({ error: 'Production shoot not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM production_shoots WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Production shoot item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
