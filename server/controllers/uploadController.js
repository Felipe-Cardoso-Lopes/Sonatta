const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // <-- USE A SERVICE ROLE AQUI
);

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo recebido.' });
    }

    const file = req.file;
    // Gerar nome seguro e sem espaços
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = `uploads/${uniqueSuffix}${ext}`;

    // Faz o upload do buffer diretamente
    const { data, error } = await supabase.storage
      .from('sonatta-storage') // Garanta que este é o nome exato do seu Bucket
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Erro no Bucket:', error);
      return res.status(500).json({ message: 'Falha ao salvar o arquivo na nuvem.' });
    }

    // Resgata a URL pública do arquivo
    const { data: publicUrlData } = supabase.storage
      .from('sonatta-storage')
      .getPublicUrl(fileName);

    const public_url = publicUrlData.publicUrl;

    return res.status(200).json({ 
      message: 'Upload concluído!', 
      url: public_url 
    });

  } catch (error) {
    console.error('Falha no controlador de Upload:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = { uploadFile };