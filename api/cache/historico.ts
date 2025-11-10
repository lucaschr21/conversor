const { createClient } = require('redis');
import type { VercelRequest, VercelResponse } from '@vercel/node';

const periodToDaysMap = {
  '1S': 7,
  '1M': 30,
  '6M': 180,
  '1A': 360,
};

type SimplePeriod = keyof typeof periodToDaysMap;

const CACHE_EXPIRATION_SECONDS = 43200;

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

async function fetchSimpleData(par: string, periodo: string) {
  const days = periodToDaysMap[periodo as SimplePeriod] || 30;
  const url = `https://economia.awesomeapi.com.br/json/daily/${par}/${days}`;

  const apiRes = await fetch(url);
  if (!apiRes.ok) {
    throw new Error(`Falha na AwesomeAPI (Simples): ${apiRes.statusText}`);
  }
  return apiRes.json();
}

async function fetchMultiYearData(par: string, years: number) {
  const promises = [];
  const today = new Date();

  for (let i = 0; i < years; i++) {
    const endDate = new Date(today);
    endDate.setFullYear(today.getFullYear() - i);

    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - (i + 1));

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    const url = `https://economia.awesomeapi.com.br/json/daily/${par}/366/?start_date=${startStr}&end_date=${endStr}`;

    promises.push(fetch(url).then((res) => res.json()));
  }

  const results = await Promise.all(promises);

  return results.flat();
}

module.exports = async (request: VercelRequest, response: VercelResponse) => {
  const { par, periodo } = request.query;
  if (!par || !periodo || typeof par !== 'string' || typeof periodo !== 'string') {
    return response.status(400).json({ error: 'Parâmetros "par" e "periodo" são obrigatórios.' });
  }

  const cacheKey = `hist:${par}:${periodo}`;
  const redis = createClient({ url: process.env['REDIS_URL'] });
  await redis.connect();

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      await redis.disconnect();
      return response.status(200).json(JSON.parse(cachedData));
    }

    let dataToCache = [];

    if (periodo === '5A') {
      dataToCache = await fetchMultiYearData(par, 5);
    } else if (periodo === '10A') {
      dataToCache = await fetchMultiYearData(par, 10);
    } else {
      dataToCache = await fetchSimpleData(par, periodo);
    }

    if (dataToCache && dataToCache.length > 0) {
      await redis.setEx(cacheKey, CACHE_EXPIRATION_SECONDS, JSON.stringify(dataToCache));
    }

    return response.status(200).json(dataToCache);
  } catch (error) {
    let errorMessage = 'Falha ao buscar dados históricos';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (redis.isOpen) await redis.disconnect();
    return response.status(500).json({ error: errorMessage });
  } finally {
    if (redis.isOpen) await redis.disconnect();
  }
};
