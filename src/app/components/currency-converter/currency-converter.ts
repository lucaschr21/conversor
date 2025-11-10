import { ChangeDetectionStrategy, Component, computed, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

import { CurrencyApi, Cotacoes } from '../../services/currency-api';

interface MoedaUnica {
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

  public rates = toSignal(this.currencyApi.getRates(), {
    initialValue: {} as Cotacoes,
  });

  public currencies = computed<MoedaUnica[]>(() => {
    const rates = this.rates();
    const codes = Object.keys(rates);
    const currencyList = codes.map((code) => {
      const name = rates[code].name.split('/')[0];
      return { code: code, name: name };
    });
    if (!rates['BRL']) {
      currencyList.push({ code: 'BRL', name: 'Real Brasileiro' });
    }
    return currencyList.sort((a, b) => a.code.localeCompare(b.code));
  });

  public amount = signal(100);
  public targetCurrencyCode = signal('BRL');

  public baseCurrencyData = computed(() => {
    return this.currencies().find((c) => c.code === this.baseCurrency());
  });

  public exchangeRate = computed(() => {
    const base = this.baseCurrency();
    const target = this.targetCurrencyCode();
    const allRates = { ...this.rates() };

    if (Object.keys(allRates).length === 0) return 0;

    if (target === 'BRL') {
      if (base === 'BRL') return 1;
      if (allRates[base]) return parseFloat(allRates[base].bid);
      return 0;
    }

    if (base === 'BRL') {
      if (allRates[target]) return 1 / parseFloat(allRates[target].bid);
      return 0;
    }

    if (!allRates[base] || !allRates[target]) return 0;

    const baseRateToBRL = parseFloat(allRates[base].bid);
    const targetRateToBRL = parseFloat(allRates[target].bid);

    if (targetRateToBRL === 0) return 0;
    return baseRateToBRL / targetRateToBRL;
  });

  public convertedAmount = computed(() => {
    return this.amount() * this.exchangeRate();
  });
}
