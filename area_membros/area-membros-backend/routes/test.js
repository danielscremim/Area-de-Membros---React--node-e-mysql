const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao testar conexão com o banco de dados.' });
    }
    res.json({ solution: results[0].solution });
  });
});

module.exports = router;