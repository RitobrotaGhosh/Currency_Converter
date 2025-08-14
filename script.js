// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const swapButton = document.getElementById('swap-button');
const resultContainer = document.getElementById('result-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

// API Base
const API_BASE_URL = 'https://api.frankfurter.app';

// Populate currencies
const populateCurrencies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/currencies`);
        if (!response.ok) throw new Error('Failed to load currencies.');
        
        const currencies = await response.json();
        
        for (const currencyCode in currencies) {
            const optionFrom = document.createElement('option');
            optionFrom.value = currencyCode;
            optionFrom.textContent = `${currencyCode} - ${currencies[currencyCode]}`;
            fromCurrencySelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currencyCode;
            optionTo.textContent = `${currencyCode} - ${currencies[currencyCode]}`;
            toCurrencySelect.appendChild(optionTo);
        }

        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';

        convertCurrency();
    } catch (error) {
        showError(error.message);
    }
};

// Convert currency
const convertCurrency = async () => {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    hideError();
    resultContainer.innerHTML = '<div class="loader"></div>';

    if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount.');
        resultContainer.innerHTML = '';
        return;
    }
    
    if (fromCurrency === toCurrency) {
        displayResult(amount, fromCurrency, amount, toCurrency);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
        if (!response.ok) throw new Error('Conversion rate not available.');
        
        const data = await response.json();
        const convertedAmount = data.rates[toCurrency];
        
        displayResult(amount, fromCurrency, convertedAmount, toCurrency);
    } catch (error) {
        showError(error.message);
        resultContainer.innerHTML = '';
    }
};

// Display result
const displayResult = (amount, from, convertedAmount, to) => {
    resultContainer.innerHTML = `
        <div class="result-flip">
            <p class="text-lg text-gray-300">${amount.toLocaleString()} ${from} =</p>
            <p class="text-4xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">${convertedAmount.toLocaleString()} ${to}</p>
        </div>
    `;
};

// Error handling
const showError = (message) => {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
};

const hideError = () => {
    errorContainer.classList.add('hidden');
};

// Swap currencies
const swapCurrencies = () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency();
};

// Event Listeners
document.addEventListener('DOMContentLoaded', populateCurrencies);
amountInput.addEventListener('input', convertCurrency);
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);
