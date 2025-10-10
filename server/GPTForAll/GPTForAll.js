import 'dotenv/config';
import fs from 'fs/promises';
import express from 'express';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init Azure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
});

// Helper: evaluate poster
async function classifyAllWithGPT(fileName, origText, concept = null) {

  console.log(`classifyAllWithGPT called for file: ${fileName}`, origText);

  let img;

  const imgPath = path.resolve(__dirname, '../co-des_fitness/api/receivedImgs', fileName);
  console.log('Reading image from:', imgPath);

  try {

    const imgPath = path.resolve(__dirname, '../co-des_fitness/api/receivedImgs', fileName);
    console.log('Reading image from:', imgPath);
    img = await fs.readFile(imgPath);

  } catch (e) {
    throw new Error(`Image not found: ${fileName}`);
  }

  const b64 = img.toString('base64');

  const systemPrompt = `You are a design critic expert. Evaluate posters on:\n` +
    (origText ? `- Legibility of the provided text; how much of the original text (provided in the user prompt.) can be read (not if it's easy to read);  (For very long text blocks, it is ok if the text is small, since sometimes people must get closer to read this type of secondary info, so if a small text cannot be read from a distance, it's ok); in sum, if all the text can be identified, the evaluation is 1; if none of the text can be read, it's 0; half it's 0.5, etc...\n` : '') +
    `- Aesthetics; as 'great aesthetics' we consider the work of studios like R2design, Helmo, Pentagram, etc. i.e. contemporary, erudite, author studios, not very common stuff. for 'good aesthetics', we can consider more commercial examples, yet beautiful ones; good would be around 0.75\n` +
    `- Novelty vs common designs, i.e. how innovative/different/surprising from what exists out there\n` +
    `- The visual balance of the composition; notice that balance it's not necessarily putting everything in the centre; it's the visual harmony of the composition\n` +
    (concept ? `- How much does the poster visually resemble the concept: ${concept}\n` : "") +
    `- An overall score (the most important!!!) (DO NOT CONSIDER BALANCE TO COMPUTE  OVERALL SCORE; Aesthetics already includes balance) this\n` +
    `Return only a JSON with 0–1 scores for 'legibility', 'aesthetics', 'novelty', 'balance', 'concept' and, most importantly, 'overall'.\n` +
    `DO NOT return any text, only the JSON object with the mentioned keys!!! The response needs to be a valid JSON object!!!`;

  const userPrompt = `Original text to read:\n"""${origText}"""\n` +
    `Image (base64 PNG): data:image/png;base64,${b64}\n`;

  const resp = await openai.chat.completions.create({
    model: process.env.AZURE_DEPLOYMENT_NAME,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0
  });

  const txt = resp.choices[0].message.content;

  const match = txt.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in response');

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    throw new Error('Invalid JSON: ' + txt);
  }
}

// Express service
const app = express();
app.use(express.json());

/**
 * POST /classify_poster
 * body: { fileName: string, origText: string }
 * response: { legibility, aesthetics, novelty, overall }
 */
app.post('/classify_poster', async (req, res) => {
  const { fileName, origText } = req.body;

  console.log(`Received request to classify poster: ${fileName}`);

  if (typeof fileName !== 'string' || typeof origText !== 'string') {
    return res.status(400).json({ error: 'Invalid fileName or origText' });
  }

  try {
    const result = await classifyAllWithGPT(fileName, origText);
    res.json({
      legibility: result.legibility ?? null,
      aesthetics: result.aesthetics ?? null,
      novelty: result.novelty ?? null,
      balance: result.balance ?? null,
      concept: result.concept ?? null,
      overall: result.overall ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 9004;
app.listen(PORT, () => console.log(`Service listening at http://localhost:${PORT}`));
