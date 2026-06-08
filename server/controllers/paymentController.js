const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const db = require('../config/db');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// ========================
// Task 6.1 — Checkout
// ========================
const createCheckoutSession = async (req, res) => {
  const { plan_id } = req.body;
  const escola = req.user;

  if (!plan_id) {
    return res.status(400).json({ message: 'O plan_id é obrigatório.' });
  }

  try {
    const result = await db.query('SELECT * FROM plans WHERE id = $1', [plan_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado.' });
    }

    const plan = result.rows[0];
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: String(plan.id),
            title: plan.name,
            quantity: 1,
            unit_price: Number(plan.price),
            currency_id: 'BRL',
          },
        ],
        payer: { email: escola.email },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
          failure: `${process.env.FRONTEND_URL}/pagamento/falha`,
          pending: `${process.env.FRONTEND_URL}/pagamento/pendente`,
        },
        auto_return: 'approved',
        external_reference: `inst_${escola.id}_plan_${plan.name}`,
        notification_url: `${process.env.API_URL}/api/payments/webhook`,
      },
    });

    return res.status(201).json({
      checkout_url: response.init_point,
      sandbox_url: response.sandbox_init_point,
      preference_id: response.id,
    });

  } catch (error) {
    console.error('[createCheckoutSession] Erro:', error);
    return res.status(500).json({ message: 'Erro interno ao criar sessão de pagamento.' });
  }
};

// ========================
// Tasks 6.2 e 6.3 — Webhook
// ========================
const handleWebhook = async (req, res) => {
  const { type, data } = req.body;

  if (type !== 'payment') {
    return res.sendStatus(200);
  }

  try {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: data.id });

    const { status, external_reference } = paymentData;

    const match = external_reference.match(/^inst_(.+)_plan_(.+)$/);

    if (!match) {
      console.error('[handleWebhook] external_reference inválido:', external_reference);
      return res.sendStatus(200);
    }

    const instituicaoId = match[1];
    const planName = match[2];

    // Task 6.3 — Mapeamento completo de status
    const statusMap = {
      approved:  'ativo',
      pending:   'pendente',
      rejected:  'inadimplente',
      cancelled: 'cancelado',
    };

    const novoStatus = statusMap[status];

    if (!novoStatus) {
      console.log(`[handleWebhook] Status ignorado: ${status}`);
      return res.sendStatus(200);
    }

    // end_date só avança quando o pagamento é aprovado
    const endDate = novoStatus === 'ativo' ? "NOW() + INTERVAL '1 year'" : 'end_date';

    await db.query(
      `INSERT INTO subscriptions (instituicao_id, plan_name, status, start_date, end_date, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), ${endDate}, NOW(), NOW())
       ON CONFLICT (instituicao_id)
       DO UPDATE SET
         plan_name  = $2,
         status     = $3,
         end_date   = ${endDate},
         updated_at = NOW()`,
      [instituicaoId, planName, novoStatus]
    );

    console.log(`📋 Assinatura atualizada — Instituição: ${instituicaoId}, Status: ${novoStatus}`);
    return res.sendStatus(200);

  } catch (error) {
    console.error('[handleWebhook] Erro ao processar notificação:', error);
    return res.sendStatus(200);
  }
};

// ========================
// Feature 22 - Dashboard Financeiro
// ========================
const getInstitutionFinancialSummary = async (req, res) => {
  const instId = req.user.instituicao_id;
  try {
    // Faturamento Líquido do Mês Atual
    const currentMonthResult = await db.query(`
      SELECT COALESCE(SUM(net_value), 0) as total 
      FROM institution_transactions 
      WHERE instituicao_id = $1 
      AND status = 'paid' 
      AND date_trunc('month', payment_date) = date_trunc('month', CURRENT_DATE)
    `, [instId]);

    // Repasses Pendentes
    const pendingResult = await db.query(`
      SELECT COALESCE(SUM(net_value), 0) as total 
      FROM institution_transactions 
      WHERE instituicao_id = $1 AND status = 'pending'
    `, [instId]);

    res.json({
      currentMonthRevenue: parseFloat(currentMonthResult.rows[0].total),
      pendingTransfers: parseFloat(pendingResult.rows[0].total),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar resumo financeiro.' });
  }
};

const getInstitutionTransactions = async (req, res) => {
  const instId = req.user.instituicao_id;
  const { startDate, endDate, status } = req.query;

  let query = 'SELECT * FROM institution_transactions WHERE instituicao_id = $1';
  const params = [instId];
  let paramIndex = 2;

  if (startDate) { query += ` AND payment_date >= $${paramIndex++}`; params.push(startDate); }
  if (endDate) { query += ` AND payment_date <= $${paramIndex++}`; params.push(`${endDate} 23:59:59`); }
  if (status && status !== 'all') { query += ` AND status = $${paramIndex++}`; params.push(status); }

  query += ' ORDER BY payment_date DESC LIMIT 100'; // Paginação simplificada (limite 100)

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar transações.' });
  }
};

module.exports = { createCheckoutSession, handleWebhook, getInstitutionFinancialSummary, getInstitutionTransactions };