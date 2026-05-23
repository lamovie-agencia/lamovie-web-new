import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../../lib/apiDb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Valid id is required' });

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = req.body || {};
      const result = await db.query(
        `UPDATE admin_contracts
         SET client = COALESCE($1, client),
             service = COALESCE($2, service),
             value_usd = COALESCE($3, value_usd),
             status = COALESCE($4, status),
             next_billing = COALESCE($5, next_billing),
             auto_renew = COALESCE($6, auto_renew)
         WHERE id = $7
         RETURNING id, client, service, value_usd AS "valueUSD", status, next_billing AS "nextBilling", auto_renew AS "autoRenew"`,
        [firstDefined(body.client), firstDefined(body.service), body.valueUSD === undefined ? null : Number(body.valueUSD), firstDefined(body.status), firstDefined(body.nextBilling), body.autoRenew === undefined ? null : Boolean(body.autoRenew), id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Contract not found' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await db.query('DELETE FROM admin_contracts WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Finance contract item API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

