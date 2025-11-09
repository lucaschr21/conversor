import { ChangeDetectionStrategy, Component, computed, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

import { CurrencyApi } from '../../services/currency-api';

interface Currency {
  code: string;
  name: string;
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

  private currencyApi = inject(CurrencyApi);

  public currencies = signal<Currency[]>(this.currencyApi.getUniqueCurrencies());
  public rates = signal(this.currencyApi.getRates());

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
