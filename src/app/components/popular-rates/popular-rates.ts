import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

const MOCK_RATES: { [key: string]: number } = {
  USD: 1.0,
  EUR: 0.93,
  BRL: 5.45,
  GBP: 0.81,
  JPY: 151.2,
};

const POPULAR_PAIRS: { [key: string]: string[] } = {
  USD: ['EUR', 'BRL', 'GBP', 'JPY'],
  EUR: ['USD', 'BRL', 'GBP', 'JPY'],
  BRL: ['USD', 'EUR', 'GBP', 'JPY'],
  GBP: ['USD', 'EUR', 'BRL', 'JPY'],
  JPY: ['USD', 'EUR', 'BRL', 'GBP'],
  DEFAULT: ['EUR', 'BRL', 'GBP', 'JPY'],
};

const FLAGS: { [key: string]: string } = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  BRL: '🇧🇷',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
};

interface PopularPair {
  base: string;
  target: string;
  baseFlag: string;
  targetFlag: string;
  rate: number;
  change: number; // Mock
}

@Component({
  selector: 'app-popular-rates',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './popular-rates.html',
  styleUrl: './popular-rates.scss',
})
export class PopularRates {
  public baseCurrency = input.required<string>();

  public flags = FLAGS;

  public popularPairs = computed<PopularPair[]>(() => {
    const base = this.baseCurrency();
    const targets = POPULAR_PAIRS[base] || POPULAR_PAIRS['DEFAULT'];

    return targets.map((target) => {
      const baseRate = MOCK_RATES[base] || 1;
      const targetRate = MOCK_RATES[target] || 1;

      return {
        base: base,
        target: target,
        baseFlag: FLAGS[base] || '🏳️',
        targetFlag: FLAGS[target] || '🏳️',
        rate: targetRate / baseRate,
        change: (Math.random() - 0.5) * 2,
      };
    });
  });
}
