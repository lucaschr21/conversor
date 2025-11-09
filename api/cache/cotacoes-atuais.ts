const { createClient } = require('redis');
import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = async (request: VercelRequest, response: VercelResponse) => {
  const redis = createClient({ url: process.env['REDIS_URL'] });
  await redis.connect();

  try {
    const cotacoesString = await redis.get('cotacoes-atuais');

    if (!cotacoesString) {
      return response.status(404).json({ error: 'Cache de cotações ainda não populado.' });
    }

    const cotacoesJson = JSON.parse(cotacoesString);
    return response.status(200).json(cotacoesJson);
  } catch (error) {
    let errorMessage = 'Falha ao buscar cotações';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return response.status(500).json({ error: errorMessage });
  } finally {
    await redis.disconnect();
  }
};
