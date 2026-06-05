const supabase = require('../config/db');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

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

// ROTA 3: Geração de Fatura em PDF (Streaming)
exports.exportInvoicePDF = async (req, res) => {
  try {
    // 1. Configura os cabeçalhos para forçar o download do PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="fatura_sonatta.pdf"');

    // 2. Cria o documento PDF
    const doc = new PDFDocument({ margin: 50 });

    // 3. Conecta o stream do PDF diretamente à resposta HTTP (res)
    doc.pipe(res);

    // 4. Monta o layout do PDF
    doc.fontSize(20).font('Helvetica-Bold').text('Fatura de Assinatura - Sonatta', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica').text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`);
    doc.text('Cliente: Conservatório Harmonia'); // Aqui você pode puxar do banco dinamicamente
    doc.text('CNPJ: 00.000.000/0001-00');
    doc.moveDown();

    doc.rect(50, 150, 500, 2).fill('#3b82f6'); // Linha azul de separação
    doc.moveDown(3);

    doc.fillColor('black').text('Descrição do Serviço:', { underline: true });
    doc.text('Assinatura Mensal - Plano Pro (Até 500 alunos) ......... R$ 499,90');
    
    doc.moveDown(5);
    doc.fontSize(10).fillColor('gray').text('Este documento é gerado automaticamente pelo sistema Sonatta.', { align: 'center' });

    // 5. Finaliza a construção e envia o stream
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    // Caso a resposta já tenha começado a ser enviada, não podemos mandar JSON de erro
    if (!res.headersSent) {
      res.status(500).json({ error: 'Falha ao gerar o PDF da fatura.' });
    }
  }
};

// ROTA 4: Exportação de Lista de Alunos em CSV
exports.exportStudentsCSV = async (req, res) => {
  try {
    // 1. Busca os alunos no banco de dados
    const { data: students, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('role', 'aluno');

    if (error) throw error;

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Nenhum aluno encontrado para exportação.' });
    }

    // 2. Formata os dados (opcional, para deixar a data amigável no Excel)
    const formattedData = students.map(student => ({
      ID: student.id,
      Nome: student.name,
      Email: student.email,
      'Data de Cadastro': new Date(student.created_at).toLocaleDateString('pt-BR')
    }));

    // 3. Configura o parser do JSON para CSV
    const fields = ['ID', 'Nome', 'Email', 'Data de Cadastro'];
    const opts = { fields, delimiter: ';' }; // Delimitador ';' é melhor lido pelo Excel em português
    const parser = new Parser(opts);
    const csv = parser.parse(formattedData);

    // 4. Configura os cabeçalhos para o download do arquivo
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="lista_alunos_sonatta.csv"');

    // 5. Envia o arquivo CSV (usando o BOM do UTF-8 para o Excel reconhecer acentos corretamente)
    res.status(200).send('\uFEFF' + csv);

  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({ error: 'Falha ao exportar a lista de alunos.' });
  }
};