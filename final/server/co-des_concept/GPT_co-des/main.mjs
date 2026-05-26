import "dotenv/config";
import OpenAI from "openai";
import express from "express";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
});

app.post("/similarity_gpt", async (req, res) => {
  const { labels, keywords } = req.body;
  console.log("Received Request", keywords, labels.length);

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_DEPLOYMENT_NAME, // Azure usa deployment como "modelo"
    messages: [
      {
        role: "system",
        content: "Responda apenas com um JSON que relacione cada palavra com um valor de 0 a 1 (três casas decimais).", // O JSON deve ter o seguinte formato: {palavra1: {probToRun: valor}, palavra2: {probToRun: valor}, ...}",
      },
      {
        role: "user",
        content: `Quão relacionadas estão as palavras ${labels.join(", ")} com o conceito: "${keywords.join(", ")}"?`,
      },
    ],
  });

  //gerado pelo GPT
  /*const response = await openai.chat.completions.create({
    model: process.env.AZURE_DEPLOYMENT_NAME,
    messages: [
      {
        role: "system",
        content: `
Responda apenas com um JSON com o seguinte formato:

{
  "palavra1": { "probToRun": 0.123 },
  "palavra2": { "probToRun": 0.456 },
  ...
}

Regras obrigatórias:
- Apenas JSON, sem explicações ou comentários.
- Os valores devem estar entre 0 e 1 (inclusive), com exatamente 3 casas decimais.
- Todas as palavras devem estar presentes no JSON.
- Use aspas em todas as chaves e valores string.

Exemplo de resposta válida:

{
  "água": { "probToRun": 0.812 },
  "fogo": { "probToRun": 0.132 },
  "vento": { "probToRun": 0.520 }
}
      `.trim(),
      },
      {
        role: "user",
        content: `Quão relacionadas estão as palavras ${labels.join(", ")} com o conceito: "${keywords.join(", ")}"?`
      },
    ],
    temperature: 0, // para garantir consistência e evitar devaneios
  });
*/

  console.log("Got a result");
  const ratings = response.choices[0].message.content;
  console.log("RESULT:", ratings);
  let jsonRatings = parseJSON(ratings);

  if (!jsonRatings) {
    console.error("Resposta inválida do modelo. Conteúdo:", ratings);
    return res.status(400).json({ error: "Resposta inválida do modelo" });
  }

  Object.entries(jsonRatings).forEach(([key, value]) => {
    jsonRatings[key] = { probToRun: value };
  });
  res.json(jsonRatings);

});

app.listen(9003, () => console.log("Servidor a correr em http://localhost:9003"));


function parseJSON(input) {
  if (typeof input === 'object' && input !== null) return input;

  try {
    // Remove possível texto antes/depois do JSON
    const match = input.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("Erro a fazer parse do JSON:", e);
    return null;
  }
}

