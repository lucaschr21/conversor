import {
  ChangeDetectionStrategy,
  Component,
  createNgModule,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

const MOCK_CURRENCIES = [
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭' },
];

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './currency-selector.html',
  styleUrl: './currency-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySelector {
  public selectedCurrency = input.required<string>();

  public currencyChange = output<string>();

  public currencies = MOCK_CURRENCIES;

  /**
   * Emite o evento de mudança de moeda.
   * @param currencyCode O código da moeda (ex: 'USD')
   */
  public selectCurrency(currencyCode: string): void {
    this.currencyChange.emit(currencyCode);
  }
}
