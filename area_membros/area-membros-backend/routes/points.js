const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add', (req, res) => {
  const { userId, lessonId, points } = req.body;

  const query = 'INSERT INTO user_activity (user_id, lesson_id, points, watched_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [userId, lessonId, points], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao registrar pontos.' });
    }
    res.status(201).json({ message: 'Pontos registrados com sucesso!' });
  });
});

module.exports = router;