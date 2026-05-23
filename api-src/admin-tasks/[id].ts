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
        `UPDATE admin_tasks
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed),
             status = COALESCE($4, status),
             priority = COALESCE($5, priority),
             due_date = COALESCE($6, due_date),
             reminder = COALESCE($7, reminder)
         WHERE id = $8
         RETURNING *`,
        [
          firstDefined(body.title),
          firstDefined(body.description),
          body.completed === undefined ? null : Boolean(body.completed),
          firstDefined(body.status),
          firstDefined(body.priority),
          firstDefined(body.due_date, body.dueDate),
          firstDefined(body.reminder),
          id
        ]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM admin_tasks WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Task item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

