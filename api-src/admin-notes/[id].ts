import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getId, getPool, setCors } from '../../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Valid id is required' });

  try {
    await ensureCoreSchema();
    if (req.method === 'DELETE') {
      await getPool().query('DELETE FROM admin_notes WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin note item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
