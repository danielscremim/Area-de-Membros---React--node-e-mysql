const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

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
    if (err) {
      console.error('Erro ao fazer login:', err.message);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }

    if (results.length === 0) {
      console.error('Usuário não encontrado.');
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const user = results[0];
    console.log('Usuário encontrado:', user);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isValidPassword);

    if (!isValidPassword) {
      console.error('Credenciais inválidas.');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    try {
      console.log('JWT_SECRET:', process.env.JWT_SECRET); // Adicione este log
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não está definido');
      }
      // console.log('Gerando token para o usuário:', user.id);
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login bem-sucedido!', token });
    } catch (err) {
      console.error('Erro ao gerar token:', err.message);
      return res.status(500).json({ error: 'Erro ao gerar token.' });
    }
  });
});

// Rota para obter dados do usuário autenticado
router.get('/me', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  db.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.userId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao obter dados do usuário.' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
