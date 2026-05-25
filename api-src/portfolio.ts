import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { ensureCoreSchema, getPool } from '../lib/apiDb.js';

interface AuthenticatedRequest extends VercelRequest {
  user?: { username: string; role: string; iat: number; exp: number };
}

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

function parseGalleryImages(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return [];
}

function cleanPortfolioPayload(body: any) {
  const mediaSource = String(body.media_source || 'native').trim();
  const parsed = parsePortfolioUrl(String(body.media_url || body.video_url || '').trim(), mediaSource);
  const gallery_images = parseGalleryImages(body.gallery_images);
  const thumbnailUrl = String(body.thumbnail_url || body.image_url || gallery_images[0] || '').trim();

  return {
    title: String(body.title || '').trim(),
    category: String(body.category || 'cinema').trim(),
    description: String(body.description || '').trim(),
    format_type: String(body.format_type || 'horizontal').trim(),
    media_source: mediaSource,
    media_url: parsed.cleanUrl,
    thumbnail_url: thumbnailUrl,
    gallery_images,
    views: Number(body.views) || 0,
    likes: Number(body.likes) || 0,
    display_order: Number(body.display_order) || 0
  };
}

function parsePortfolioUrl(url: string, source: string): { cleanUrl: string; videoId: string } {
  if (!url) return { cleanUrl: '', videoId: '' };
  const trimmed = url.trim();
  if (/<script|javascript:|onerror=|onload=/gi.test(trimmed)) return { cleanUrl: '', videoId: '' };

  if (source === 'youtube') {
    const match = trimmed.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ \s]{11})/);
    if (match?.[1]) {
      return {
        cleanUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&playsinline=1`,
        videoId: match[1]
      };
    }
  }

  if (source === 'vimeo') {
    const match = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
    if (match?.[1]) {
      return {
        cleanUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&autopause=0&controls=0&background=1`,
        videoId: match[1]
      };
    }
  }

  if (source === 'instagram') {
    const match = trimmed.match(/(?:instagram\.com\/(?:p|reel|tv)\/)([A-Za-z0-9_-]+)/);
    if (match?.[1]) return { cleanUrl: `https://www.instagram.com/reel/${match[1]}/embed`, videoId: match[1] };
  }

  return { cleanUrl: trimmed, videoId: trimmed };
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
    await ensureCoreSchema();
    const pool = getPool();

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
          (title, category, description, format_type, media_source, media_url, thumbnail_url, image_url, video_url, views, likes, display_order, gallery_images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $6, $8, $9, $10, $11)
         RETURNING *`,
        [item.title, item.category, item.description, item.format_type, item.media_source, item.media_url, item.thumbnail_url, item.views, item.likes, item.display_order, JSON.stringify(item.gallery_images)]
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
          display_order = $10,
          gallery_images = $11
         WHERE id = $12
         RETURNING *`,
        [item.title, item.category, item.description, item.format_type, item.media_source, item.media_url, item.thumbnail_url, item.views, item.likes, item.display_order, JSON.stringify(item.gallery_images), id]
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
