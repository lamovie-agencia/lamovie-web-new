import crypto from 'crypto';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getId, getPool, setCors } from '../../../../lib/apiDb';

function signedUrl(bucket: string, key: string, minutes = 15) {
  const expires = Math.floor(Date.now() / 1000) + minutes * 60;
  const secret = process.env.DOCUMENT_SIGNING_SECRET || process.env.JWT_SECRET || 'la-movie-docs-secret';
  const signature = crypto.createHmac('sha256', secret).update(`${bucket}/${key}:${expires}`).digest('hex');
  return `/api/docs/download-secure?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(key)}&Expires=${expires}&Signature=${signature}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Valid id is required' });

  try {
    await ensureCoreSchema();
    const result = await getPool().query('SELECT * FROM admin_documents WHERE id = $1', [id]);
    const doc = result.rows[0];
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const bucket = doc.gcs_bucket_name || 'la-movie-documents-prod';
    const key = doc.gcs_object_key || `contracts/contract-${doc.id}.md`;
    return res.status(200).json({
      id: doc.id,
      name: doc.name,
      bucket,
      key,
      signed_url: signedUrl(bucket, key),
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Signed document URL API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

