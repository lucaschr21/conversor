// /api/getCurrency.js
// Este é o código do nosso backend (Serverless Function).
// Ele roda em um ambiente Node.js na Vercel, não no navegador.

export default async function handler(request, response) {
  // Pegamos a chave de API das Environment Variables da Vercel (seguro)
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  
  // A URL base da API que vamos chamar. Usamos 'latest/USD' como um ponto de partida
  // para obter todas as taxas de câmbio em relação ao dólar.
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  try {
    // Fazemos a chamada para a API de moedas do lado do servidor
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    // Se a chamada para a API externa falhar, repassamos o erro
    if (data.result === 'error') {
      return response.status(500).json({ error: 'Erro ao buscar dados da API externa.' });
    }

    // Configurando Headers para permitir o acesso de qualquer origem (CORS)
    // Essencial para que o nosso frontend possa chamar esta API
    response.setHeader('Access-Control-Allow-Origin', '*');
    
    // Enviamos os dados recebidos da API como resposta para o nosso frontend
    response.status(200).json(data);

  } catch (error) {
    // Em caso de um erro de rede ou outro problema, enviamos uma mensagem genérica
    response.status(500).json({ error: 'Falha ao conectar com o serviço de câmbio.' });
  }
}