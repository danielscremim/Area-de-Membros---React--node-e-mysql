const express = require('express');
const router = express.Router();
const db = require('../db');

// Ranking semanal
router.get('/weekly', (req, res) => {
    const query = `
      SELECT u.id, u.name, COUNT(ua.id) AS total_views
      FROM user_activity ua
      JOIN users u ON ua.user_id = u.id
      WHERE YEARWEEK(ua.watched_at, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY u.id
      ORDER BY total_views DESC
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Erro ao calcular ranking semanal.' });
      }
      res.json(results);
    });
  });
  
  // Ranking mensal
  router.get('/monthly', (req, res) => {
    const query = `
      SELECT u.id, u.name, COUNT(ua.id) AS total_views
      FROM user_activity ua
      JOIN users u ON ua.user_id = u.id
      WHERE MONTH(ua.watched_at) = MONTH(CURDATE()) AND YEAR(ua.watched_at) = YEAR(CURDATE())
      GROUP BY u.id
      ORDER BY total_views DESC
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Erro ao calcular ranking mensal.' });
      }
      res.json(results);
    });
  });

module.exports = router;
  