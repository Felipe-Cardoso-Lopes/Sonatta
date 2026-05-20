const { createClient } = require('@supabase/supabase-js');

// Inicializa o cliente do Supabase com as suas variáveis de ambiente
// Certifique-se de que SUPABASE_URL e SUPABASE_KEY (anon ou service_role) estão no seu ficheiro .env
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws'); // 1. Importa o ws

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_KEY || 'placeholder-key',
  {
    // 2. Força o uso do 'ws' caso o ambiente seja Node.js (evita o erro do WebSocket)
    realtime: {
      transport: WebSocket
    }
  }
);

exports.uploadFile = async (req, res) => {
  try {
    // O ficheiro foi anexado aqui pelo middleware do Multer
    const file = req.file; 

    if (!file) {
      return res.status(400).json({ message: 'Nenhum ficheiro foi fornecido na requisição.' });
    }

    // 1. Gera um nome único para evitar colisão de ficheiros com o mesmo nome
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
    const filePath = `uploads/${uniqueFileName}`;

    // 2. Envia o buffer da memória RAM diretamente para o Supabase Storage
    // ATENÇÃO: Substitua 'sonatta-bucket' pelo nome real do bucket que criar no painel do Supabase
    const { data, error } = await supabase.storage
      .from('sonatta-bucket')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // Define para true se quiser que ficheiros com o mesmo nome sejam substituídos
      });

    if (error) {
      throw error;
    }

    // 3. Recupera a URL pública do ficheiro recém-carregado
    const { data: publicUrlData } = supabase.storage
      .from('sonatta-bucket')
      .getPublicUrl(filePath);

    // 4. Devolve a URL ao frontend (o frontend pode então decidir onde salvar esta URL, ex: perfil do usuário)
    res.status(200).json({
      message: 'Ficheiro enviado com sucesso!',
      url: publicUrlData.publicUrl
    });

  } catch (error) {
    console.error('Erro ao processar upload para o Supabase:', error);
    res.status(500).json({ message: 'Erro interno no servidor durante o upload.' });
  }
};