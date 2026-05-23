import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../../lib/apiDb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT id, client, service, value_usd AS "valueUSD", status, next_billing AS "nextBilling", auto_renew AS "autoRenew" FROM admin_contracts ORDER BY id DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { client, service, valueUSD, status, nextBilling, autoRenew } = req.body || {};
      if (!client || !service) return res.status(400).json({ error: 'Client and service are required' });
      const result = await db.query(
        `INSERT INTO admin_contracts (client, service, value_usd, status, next_billing, auto_renew)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, client, service, value_usd AS "valueUSD", status, next_billing AS "nextBilling", auto_renew AS "autoRenew"`,
        [client, service, Number(valueUSD) || 0, status || 'pending', nextBilling || '', autoRenew !== false]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Finance contracts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

