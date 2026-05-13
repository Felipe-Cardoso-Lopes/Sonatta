const { MercadoPagoConfig, Preference } = require('mercadopago');
const db = require('../config/db');

// Inicializa o cliente do Mercado Pago com o token do .env
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const createCheckoutSession = async (req, res) => {
  const { plan_id } = req.body;
  const escola = req.user; // Vem do middleware de autenticação (protect)

  // 1. Validação básica
  if (!plan_id) {
    return res.status(400).json({ message: 'O plan_id é obrigatório.' });
  }

  try {
    // 2. Busca o plano no banco de dados
    const result = await db.query(
      'SELECT * FROM plans WHERE id = $1',
      [plan_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado.' });
    }

    const plan = result.rows[0];

    // 3. Cria a preferência de pagamento no Mercado Pago
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: String(plan.id),
            title: plan.name,          // ex: "Plano Básico", "Plano Pro"
            quantity: 1,
            unit_price: Number(plan.price), // deve ser número, ex: 99.90
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: escola.email, // email do usuário autenticado
        },
        // URLs de redirecionamento após o pagamento
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
          failure: `${process.env.FRONTEND_URL}/pagamento/falha`,
          pending: `${process.env.FRONTEND_URL}/pagamento/pendente`,
        },
        auto_return: 'approved',
        // Referência externa para identificar o pedido no seu sistema
        external_reference: `escola_${escola.id}_plano_${plan.id}`,
        // Webhook para receber notificações de pagamento (Task futura)
        notification_url: `${process.env.API_URL}/api/payments/webhook`,
      },
    });

    // 4. Retorna a URL do checkout para o frontend redirecionar
    return res.status(201).json({
      checkout_url: response.init_point,       // URL de produção
      sandbox_url: response.sandbox_init_point, // URL de teste
      preference_id: response.id,
    });

  } catch (error) {
    console.error('[paymentController] Erro ao criar sessão de checkout:', error);
    return res.status(500).json({ message: 'Erro interno ao criar sessão de pagamento.' });
  }
};

module.exports = { createCheckoutSession };