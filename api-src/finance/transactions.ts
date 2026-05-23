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
      const result = await db.query(`
        SELECT t.id, t.date, t.description, t.type, t.amount_usd AS "amountUSD", t.category,
               t.scope, t.payment_method AS "paymentMethod", t.work_type AS "workType", t.notes,
               t.collaborator_id AS "collaboratorId", tm.name AS "collaboratorName",
               t.project_id AS "projectId", t.contract_id AS "contractId", t.activity_date AS "activityDate"
        FROM admin_transactions t
        LEFT JOIN team_members tm ON tm.id = t.collaborator_id
        ORDER BY t.id DESC
      `);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const {
        date, description, type, amountUSD, category, scope, paymentMethod,
        workType, notes, collaboratorId, projectId, contractId, activityDate
      } = req.body || {};
      if (!description) return res.status(400).json({ error: 'Description is required' });
      const result = await db.query(
        `INSERT INTO admin_transactions
          (date, description, type, amount_usd, category, scope, payment_method, work_type, notes,
           collaborator_id, project_id, contract_id, activity_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id, date, description, type, amount_usd AS "amountUSD", category,
                   scope, payment_method AS "paymentMethod", work_type AS "workType", notes,
                   collaborator_id AS "collaboratorId", project_id AS "projectId",
                   contract_id AS "contractId", activity_date AS "activityDate"`,
        [
          date || new Date().toISOString().split('T')[0],
          description,
          type || 'income',
          Number(amountUSD) || 0,
          category || '',
          scope || 'company',
          paymentMethod || '',
          workType || '',
          notes || '',
          collaboratorId ? Number(collaboratorId) : null,
          projectId ? Number(projectId) : null,
          contractId ? Number(contractId) : null,
          activityDate || date || new Date().toISOString().split('T')[0]
        ]
      );
      const transaction = result.rows[0];
      const automations: string[] = [];

      if (transaction.type === 'income' && transaction.contractId) {
        const contractResult = await db.query(
          'SELECT * FROM admin_contracts WHERE id = $1',
          [transaction.contractId]
        );
        const contract = contractResult.rows[0];

        if (contract) {
          await db.query("UPDATE admin_contracts SET status = 'active' WHERE id = $1", [contract.id]);
          automations.push('Contrato activado');

          const existingProject = await db.query(
            'SELECT id FROM projects WHERE LOWER(name) = LOWER($1) LIMIT 1',
            [`${contract.service} - ${contract.client}`]
          );
          if (!existingProject.rows[0]) {
            await db.query(
              `INSERT INTO projects (name, type, status, progress, team, assets, due_date, budget, color)
               VALUES ($1, $2, 'planning', 0, $3, 0, $4, $5, 'from-green-500 to-emerald-500')`,
              [
                `${contract.service} - ${contract.client}`,
                contract.billing_cycle === 'monthly' ? 'Retainer' : 'Proyecto',
                ['PM', 'FIN'],
                contract.end_date || contract.next_billing || transaction.date,
                Number(contract.value_usd) || 0
              ]
            );
            automations.push('Proyecto activado');
          }

          await db.query(
            `INSERT INTO admin_documents (name, type, client, status, author, content_markdown)
             VALUES ($1, 'invoice', $2, 'issued', 'Sistema Financiero', $3)`,
            [
              `Factura ${contract.client} ${transaction.date}`,
              contract.client,
              `# Factura LA MOVIE\n\nCliente: ${contract.client}\nServicio: ${contract.service}\nValor: ${transaction.amountUSD} USD\nFecha: ${transaction.date}\nEstado: Emitida automaticamente por pago registrado.`
            ]
          );
          automations.push('Factura generada');

          await db.query(
            `INSERT INTO admin_tasks (title, description, priority, status, due_date)
             VALUES ($1, $2, 'high', 'pending', $3)`,
            [
              `Kickoff equipo - ${contract.client}`,
              `Pago registrado para ${contract.service}. Activar entregables, brief y agenda de produccion.`,
              transaction.activityDate || transaction.date
            ]
          );
          automations.push('Equipo notificado por tarea');

          await db.query(
            `INSERT INTO admin_ai_logs (platform, event_type, payload, status)
             VALUES ('finance', 'payment_automation', $1, 'success')`,
            [JSON.stringify({ transactionId: transaction.id, contractId: contract.id, automations })]
          );
        }
      }

      return res.status(201).json({ ...transaction, automations });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Finance transactions API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
