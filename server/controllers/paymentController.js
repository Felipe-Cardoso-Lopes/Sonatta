const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const db = require('../config/db');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

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

const handleWebhook = async (req, res) => {
  const { type, data } = req.body;

  if (type !== 'payment') {
    return res.sendStatus(200);
  }

  try {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: data.id });

    const { status, external_reference } = paymentData;

    // ex: "inst_7ea2d3fd-e700-4d2b-84aa-30b3..._plan_Pro"
    const match = external_reference.match(/^inst_(.+)_plan_(.+)$/);

    if (!match) {
      console.error('[handleWebhook] external_reference inválido:', external_reference);
      return res.sendStatus(200);
    }

    const instituicaoId = match[1]; // uuid
    const planName = match[2];      // "Pro", "Basic", "Enterprise"

    if (status === 'approved') {
      await db.query(
        `INSERT INTO subscriptions (instituicao_id, plan_name, status, start_date, end_date, created_at, updated_at)
         VALUES ($1, $2, 'ativo', NOW(), NOW() + INTERVAL '1 year', NOW(), NOW())
         ON CONFLICT (instituicao_id)
         DO UPDATE SET
           plan_name  = $2,
           status     = 'ativo',
           start_date = NOW(),
           end_date   = NOW() + INTERVAL '1 year',
           updated_at = NOW()`,
        [instituicaoId, planName]
      );

      console.log(`✅ Assinatura ativada — Instituição: ${instituicaoId}, Plano: ${planName}`);
    }

    return res.sendStatus(200);

  } catch (error) {
    console.error('[handleWebhook] Erro ao processar notificação:', error);
    return res.sendStatus(200);
  }
};

module.exports = { createCheckoutSession, handleWebhook };