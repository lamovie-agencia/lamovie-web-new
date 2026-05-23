import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, asArray, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../lib/apiDb.js';

async function resolveClientId(clientId: any, clientName: any) {
  if (clientId) return Number(clientId);
  if (!clientName) return null;

  const result = await getPool().query('SELECT id FROM admin_crm_clients WHERE LOWER(name) = LOWER($1) LIMIT 1', [clientName]);
  return result.rows[0]?.id || null;
}

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
      const clientId = await resolveClientId(body.client_id, body.client);
      const teamValue = body.team === undefined ? null : asArray(body.team);

      const result = await db.query(
        `UPDATE projects
         SET name = COALESCE($1, name),
             client_id = COALESCE($2, client_id),
             type = COALESCE($3, type),
             status = COALESCE($4, status),
             progress = COALESCE($5, progress),
             team = COALESCE($6, team),
             assets = COALESCE($7, assets),
             due_date = COALESCE($8, due_date),
             budget = COALESCE($9, budget),
             color = COALESCE($10, color)
         WHERE id = $11
         RETURNING id`,
        [
          firstDefined(body.name, body.title),
          clientId,
          firstDefined(body.type),
          firstDefined(body.status),
          body.progress !== undefined ? Number(body.progress) : null,
          teamValue,
          body.assets !== undefined ? Number(body.assets) : null,
          firstDefined(body.due_date, body.dueDate, body.end_date),
          body.budget !== undefined ? Number(body.budget) : null,
          firstDefined(body.color),
          id
        ]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Project not found' });

      const joined = await db.query(`
        SELECT p.*, p.due_date AS "dueDate", COALESCE(c.name, '') AS client, c.email AS client_email
        FROM projects p
        LEFT JOIN admin_crm_clients c ON p.client_id = c.id
        WHERE p.id = $1
      `, [id]);
      return res.status(200).json(joined.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM projects WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Project item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

