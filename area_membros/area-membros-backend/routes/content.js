const express = require('express');
const db = require('../db');

const router = express.Router();

// Adicionar Conteúdo
router.post('/add', (req, res) => {
  const { title, type, url } = req.body;

  db.query(
    'INSERT INTO content (title, type, url) VALUES (?, ?, ?)',
    [title, type, url],
    (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Erro ao adicionar conteúdo.' });
      }
      res.status(201).json({ message: 'Conteúdo adicionado com sucesso!' });
    }
  );
});

// Listar Conteúdo
router.get('/list', (req, res) => {
  db.query('SELECT * FROM content', (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao listar conteúdo.' });
    }
    res.json(results);
  });
});

module.exports = router;