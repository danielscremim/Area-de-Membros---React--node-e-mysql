const express = require('express');
const db = require('../db');

const router = express.Router();

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
      SELECT users.name, SUM(user_activity.points) AS total_points
      FROM user_activity
      JOIN users ON user_activity.user_id = users.id
      WHERE user_activity.watched_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
      GROUP BY users.id
      ORDER BY total_points DESC
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
  