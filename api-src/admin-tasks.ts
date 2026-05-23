import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM admin_tasks ORDER BY created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { title, description, priority, due_date, dueDate, reminder } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await db.query(
        `INSERT INTO admin_tasks (title, description, completed, status, priority, assigned_to, due_date, reminder)
         VALUES ($1, $2, FALSE, 'pending', $3, $4, $5, $6)
         RETURNING *`,
        [
          title,
          description || '',
          priority || 'medium',
          (req as AuthenticatedRequest).user?.username || 'admin',
          firstDefined(due_date, dueDate, null),
          reminder || null
        ]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin tasks API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
