import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CurrencyApi, Cotacoes } from '../../services/currency-api';

interface PopularPairRate {
  base: string;
  target: string;
  rate: number;
  change: number;
}

const POPULAR_TARGETS: { [key: string]: string[] } = {
  USD: ['EUR', 'BRL', 'GBP', 'JPY'],
  EUR: ['USD', 'BRL', 'GBP', 'JPY'],
  BRL: ['USD', 'EUR', 'GBP', 'ARS'],
  GBP: ['USD', 'EUR', 'BRL', 'JPY'],
  JPY: ['USD', 'EUR', 'BRL', 'GBP'],
  DEFAULT: ['EUR', 'BRL', 'GBP', 'JPY'],
};

@Component({
  selector: 'app-popular-rates',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './popular-rates.html',
  styleUrl: './popular-rates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularRates {
  public baseCurrency = input.required<string>();
  private currencyApi = inject(CurrencyApi);

  public rates = toSignal(this.currencyApi.getRates(), {
    initialValue: {} as Cotacoes,
  });

  public popularPairs = computed<PopularPairRate[]>(() => {
    const base = this.baseCurrency();
    const allRates = { ...this.rates() };

    if (Object.keys(allRates).length === 0) {
      return [];
    }

    if (base === 'BRL' && !allRates['BRL']) {
      allRates['BRL'] = { bid: '1.0', pctChange: '0' } as any;
    }

    const targets = POPULAR_TARGETS[base] || POPULAR_TARGETS['DEFAULT'];
    const pairs: PopularPairRate[] = [];

    const baseRateData = allRates[base];
    if (!baseRateData) return [];

    const baseRateToBRL = parseFloat(baseRateData.bid);

    for (const target of targets) {
      if (target === 'BRL') {
        if (base === 'BRL') continue;
        pairs.push({
          base: base,
          target: 'BRL',
          rate: baseRateToBRL,
          change: parseFloat(baseRateData.pctChange),
        });
        continue;
      }

      const targetRateData = allRates[target];
      if (!targetRateData) continue;

      const targetRateToBRL = parseFloat(targetRateData.bid);
      if (targetRateToBRL === 0) continue;

      pairs.push({
        base: base,
        target: target,
        rate: baseRateToBRL / targetRateToBRL,
        change: parseFloat(targetRateData.pctChange),
      });
    }
    return pairs;
  });
}
