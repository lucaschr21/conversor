const { createClient } = require('redis');
import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = async (request: VercelRequest, response: VercelResponse) => {
  const redis = createClient({ url: process.env['REDIS_URL'] });
  await redis.connect();

  try {
    const moedasString = await redis.get('lista-moedas-unicas');

    if (!moedasString) {
      return response.status(404).json({ error: 'Cache ainda não populado.' });
    }

    const moedasJson = JSON.parse(moedasString);
    return response.status(200).json(moedasJson);
  } catch (error) {
    let errorMessage = 'Falha ao buscar moedas únicas';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return response.status(500).json({ error: errorMessage });
  } finally {
    await redis.disconnect();
  }
};
