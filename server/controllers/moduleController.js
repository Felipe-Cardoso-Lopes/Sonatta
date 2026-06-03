const db = require('../config/db');

// --- MÓDULOS (F17) ---
const getModules = async (req, res) => {
  const { courseId } = req.params;
  try {
    const modules = await db.query('SELECT * FROM modules WHERE course_id = $1 ORDER BY order_index ASC', [courseId]);
    
    // Busca as aulas (classes) e documentos para cada módulo
    for (let mod of modules.rows) {
      const classes = await db.query('SELECT * FROM module_classes WHERE module_id = $1 ORDER BY order_index ASC', [mod.id]);
      
      for (let cls of classes.rows) {
         const docs = await db.query('SELECT * FROM class_documents WHERE class_id = $1', [cls.id]);
         cls.documents = docs.rows;
      }
      mod.classes = classes.rows;
    }
    res.json(modules.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar módulos.' });
  }
};

const createModule = async (req, res) => {
  const { courseId } = req.params;
  const { title, order_index } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO modules (course_id, title, order_index) VALUES ($1, $2, $3) RETURNING *',
      [courseId, title, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Erro ao criar módulo.' }); }
};

const deleteModule = async (req, res) => {
  const { moduleId } = req.params;
  try {
    await db.query('DELETE FROM modules WHERE id = $1', [moduleId]);
    res.json({ message: 'Módulo removido.' });
  } catch (err) { res.status(500).json({ message: 'Erro ao deletar módulo.' }); }
};

// --- ATUALIZAR MÓDULO ---
const updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const { title } = req.body;
  try {
    const result = await db.query(
      'UPDATE modules SET title = $1 WHERE id = $2 RETURNING *',
      [title, moduleId]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Erro ao atualizar módulo.' }); }
};

// --- AULAS GRAVADAS (F18a) ---
const createClass = async (req, res) => {
  const { moduleId } = req.params;
  const { title, description, video_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO module_classes (module_id, title, description, video_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [moduleId, title, description, video_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Erro ao criar aula.' }); }
};

// --- ATUALIZAR E DELETAR AULAS GRAVADAS ---
const updateClass = async (req, res) => {
  const { classId } = req.params;
  const { title, description, video_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE module_classes SET title=$1, description=$2, video_url=$3 WHERE id=$4 RETURNING *',
      [title, description, video_url, classId]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Erro ao atualizar aula.' }); }
};

const deleteClass = async (req, res) => {
  const { classId } = req.params;
  try {
    await db.query('DELETE FROM module_classes WHERE id = $1', [classId]);
    res.json({ message: 'Aula removida.' });
  } catch (err) { res.status(500).json({ message: 'Erro ao deletar aula.' }); }
};

// --- DOCUMENTOS (F18b) ---
const addDocument = async (req, res) => {
  const { classId } = req.params;
  const { name, url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO class_documents (class_id, name, url) VALUES ($1, $2, $3) RETURNING *',
      [classId, name, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Erro ao adicionar doc.' }); }
};

// --- DELETAR DOCUMENTO ---
const deleteDocument = async (req, res) => {
  const { documentId } = req.params;
  try {
    await db.query('DELETE FROM class_documents WHERE id = $1', [documentId]);
    res.json({ message: 'Documento removido.' });
  } catch (err) { res.status(500).json({ message: 'Erro ao deletar documento.' }); }
};

module.exports = { getModules, createModule, deleteModule, updateModule, createClass, updateClass, deleteClass, addDocument, deleteDocument };