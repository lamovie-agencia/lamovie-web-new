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
        `UPDATE admin_crm_clients
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             service = COALESCE($4, service),
             status = COALESCE($5, status),
             notes = COALESCE($6, notes),
             value = COALESCE($7, value),
             tag = COALESCE($8, tag),
             reminder = COALESCE($9, reminder),
             origin = COALESCE($10, origin)
         WHERE id = $11
         RETURNING *, created_at AS date`,
        [
          firstDefined(body.name),
          firstDefined(body.email),
          firstDefined(body.phone),
          firstDefined(body.service),
          firstDefined(body.status),
          firstDefined(body.notes),
          body.value !== undefined ? Number(body.value) : null,
          firstDefined(body.tag),
          firstDefined(body.reminder),
          firstDefined(body.origin),
          id
        ]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Client not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM admin_crm_clients WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin CRM item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

