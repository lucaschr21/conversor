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
import { toSignal } from '@angular/core/rxjs-interop';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { CurrencyApi, Cotacoes } from '../../services/currency-api';

interface MoedaUnica {
  code: string;
  name: string;
}

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

  private allRates = toSignal(this.currencyApi.getRates(), {
    initialValue: {} as Cotacoes,
  });

  private allCurrencies = computed<MoedaUnica[]>(() => {
    const rates = this.allRates();
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

  public selectCurrency(currencyCode: string): void {
    this.currencyChange.emit(currencyCode);
  }
}
