const { createClient } = require('redis');
const { XMLParser } = require('fast-xml-parser');
import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = async (request: VercelRequest, response: VercelResponse) => {
  const redis = createClient({ url: process.env['REDIS_URL'] });
  await redis.connect();

  try {
    const parser = new XMLParser();

    const moedasUnicasResponse = await fetch(
      'https://economia.awesomeapi.com.br/xml/available/uniq'
    );
    const moedasUnicasXML = await moedasUnicasResponse.text();
    const moedasUnicasObj = parser.parse(moedasUnicasXML);
    const moedasUnicasArray = Object.keys(moedasUnicasObj.xml).map((code) => ({
      code: code,
      name: moedasUnicasObj.xml[code],
    }));
    await redis.set('lista-moedas-unicas', JSON.stringify(moedasUnicasArray));

    const moedasParesResponse = await fetch('https://economia.awesomeapi.com.br/xml/available');
    const moedasParesXML = await moedasParesResponse.text();
    const moedasParesObj = parser.parse(moedasParesXML);
    const moedasParesArray = Object.keys(moedasParesObj.xml).map((code) => ({
      code: code,
      name: moedasParesObj.xml[code],
    }));
    await redis.set('lista-moedas-pares', JSON.stringify(moedasParesArray));

    const cotacoesResponse = await fetch('https://economia.awesomeapi.com.br/json/last/ALL');
    const cotacoesJson = await cotacoesResponse.json();
    await redis.set('cotacoes-atuais', JSON.stringify(cotacoesJson));

    return response.status(200).json({ message: 'Cache (listas e cotações) atualizado!' });
  } catch (error) {
    let errorMessage = 'Falha ao atualizar cache';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return response.status(500).json({ error: errorMessage });
  } finally {
    await redis.disconnect();
  }
};
