export default async function handler(request, response) {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  try {
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    if (data.result === 'error') {
      return response.status(500).json({ error: 'Erro ao buscar dados da API externa.' });
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    
    response.status(200).json(data);

  } catch (error) {
    response.status(500).json({ error: 'Falha ao conectar com o serviço de câmbio.' });
  }
}