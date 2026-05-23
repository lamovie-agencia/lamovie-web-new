import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, firstDefined, getId, getPool, setCors } from '../../../lib/apiDb.js';

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
             auto_renew = COALESCE($6, auto_renew),
             start_date = COALESCE($7, start_date),
             end_date = COALESCE($8, end_date),
             billing_cycle = COALESCE($9, billing_cycle),
             expected_cost_usd = COALESCE($10, expected_cost_usd),
             reinvest_percent = COALESCE($11, reinvest_percent),
             savings_percent = COALESCE($12, savings_percent),
             payroll_percent = COALESCE($13, payroll_percent),
             owner_profit_percent = COALESCE($14, owner_profit_percent),
             notes = COALESCE($15, notes)
         WHERE id = $16
         RETURNING id, client, service, value_usd AS "valueUSD", status,
                   next_billing AS "nextBilling", auto_renew AS "autoRenew",
                   start_date AS "startDate", end_date AS "endDate",
                   billing_cycle AS "billingCycle", expected_cost_usd AS "expectedCostUSD",
                   reinvest_percent AS "reinvestPercent", savings_percent AS "savingsPercent",
                   payroll_percent AS "payrollPercent", owner_profit_percent AS "ownerProfitPercent",
                   notes`,
        [
          firstDefined(body.client),
          firstDefined(body.service),
          body.valueUSD === undefined ? null : Number(body.valueUSD),
          firstDefined(body.status),
          firstDefined(body.nextBilling),
          body.autoRenew === undefined ? null : Boolean(body.autoRenew),
          firstDefined(body.startDate),
          firstDefined(body.endDate),
          firstDefined(body.billingCycle),
          body.expectedCostUSD === undefined ? null : Number(body.expectedCostUSD),
          body.reinvestPercent === undefined ? null : Number(body.reinvestPercent),
          body.savingsPercent === undefined ? null : Number(body.savingsPercent),
          body.payrollPercent === undefined ? null : Number(body.payrollPercent),
          body.ownerProfitPercent === undefined ? null : Number(body.ownerProfitPercent),
          firstDefined(body.notes),
          id
        ]
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

