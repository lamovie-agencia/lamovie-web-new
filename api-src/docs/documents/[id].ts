import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../../lib/apiDb';

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
        `UPDATE admin_documents
         SET name = COALESCE($1, name),
             type = COALESCE($2, type),
             client = COALESCE($3, client),
             status = COALESCE($4, status),
             author = COALESCE($5, author),
             content_markdown = COALESCE($6, content_markdown)
         WHERE id = $7
         RETURNING *`,
        [firstDefined(body.name), firstDefined(body.type), firstDefined(body.client), firstDefined(body.status), firstDefined(body.author), firstDefined(body.content_markdown), id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Document not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM admin_documents WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Document item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

