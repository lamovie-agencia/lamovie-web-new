import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const result = await pool.query(
      'SELECT filename, content_type, data FROM portfolio_assets WHERE id = $1',
      [id]
    );

    const asset = result.rows[0];
    if (!asset) return res.status(404).json({ error: 'Not found' });

    res.setHeader('Content-Type', asset.content_type);
    res.setHeader('Content-Disposition', `inline; filename="${String(asset.filename).replace(/"/g, '')}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(asset.data);
  } catch (error) {
    console.error('Asset fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
