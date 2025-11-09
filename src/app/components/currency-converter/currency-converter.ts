import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

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

const CURRENCIES = [
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭' },
];

interface Currency {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputNumberModule, Select],
  templateUrl: './currency-converter.html',
  styleUrl: './currency-converter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverter {
  public baseCurrency = input.required<string>();

  public currencies = signal<Currency[]>(CURRENCIES);
  public rates = signal(MOCK_RATES);

  public amount = signal(100);
  public targetCurrencyCode = signal('BRL');

  public baseCurrencyData = computed(() => {
    return this.currencies().find((c) => c.code === this.baseCurrency());
  });

  public convertedAmount = computed(() => {
    const base = this.baseCurrency();
    const target = this.targetCurrencyCode();
    const allRates = this.rates();

    const baseRate = allRates[base] || 1;
    const targetRate = allRates[target] || 1;

    const result = (this.amount() / baseRate) * targetRate;
    return result;
  });

  public exchangeRate = computed(() => {
    const base = this.baseCurrency();
    const target = this.targetCurrencyCode();
    const allRates = this.rates();

    const baseRate = allRates[base] || 1;
    const targetRate = allRates[target] || 1;

    return (1 / baseRate) * targetRate;
  });
}
