const multer = require('multer');

// Utilizamos a memória para tratar o buffer antes de enviar ao Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Lista de formatos aceitos (Imagens, Documentos e Vídeos curtos)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'video/mp4'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato inválido. Envie PDF, DOCX, JPG, PNG ou MP4.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 MB
  fileFilter: fileFilter
});

// Middleware de tratamento de erros
const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Arquivo muito grande. O limite é de 10MB.' });
      }
      return res.status(400).json({ message: `Erro no upload: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = uploadMiddleware;