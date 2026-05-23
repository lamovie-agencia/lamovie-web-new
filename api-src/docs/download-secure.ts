import crypto from 'crypto';
import path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureCoreSchema, getPool, setCors } from '../../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { bucket, key, Expires, Signature } = req.query;
  const bucketName = String(bucket || '');
  const objectKey = String(key || '');
  const expires = Number(Array.isArray(Expires) ? Expires[0] : Expires);
  const signature = String(Array.isArray(Signature) ? Signature[0] : Signature || '');

  if (!bucketName || !objectKey || !expires || !signature) {
    return res.status(400).json({ error: 'Missing signature parameters' });
  }

  if (Math.floor(Date.now() / 1000) > expires) {
    return res.status(403).json({ error: 'Signed URL expired' });
  }

  const secret = process.env.DOCUMENT_SIGNING_SECRET || process.env.JWT_SECRET || 'la-movie-docs-secret';
  const expected = crypto.createHmac('sha256', secret).update(`${bucketName}/${objectKey}:${expires}`).digest('hex');
  if (expected !== signature) return res.status(401).json({ error: 'Invalid signature' });

  try {
    await ensureCoreSchema();
    const result = await getPool().query('SELECT name, content_markdown FROM admin_documents WHERE gcs_object_key = $1 LIMIT 1', [objectKey]);
    const doc = result.rows[0];
    const content = doc?.content_markdown || `# Documento LA MOVIE\n\nArchivo: ${objectKey}`;
    const filename = `${(doc?.name || path.basename(objectKey)).toLowerCase().replace(/\s+/g, '_')}.md`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    return res.status(200).send(content);
  } catch (error) {
    console.error('Secure document download API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

