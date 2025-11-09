import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

import { CurrencyApi } from '../../services/currency-api';

interface PopularPair {
  base: string;
  target: string;
  rate: number;
  change: number;
}

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

  public popularPairs = computed<PopularPair[]>(() => {
    const base = this.baseCurrency();

    const allRates = this.currencyApi.getRates();
    const allPairs = this.currencyApi.getPopularPairs();

    const targets = allPairs[base] || allPairs['DEFAULT'];

    return targets.map((target) => {
      const baseRate = allRates[base] || 1;
      const targetRate = allRates[target] || 1;

      return {
        base: base,
        target: target,
        rate: targetRate / baseRate,
        change: (Math.random() - 0.5) * 2,
      };
    });
  });
}
