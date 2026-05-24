import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, authenticateToken, ensureCoreSchema, getPool, setCors } from '../../lib/apiDb.js';

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function todaysDate() {
  return new Date().toISOString().split('T')[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const clientId = Number(body.clientId);

  if (!clientId) {
    return res.status(400).json({ error: 'clientId is required' });
  }

  try {
    await ensureCoreSchema();
    const db = getPool();

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    let inTransaction = false;

    try {
      await db.query('BEGIN');
      inTransaction = true;

      const clientResult = await db.query(
        'SELECT * FROM admin_crm_clients WHERE id = $1 FOR UPDATE',
        [clientId]
      );

      if (!clientResult.rows[0]) {
        return res.status(404).json({ error: 'Client not found' });
      }

      const client = clientResult.rows[0];
      const serviceName = String(body.service || client.service || client.name || 'Servicio LA MOVIE').trim();
      const conversionValue = toNumber(body.valueUSD ?? client.service_value ?? client.value ?? 0);
      const billingCycle = String(body.billingCycle || client.billing_cycle || 'monthly');
      const startDate = String(body.startDate || client.contract_start || todaysDate());
      const endDate = String(body.endDate || client.contract_end || '');
      const notes = [
        String(body.notes || '').trim(),
        String(client.notes || '').trim(),
        'Conversión automatizada desde el dashboard'
      ].filter(Boolean).join('\n\n');

      const existingContractResult = await db.query(
        `SELECT * FROM admin_contracts
         WHERE LOWER(client) = LOWER($1)
           AND LOWER(service) = LOWER($2)
         ORDER BY id DESC
         LIMIT 1
         FOR UPDATE`,
        [String(client.name || serviceName), serviceName]
      );

      let contract = existingContractResult.rows[0];
      if (!contract) {
        const contractResult = await db.query(
          `INSERT INTO admin_contracts
            (client, service, value_usd, status, next_billing, auto_renew, start_date, end_date, billing_cycle,
             expected_cost_usd, reinvest_percent, savings_percent, payroll_percent, owner_profit_percent, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           RETURNING *`,
          [
            String(client.name || serviceName),
            serviceName,
            conversionValue,
            'pending',
            endDate || startDate,
            true,
            startDate,
            endDate,
            billingCycle,
            0,
            20,
            10,
            30,
            40,
            notes
          ]
        );
        contract = contractResult.rows[0];
      } else {
        await db.query(
          `UPDATE admin_contracts
           SET client = COALESCE($1, client),
               service = COALESCE($2, service),
               value_usd = COALESCE($3, value_usd),
               next_billing = COALESCE($4, next_billing),
               auto_renew = COALESCE($5, auto_renew),
               start_date = COALESCE($6, start_date),
               end_date = COALESCE($7, end_date),
               billing_cycle = COALESCE($8, billing_cycle),
               notes = COALESCE($9, notes)
           WHERE id = $10`,
          [
            String(client.name || serviceName),
            serviceName,
            conversionValue || contract.value_usd,
            endDate || contract.next_billing || startDate,
            contract.auto_renew,
            startDate || contract.start_date,
            endDate || contract.end_date,
            billingCycle || contract.billing_cycle,
            notes,
            contract.id
          ]
        );
        const refreshedContract = await db.query('SELECT * FROM admin_contracts WHERE id = $1', [contract.id]);
        contract = refreshedContract.rows[0];
      }

      const projectName = `${serviceName} - ${String(client.name || 'Cliente')}`;
      const projectResult = await db.query(
        `SELECT * FROM projects
         WHERE client_id = $1 OR LOWER(name) = LOWER($2)
         ORDER BY id DESC
         LIMIT 1
         FOR UPDATE`,
        [clientId, projectName]
      );

      let project = projectResult.rows[0];
      if (!project) {
        const projectInsert = await db.query(
          `INSERT INTO projects (name, client_id, type, status, progress, team, assets, due_date, budget, color)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING *`,
          [
            projectName,
            clientId,
            billingCycle === 'monthly' ? 'Retainer' : 'Proyecto',
            'planning',
            0,
            ['PM', 'FIN'],
            0,
            endDate || startDate,
            conversionValue,
            'from-green-500 to-emerald-500'
          ]
        );
        project = projectInsert.rows[0];
      }

      let transaction = null;
      const initialAmount = conversionValue > 0 ? conversionValue / 2 : 0;

      if (initialAmount > 0) {
        const existingConversionTransaction = await db.query(
          `SELECT id FROM admin_transactions
           WHERE contract_id = $1 AND LOWER(notes) LIKE '%conversión automatizada%'
           LIMIT 1`,
          [contract.id]
        );

        if (!existingConversionTransaction.rows[0]) {
          const transactionResult = await db.query(
            `INSERT INTO admin_transactions
              (date, description, type, amount_usd, category, scope, payment_method, work_type, notes,
               collaborator_id, project_id, contract_id, activity_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING id, date, description, type, amount_usd AS "amountUSD", category,
                       scope, payment_method AS "paymentMethod", work_type AS "workType", notes,
                       collaborator_id AS "collaboratorId", project_id AS "projectId",
                       contract_id AS "contractId", activity_date AS "activityDate"`,
            [
              startDate,
              `Anticipo 50% - ${serviceName} - ${client.name}`,
              'income',
              initialAmount,
              'Ingreso conversión',
              'company',
              'Transferencia',
              billingCycle === 'monthly' ? 'Retainer' : 'Proyecto',
              `Conversión automatizada desde el dashboard. Anticipo del 50% para ${client.name}`,
              null,
              project.id,
              contract.id,
              startDate
            ]
          );

          transaction = transactionResult.rows[0];
          const automations: string[] = [];

          if (transaction.type === 'income' && transaction.contractId) {
            const contractValidation = await db.query('SELECT * FROM admin_contracts WHERE id = $1', [contract.id]);
            const currentContract = contractValidation.rows[0];

            if (currentContract) {
              await db.query("UPDATE admin_contracts SET status = 'active' WHERE id = $1", [currentContract.id]);
              automations.push('Contrato activado');

              const existingProjectByName = await db.query(
                'SELECT id FROM projects WHERE LOWER(name) = LOWER($1) LIMIT 1',
                [projectName]
              );
              if (!existingProjectByName.rows[0]) {
                await db.query(
                  `INSERT INTO projects (name, type, status, progress, team, assets, due_date, budget, color)
                   VALUES ($1, $2, 'planning', 0, $3, 0, $4, $5, 'from-green-500 to-emerald-500')`,
                  [
                    projectName,
                    billingCycle === 'monthly' ? 'Retainer' : 'Proyecto',
                    ['PM', 'FIN'],
                    endDate || startDate,
                    conversionValue
                  ]
                );
                automations.push('Proyecto activado');
              }

              await db.query(
                `INSERT INTO admin_documents (name, type, client, status, author, content_markdown)
                 VALUES ($1, 'invoice', $2, 'issued', 'Sistema Financiero', $3)`,
                [
                  `Factura ${client.name} ${startDate}`,
                  client.name,
                  `# Factura LA MOVIE\n\nCliente: ${client.name}\nServicio: ${serviceName}\nValor: ${initialAmount} USD\nFecha: ${startDate}\nEstado: Emitida automáticamente por conversión.`
                ]
              );
              automations.push('Factura generada');

              await db.query(
                `INSERT INTO admin_tasks (title, description, priority, status, due_date)
                 VALUES ($1, $2, 'high', 'pending', $3)`,
                [
                  `Kickoff equipo - ${client.name}`,
                  `Pago registrado para ${serviceName}. Activar entregables, brief y agenda de producción.`,
                  startDate
                ]
              );
              automations.push('Equipo notificado por tarea');

              await db.query(
                `INSERT INTO admin_ai_logs (platform, event_type, payload, status)
                 VALUES ('finance', 'payment_automation', $1, 'success')`,
                [JSON.stringify({ transactionId: transaction.id, contractId: currentContract.id, automations })]
              );
            }
          }
        }
      }

      await db.query(
        `UPDATE admin_crm_clients
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             service = COALESCE($4, service),
             status = COALESCE($5, status),
             notes = COALESCE($6, notes),
             value = COALESCE($7, value),
             tag = COALESCE($8, tag),
             reminder = COALESCE($9, reminder),
             contract_start = COALESCE($10, contract_start),
             contract_end = COALESCE($11, contract_end),
             service_value = COALESCE($12, service_value),
             billing_cycle = COALESCE($13, billing_cycle)
         WHERE id = $14
         RETURNING *`,
        [
          String(client.name || serviceName),
          String(client.email || ''),
          String(client.phone || ''),
          serviceName,
          'converted',
          notes,
          conversionValue || client.value || 0,
          String(client.tag || ''),
          client.reminder ? String(client.reminder) : null,
          startDate || client.contract_start,
          endDate || null,
          conversionValue || client.service_value || 0,
          billingCycle || client.billing_cycle || 'monthly',
          client.id
        ]
      );

      await db.query('COMMIT');
      inTransaction = false;

      return res.status(200).json({
        clientId,
        contractId: contract.id,
        projectId: project.id,
        transaction,
        status: 'converted'
      });
    } catch (error) {
      if (inTransaction) {
        await db.query('ROLLBACK');
      }
      throw error;
    }
  } catch (error) {
    console.error('Client conversion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
