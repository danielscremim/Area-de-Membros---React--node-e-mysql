const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');
const rankingRoutes = require('./routes/ranking');
const testRoutes = require('./routes/test');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para JSON

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/test', testRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.send('API da Área de Membros está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
