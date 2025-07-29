const apiUrl = `/api/getCurrency`; 

const amountInput = document.getElementById('amount');
const currencyFromSelect = document.getElementById('currency-from');
const currencyToSelect = document.getElementById('currency-to');
const resultWrapper = document.getElementById('result-wrapper');
const swapButton = document.getElementById('swap-button');

// Função principal de conversão
async function convertCurrency() {
    const amount = amountInput.value;
    const currencyFrom = currencyFromSelect.value;
    const currencyTo = currencyToSelect.value;

    console.log('Convertendo...');
    console.log('Valor:', amount);
    console.log('De:', currencyFrom);
    console.log('Para:', currencyTo);
    
}

amountInput.addEventListener('input', convertCurrency);
currencyFromSelect.addEventListener('change', convertCurrency);
currencyToSelect.addEventListener('change', convertCurrency);

convertCurrency();