const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173' // Permite chamadas do front
}));
app.use(express.json());

// Armazenamento temporário dos treinos
const slots = {};

// Conexão com banco (caso use mais tarde)
const mysql = require('mysql2/promise');
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Rota simples de teste
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Conexão feita com sucesso!' });
});

// Teste de conexão com banco
app.get('/api/testar-banco', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ sucesso: true, mensagem: 'Conexão com o banco bem-sucedida!', dados: rows });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// Função que chama a IA Ollama
async function gerarTreinoOllama(prompt) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt,
      stream: false
    });
    console.log('✅ Treino gerado com sucesso!');
    return response.data.response;
  } catch (error) {
    console.error("❌ Erro ao chamar Ollama:", error.message);
    throw new Error("Falha ao gerar treino com a IA.");
  }
}

// Rota principal: cria um slot de treino
app.post('/criar-slot', async (req, res) => {
  const { id, nomeSlot, peso, altura, objetivo, experiencia, equipamentos } = req.body;

  if (!id || !peso || !altura || !objetivo || !experiencia) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando." });
  }

const prompt = `
Crie um treino focado em ${nomeSlot}, com base nos seguintes dados:
- Peso: ${peso} kg
- Altura: ${altura} cm
- Objetivo: ${objetivo}
- Experiência: ${experiencia}
- Equipamentos disponíveis: ${Array.isArray(equipamentos) ? equipamentos.join(', ') : 'Nenhum'}

Forneça uma rotina completa de exercícios, séries e repetições focada em ${nomeSlot}.
`.trim();


  try {
    const treino = await gerarTreinoOllama(prompt);
    slots[id] = treino;
    console.log(`🔄 Slot ${id} criado com sucesso.`);
    res.json({ mensagem: `Slot '${id}' criado com sucesso!`, treino });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Acessar um treino salvo
app.get('/slot/:id', (req, res) => {
  const { id } = req.params;
  if (!slots[id]) {
    return res.status(404).json({ erro: `Slot '${id}' não encontrado.` });
  }
  res.json({ slot: id, treino: slots[id] });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://18.210.183.73:${PORT}`);
});
