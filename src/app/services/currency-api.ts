import { Injectable } from '@angular/core';

const ALL_CURRENCIES = [
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'JPY', name: 'Iene Japonês' },
  { code: 'AUD', name: 'Dólar Australiano' },
  { code: 'CAD', name: 'Dólar Canadense' },
  { code: 'CHF', name: 'Franco Suíço' },
];

const POPULAR_PAIRS: { [key: string]: string[] } = {
  USD: ['EUR', 'BRL', 'GBP', 'JPY'],
  EUR: ['USD', 'BRL', 'GBP', 'JPY'],
  BRL: ['USD', 'EUR', 'GBP', 'JPY'],
  GBP: ['USD', 'EUR', 'BRL', 'JPY'],
  JPY: ['USD', 'EUR', 'BRL', 'GBP'],
  DEFAULT: ['EUR', 'BRL', 'GBP', 'JPY'],
};

const MOCK_RATES: { [key: string]: number } = {
  USD: 1.0,
  EUR: 0.93,
  BRL: 5.45,
  GBP: 0.81,
  JPY: 151.2,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.91,
};

@Injectable({
  providedIn: 'root',
})
export class CurrencyApi {
  public getUniqueCurrencies() {
    return ALL_CURRENCIES;
  }

  public getPopularPairs() {
    return POPULAR_PAIRS;
  }

  public getRates() {
    return MOCK_RATES;
  }

  constructor() {}
}
