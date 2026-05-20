const multer = require('multer');

// Configuração do armazenamento em memória
// Usamos memoryStorage para não salvar no disco local, facilitando o envio direto para o Supabase
const storage = multer.memoryStorage();

// Filtro opcional para garantir que apenas certos tipos de ficheiros sejam aceitos
const fileFilter = (req, file, cb) => {
  // Exemplo: Aceitar apenas imagens e PDFs
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Envie apenas JPG, PNG, WEBP ou PDF.'), false);
  }
};

// Inicialização do middleware Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de tamanho definido para 5MB (pode ajustar conforme a necessidade)
  }
});

module.exports = upload;