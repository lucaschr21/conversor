// --- SELEÇÃO DOS ELEMENTOS DO DOM ---
const amountInput = document.getElementById('amount');
const currencyFromSelect = document.getElementById('currency-from');
const currencyToSelect = document.getElementById('currency-to');
const resultWrapper = document.getElementById('result-wrapper');
const swapButton = document.getElementById('swap-button');
const apiUrl = `/api/getCurrency`; 

let currencyRates = {};

async function setupConverter() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result === 'error') {
            showError('Erro ao buscar dados das moedas.');
            return;
        }

        currencyRates = data.conversion_rates;
        const currencies = Object.keys(currencyRates);

        populateCurrencySelects(currencies);
        convertCurrency();

    } catch (error) {
        showError('Não foi possível conectar ao serviço.');
        console.error('Erro ao configurar o conversor:', error);
    }
}

function populateCurrencySelects(currencies) {
    currencyFromSelect.innerHTML = '';
    currencyToSelect.innerHTML = '';

    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        currencyFromSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        currencyToSelect.appendChild(optionTo);
    });

    currencyFromSelect.value = 'USD';
    currencyToSelect.value = 'BRL';
}

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const currencyFrom = currencyFromSelect.value;
    const currencyTo = currencyToSelect.value;

    if (isNaN(amount) || !currencyRates[currencyFrom] || !currencyRates[currencyTo]) {
        return;
    }

    const amountInUSD = amount / currencyRates[currencyFrom];
    const convertedAmount = amountInUSD * currencyRates[currencyTo];
    
    const formattedResult = convertedAmount.toFixed(2);
    
    const baseRate = `1 ${currencyFrom} = ${(currencyRates[currencyTo] / currencyRates[currencyFrom]).toFixed(4)} ${currencyTo}`;
    resultWrapper.innerHTML = `
        <p class="result-amount">${formattedResult} ${currencyTo}</p>
        <p class="result-rate">${baseRate}</p>
    `;
}

function showError(message) {
    resultWrapper.innerHTML = `<p class="error">${message}</p>`;
}

amountInput.addEventListener('input', convertCurrency);
currencyFromSelect.addEventListener('change', convertCurrency);
currencyToSelect.addEventListener('change', convertCurrency);

swapButton.addEventListener('click', () => {
    const tempCurrency = currencyFromSelect.value;
    currencyFromSelect.value = currencyToSelect.value;
    currencyToSelect.value = tempCurrency;

    convertCurrency();
});

setupConverter();