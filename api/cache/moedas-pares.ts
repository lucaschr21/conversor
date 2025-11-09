const { createClient } = require('redis');
import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = async (request: VercelRequest, response: VercelResponse) => {
  const redis = createClient({ url: process.env['REDIS_URL'] });
  await redis.connect();

  try {
    const paresString = await redis.get('lista-moedas-pares');

    if (!paresString) {
      return response.status(404).json({ error: 'Cache ainda não populado.' });
    }

    const paresJson = JSON.parse(paresString);
    return response.status(200).json(paresJson);
  } catch (error) {
    let errorMessage = 'Falha ao buscar moedas pares';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return response.status(500).json({ error: errorMessage });
  } finally {
    await redis.disconnect();
  }
};
