import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getPool, setCors } from '../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query(`
        SELECT *,
               created_at AS date
        FROM admin_crm_clients
        ORDER BY created_at DESC, id DESC
      `);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, email, phone, service, status, notes, value, tag, reminder, origin, contractStart, contractEnd, serviceValue, billingCycle } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Name is required' });

      const result = await db.query(
        `INSERT INTO admin_crm_clients
          (name, email, phone, service, status, notes, value, tag, reminder, origin, contract_start, contract_end, service_value, billing_cycle)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *, created_at AS date`,
        [
          name,
          email || '',
          phone || '',
          service || '',
          status || 'prospect',
          notes || '',
          Number(value) || 0,
          tag || '',
          reminder || null,
          firstDefined(origin, 'Formulario Web'),
          contractStart || null,
          contractEnd || null,
          Number(serviceValue || value) || 0,
          billingCycle || 'unique'
        ]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin CRM API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
