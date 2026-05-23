import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, asArray, authenticateToken, ensureCoreSchema, firstDefined, getPool, setCors } from '../lib/apiDb.js';

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

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query(`
        SELECT p.*,
               p.due_date AS "dueDate",
               COALESCE(c.name, '') AS client,
               c.email AS client_email
        FROM projects p
        LEFT JOIN admin_crm_clients c ON p.client_id = c.id
        ORDER BY p.created_at DESC, p.id DESC
      `);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const name = firstDefined(body.name, body.title);
      if (!name) return res.status(400).json({ error: 'Name is required' });

      const clientId = await resolveClientId(body.client_id, body.client);
      const result = await db.query(
        `INSERT INTO projects (name, client_id, type, status, progress, team, assets, due_date, budget, color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          name,
          clientId,
          body.type || 'Web App',
          body.status || 'planning',
          Number(body.progress) || 0,
          asArray(body.team),
          Number(body.assets) || 0,
          firstDefined(body.due_date, body.dueDate, body.end_date, new Date().toISOString()),
          Number(body.budget) || 0,
          body.color || 'from-blue-500 to-purple-500'
        ]
      );

      const joined = await db.query(`
        SELECT p.*, p.due_date AS "dueDate", COALESCE(c.name, '') AS client, c.email AS client_email
        FROM projects p
        LEFT JOIN admin_crm_clients c ON p.client_id = c.id
        WHERE p.id = $1
      `, [result.rows[0].id]);

      return res.status(201).json(joined.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Projects API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

