import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { CurrencyApi } from '../../services/currency-api';

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

  private currencyApi = inject(CurrencyApi);

  public searchTerm = signal('');

  private allCurrencies = signal(this.currencyApi.getUniqueCurrencies());

  public currencies = computed(() => {
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      return this.allCurrencies();
    }

    return this.allCurrencies().filter(
      (currency) =>
        currency.name.toLowerCase().includes(term) || currency.code.toLowerCase().includes(term)
    );
  });

  /**
   * Emite o evento de mudança de moeda.
   * @param currencyCode O código da moeda (ex: 'USD')
   */
  public selectCurrency(currencyCode: string): void {
    this.currencyChange.emit(currencyCode);
  }
}
