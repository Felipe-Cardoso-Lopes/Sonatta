const supabase = require('../config/db');

// Rota 1: Receita Gerada (Consolidação de Assinaturas)
exports.getRevenueReport = async (req, res) => {
  try {
    // Busca todas as assinaturas ativas. 
    // Nota: Adapte os nomes das colunas de preço/plano conforme a sua tabela real.
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('plan_name, status')
      .eq('status', 'ativo');

    if (error) throw error;

    // Tabela de preços fixa para o cálculo (ou busque da tabela saas_plans se existir)
    const planPrices = {
      'Basic': 199.90,
      'Pro': 499.90,
      'Enterprise': 999.90
    };

    let totalRevenue = 0;
    const revenueByPlan = {};

    subscriptions.forEach(sub => {
      const price = planPrices[sub.plan_name] || 0;
      totalRevenue += price;
      
      if (!revenueByPlan[sub.plan_name]) {
        revenueByPlan[sub.plan_name] = 0;
      }
      revenueByPlan[sub.plan_name] += price;
    });

    res.status(200).json({
      totalRevenue,
      revenueByPlan,
      activeSubscriptions: subscriptions.length
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de receita:', error);
    res.status(500).json({ error: 'Falha ao processar dados de receita.' });
  }
};

// Rota 2: Aulas dadas por Professor
exports.getTeacherPerformanceReport = async (req, res) => {
  try {
    // Busca os professores e cruza com a tabela de cursos/aulas
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        teacher_id,
        users!inner(name)
      `);

    if (error) throw error;

    // Consolidando os dados: Quantidade de cursos/aulas por professor
    const performance = courses.reduce((acc, course) => {
      const teacherId = course.teacher_id;
      const teacherName = course.users?.name || 'Professor Desconhecido';

      if (!acc[teacherId]) {
        acc[teacherId] = {
          teacherName,
          totalCourses: 0,
          coursesList: []
        };
      }

      acc[teacherId].totalCourses += 1;
      acc[teacherId].coursesList.push(course.title);
      
      return acc;
    }, {});

    // Converte o objeto resultante em um array para facilitar a leitura no frontend
    const reportData = Object.values(performance).sort((a, b) => b.totalCourses - a.totalCourses);

    res.status(200).json(reportData);

  } catch (error) {
    console.error('Erro ao gerar relatório de performance:', error);
    res.status(500).json({ error: 'Falha ao processar dados dos professores.' });
  }
};