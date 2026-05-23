import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../lib/apiDb';

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
        `UPDATE client_partners
         SET name = COALESCE($1, name),
             logo_url = COALESCE($2, logo_url),
             website_url = COALESCE($3, website_url),
             featured = COALESCE($4, featured)
         WHERE id = $5
         RETURNING *`,
        [firstDefined(body.name), firstDefined(body.logo_url), firstDefined(body.website_url), body.featured === undefined ? null : Boolean(body.featured), id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Partner not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM client_partners WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Partner item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
