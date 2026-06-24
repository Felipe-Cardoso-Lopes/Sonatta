const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Se as chaves estiverem faltando no Render, isso evitará que o servidor caia
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo recebido pelo backend.' });
    }

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'As chaves do Supabase não estão configuradas no Render.' });
    }

    const file = req.file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = `uploads/${uniqueSuffix}${ext}`;

    const { data, error } = await supabase.storage
      .from('sonatta-storage') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Erro detalhado do Supabase:', error);
      // Aqui a mágica: enviando o erro real do Supabase para o frontend ver!
      return res.status(500).json({ 
        message: 'Falha ao salvar no Bucket.', 
        detalhe: error.message 
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('sonatta-storage')
      .getPublicUrl(fileName);

    return res.status(200).json({ 
      message: 'Upload concluído!', 
      url: publicUrlData.publicUrl 
    });

  } catch (error) {
    console.error('Falha no controlador de Upload:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', detalhe: error.message });
  }
};

module.exports = { uploadFile };