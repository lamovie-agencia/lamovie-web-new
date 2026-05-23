import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../../lib/apiDb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM admin_documents ORDER BY id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, type, client, status, author, content_markdown } = req.body || {};
      if (!name || !type) return res.status(400).json({ error: 'Name and type are required' });
      const key = `contracts/contract-${Date.now()}.md`;
      const result = await db.query(
        `INSERT INTO admin_documents (name, type, client, status, author, gcs_object_key, gcs_bucket_name, content_markdown)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, type, client || '', status || 'draft', author || 'Administrador', key, 'la-movie-documents-prod', content_markdown || `# ${name}`]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Docs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

