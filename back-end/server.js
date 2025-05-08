const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

//Armazenamento temporário dos slots
const slots = {};

//Função que chama a IA local do Ollama
async function gerarTreinoOllama(prompt) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "mistral", // ou 'llama3' se for o modelo que você baixou
      prompt: prompt,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error("Erro ao chamar Ollama:", error.message);
    throw new Error("Falha ao gerar treino com a IA.");
  }
}

//Rota para gerar treino direto
app.post('/gerar-treino', async (req, res) => {
  const { peso, altura, objetivo, experiencia, equipamentos } = req.body;

  if (!peso || !altura || !objetivo || !experiencia) {
    return res.status(400).json({
      erro: "Preencha todos os campos obrigatórios: peso, altura, objetivo e experiência."
    });
  }

  const prompt = `
Crie uma rotina de treino personalizada com base nos seguintes dados:
- Peso: ${peso} kg
- Altura: ${altura} cm
- Objetivo: ${objetivo}
- Experiência: ${experiencia}
- Equipamentos disponíveis: ${Array.isArray(equipamentos) ? equipamentos.join(', ') : 'Nenhum'}

Forneça um plano semanal com exercícios, séries e repetições.
`.trim();

  try {
    const treino = await gerarTreinoOllama(prompt);
    res.json({ treino });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//Criar um Slot de Treino
app.post('/criar-slot', async (req, res) => {
  const { id, peso, altura, objetivo, experiencia, equipamentos } = req.body;

  if (!id || !peso || !altura || !objetivo || !experiencia) {
    return res.status(400).json({
      erro: "Campos obrigatórios faltando. Inclua um ID único para o slot e os dados do treino."
    });
  }

  const prompt = `
Crie uma rotina de treino personalizada com base nos seguintes dados:
- Peso: ${peso} kg
- Altura: ${altura} cm
- Objetivo: ${objetivo}
- Experiência: ${experiencia}
- Equipamentos disponíveis: ${Array.isArray(equipamentos) ? equipamentos.join(', ') : 'Nenhum'}

Forneça um plano semanal com exercícios, séries e repetições.
`.trim();

  try {
    const treino = await gerarTreinoOllama(prompt);
    slots[id] = treino;
    res.json({ mensagem: `Slot '${id}' criado com sucesso!`, treino });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//Acessar um Slot de Treino por ID
app.get('/slot/:id', (req, res) => {
  const { id } = req.params;

  if (!slots[id]) {
    return res.status(404).json({ erro: `Slot '${id}' não encontrado.` });
  }

  res.json({ slot: id, treino: slots[id] });
});

//Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
