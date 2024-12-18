const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Rota de usuários');
});

// Registro de Usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Erro ao registrar o usuário.' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    }
  );
});

// Login de Usuário
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login realizado com sucesso!', token });
  });
});

module.exports = router;
