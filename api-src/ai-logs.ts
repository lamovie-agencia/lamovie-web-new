import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const result = await getPool().query('SELECT * FROM admin_ai_logs ORDER BY id DESC LIMIT 50');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('AI logs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

