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
        `UPDATE team_members
         SET name = COALESCE($1, name),
             role = COALESCE($2, role),
             email = COALESCE($3, email),
             phone = COALESCE($4, phone),
             rate_usd = COALESCE($5, rate_usd),
             rate_cycle = COALESCE($6, rate_cycle),
             active = COALESCE($7, active),
             notes = COALESCE($8, notes)
         WHERE id = $9
         RETURNING *`,
        [
          firstDefined(body.name),
          firstDefined(body.role),
          firstDefined(body.email),
          firstDefined(body.phone),
          body.rateUSD !== undefined ? Number(body.rateUSD) : null,
          firstDefined(body.rateCycle),
          body.active === undefined ? null : Boolean(body.active),
          firstDefined(body.notes),
          id
        ]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Team member not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM team_members WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Team member item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
