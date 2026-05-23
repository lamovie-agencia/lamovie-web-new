import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends VercelRequest {
  user?: { username: string; role: string; iat: number; exp: number };
}

const IMAGE_LIMIT = 4 * 1024 * 1024;
const VIDEO_LIMIT = 4 * 1024 * 1024;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

async function ensureAssetTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_assets (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { filename, contentType, data } = req.body || {};
    if (!filename || !contentType || !data) return res.status(400).json({ error: 'Missing upload data' });
    if (!String(contentType).startsWith('image/') && !String(contentType).startsWith('video/')) {
      return res.status(400).json({ error: 'Only images and videos are allowed' });
    }

    const buffer = Buffer.from(String(data), 'base64');
    const limit = String(contentType).startsWith('image/') ? IMAGE_LIMIT : VIDEO_LIMIT;
    if (buffer.length > limit) {
      return res.status(413).json({
        error: `File too large. Max ${Math.round(limit / 1024 / 1024)} MB for this media type.`
      });
    }

    await ensureAssetTable();
    const result = await pool.query(
      'INSERT INTO portfolio_assets (filename, content_type, size_bytes, data) VALUES ($1, $2, $3, $4) RETURNING id',
      [String(filename), String(contentType), buffer.length, buffer]
    );

    const id = result.rows[0].id;
    return res.status(201).json({
      id,
      url: `/api/assets/${id}`,
      contentType,
      size: buffer.length
    });
  } catch (error) {
    console.error('Asset upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
