import { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureCoreSchema, getPool, setCors } from '../../lib/apiDb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { platform, event_type, payload, status } = req.body || {};
  if (!platform || !event_type) return res.status(400).json({ error: 'Platform and event_type are required' });

  try {
    await ensureCoreSchema();
    const result = await getPool().query(
      'INSERT INTO admin_ai_logs (platform, event_type, payload, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [platform, event_type, typeof payload === 'string' ? payload : JSON.stringify(payload ?? {}), status || 'success']
    );
    return res.status(201).json({ success: true, log: result.rows[0] });
  } catch (error) {
    console.error('AI log webhook API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
