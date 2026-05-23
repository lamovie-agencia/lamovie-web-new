import { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureCoreSchema, getPool, setCors } from '../lib/apiDb';

function headerValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, service, message, origin } = req.body || {};
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    await ensureCoreSchema();
    const ip = headerValue(req.headers['x-forwarded-for']).split(',')[0] || '';
    const device = headerValue(req.headers['user-agent']);

    const result = await getPool().query(
      `INSERT INTO admin_crm_clients (name, email, phone, service, status, notes, origin, ip, device)
       VALUES ($1, $2, $3, $4, 'new', $5, $6, $7, $8)
       RETURNING *, created_at AS date`,
      [name, email || '', phone || '', service || 'Contacto general', message || '', origin || 'Formulario Web', ip, device]
    );

    return res.status(201).json({
      success: true,
      message: 'Lead saved successfully',
      lead: result.rows[0]
    });
  } catch (error) {
    console.error('Error processing lead:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
