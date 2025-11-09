import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

const ALL_CURRENCIES = [
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷', symbol: 'R$' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵', symbol: '¥' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺', symbol: '$' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦', symbol: '$' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭', symbol: 'Fr' },
  { code: 'GHF', name: 'Franco Suíaaço', flag: '🇨🇭', symbol: 'aFr' },
];

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './currency-selector.html',
  styleUrl: './currency-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySelector {
  public selectedCurrency = input.required<string>();
  public currencyChange = output<string>();

  public searchTerm = signal('');

  private allCurrencies = signal(ALL_CURRENCIES);

  public currencies = computed(() => {
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      return this.allCurrencies();
    }

    return this.allCurrencies().filter(
      (currency) =>
        currency.name.toLowerCase().includes(term) ||
        currency.code.toLowerCase().includes(term) ||
        currency.symbol.toLowerCase().includes(term)
    );
  });

  public selectCurrency(currencyCode: string): void {
    this.currencyChange.emit(currencyCode);
  }
}
