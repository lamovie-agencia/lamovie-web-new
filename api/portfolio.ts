import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends VercelRequest {
  user?: { username: string; role: string; iat: number; exp: number };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

function authenticateToken(req: AuthenticatedRequest): boolean {
  const authHeader = req.headers.authorization;
  const token = Array.isArray(authHeader) ? authHeader[0]?.split(' ')[1] : authHeader?.split(' ')[1];
  if (!token || !process.env.JWT_SECRET) return false;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as AuthenticatedRequest['user'];
    return true;
  } catch {
    return false;
  }
}

async function ensurePortfolioTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'cinema',
      description TEXT DEFAULT '',
      format_type TEXT DEFAULT 'horizontal',
      media_source TEXT DEFAULT 'native',
      media_url TEXT DEFAULT '',
      thumbnail_url TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      click_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
    ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
    ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
    ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;
  `);
}

function cleanPortfolioPayload(body: any) {
  return {
    title: String(body.title || '').trim(),
    category: String(body.category || 'cinema').trim(),
    description: String(body.description || '').trim(),
    format_type: String(body.format_type || 'horizontal').trim(),
    media_source: String(body.media_source || 'native').trim(),
    media_url: String(body.media_url || body.video_url || '').trim(),
    thumbnail_url: String(body.thumbnail_url || body.image_url || '').trim(),
    views: Number(body.views) || 0,
    likes: Number(body.likes) || 0,
    display_order: Number(body.display_order) || 0
  };
}

function getIdFromUrl(req: VercelRequest): number | null {
  const queryId = Number(req.query.id);
  if (Number.isInteger(queryId)) return queryId;

  const pathname = String(req.url || '').split('?')[0];
  const match = pathname.match(/\/api\/portfolio\/(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) ? id : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensurePortfolioTable();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM portfolio ORDER BY display_order ASC, created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) {
      return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' });
    }

    if (req.method === 'POST') {
      const item = cleanPortfolioPayload(req.body);
      if (!item.title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO portfolio
          (title, category, description, format_type, media_source, media_url, thumbnail_url, image_url, video_url, views, likes, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $6, $8, $9, $10)
         RETURNING *`,
        [item.title, item.category, item.description, item.format_type, item.media_source, item.media_url, item.thumbnail_url, item.views, item.likes, item.display_order]
      );
      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const id = getIdFromUrl(req);
      if (!id) return res.status(400).json({ error: 'Invalid id' });

      const item = cleanPortfolioPayload(req.body);
      if (!item.title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `UPDATE portfolio SET
          title = $1,
          category = $2,
          description = $3,
          format_type = $4,
          media_source = $5,
          media_url = $6,
          thumbnail_url = $7,
          image_url = $7,
          video_url = $6,
          views = $8,
          likes = $9,
          display_order = $10
         WHERE id = $11
         RETURNING *`,
        [item.title, item.category, item.description, item.format_type, item.media_source, item.media_url, item.thumbnail_url, item.views, item.likes, item.display_order, id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = getIdFromUrl(req);
      if (!id) return res.status(400).json({ error: 'Invalid id' });
      await pool.query('DELETE FROM portfolio WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
