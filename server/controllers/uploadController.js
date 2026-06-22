const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // <-- USE A SERVICE ROLE AQUI
);

const uploadFile = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: 'Nome e tipo do arquivo são obrigatórios.' });
    }

    // Gerar nome seguro e sem espaços
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(fileName);
    const safeFileName = `uploads/${uniqueSuffix}${ext}`;

    // Solicita a URL pré-assinada de upload direto (Presigned URL)
    const { data, error } = await supabase.storage
      .from('sonatta-storage') // Garanta que este é o nome exato do seu Bucket
      .createSignedUploadUrl(safeFileName);

    if (error) {
      console.error('Erro no Bucket ao gerar URL assinada:', error);
      return res.status(500).json({ message: 'Falha ao gerar permissão de upload na nuvem.' });
    }

    // Resgata a URL pública do arquivo (ela só funcionará após o Frontend realizar o PUT)
    const { data: publicUrlData } = supabase.storage
      .from('sonatta-storage')
      .getPublicUrl(safeFileName);

    const public_url = publicUrlData.publicUrl;

    return res.status(200).json({ 
      message: 'URL temporária gerada com sucesso!', 
      signedUrl: data.signedUrl,
      token: data.token,
      url: public_url 
    });

  } catch (error) {
    console.error('Falha no controlador de Upload:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = { uploadFile };