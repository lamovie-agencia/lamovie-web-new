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
      const search = String(req.query.search || '').trim();
      const status = String(req.query.status || '').trim();
      const searchLike = search ? `%${search}%` : '';
      const result = await db.query(
        `SELECT id, client, service, value_usd AS "valueUSD", status,
                next_billing AS "nextBilling", auto_renew AS "autoRenew",
                start_date AS "startDate", end_date AS "endDate",
                billing_cycle AS "billingCycle", expected_cost_usd AS "expectedCostUSD",
                reinvest_percent AS "reinvestPercent", savings_percent AS "savingsPercent",
                payroll_percent AS "payrollPercent", owner_profit_percent AS "ownerProfitPercent",
                notes
         FROM admin_contracts
         WHERE ($1 = '' OR client ILIKE $1 OR service ILIKE $1 OR notes ILIKE $1)
           AND ($2 = '' OR status = $2)
         ORDER BY id DESC`,
        [searchLike, status]
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const {
        client, service, valueUSD, status, nextBilling, autoRenew,
        startDate, endDate, billingCycle, expectedCostUSD,
        reinvestPercent, savingsPercent, payrollPercent, ownerProfitPercent, notes
      } = req.body || {};
      if (!client || !service) return res.status(400).json({ error: 'Client and service are required' });
      const result = await db.query(
        `INSERT INTO admin_contracts
          (client, service, value_usd, status, next_billing, auto_renew, start_date, end_date, billing_cycle,
           expected_cost_usd, reinvest_percent, savings_percent, payroll_percent, owner_profit_percent, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING id, client, service, value_usd AS "valueUSD", status,
                   next_billing AS "nextBilling", auto_renew AS "autoRenew",
                   start_date AS "startDate", end_date AS "endDate",
                   billing_cycle AS "billingCycle", expected_cost_usd AS "expectedCostUSD",
                   reinvest_percent AS "reinvestPercent", savings_percent AS "savingsPercent",
                   payroll_percent AS "payrollPercent", owner_profit_percent AS "ownerProfitPercent",
                   notes`,
        [
          client, service, Number(valueUSD) || 0, status || 'pending', nextBilling || '',
          autoRenew !== false, startDate || '', endDate || '', billingCycle || 'monthly',
          Number(expectedCostUSD) || 0, Number(reinvestPercent) || 20, Number(savingsPercent) || 10,
          Number(payrollPercent) || 30, Number(ownerProfitPercent) || 40, notes || ''
        ]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Finance contracts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

