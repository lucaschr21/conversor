import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CurrencySelector } from '../../components/currency-selector/currency-selector';
import { PopularRates } from '../../components/popular-rates/popular-rates';
import { CurrencyConverter } from '../../components/currency-converter/currency-converter';

@Component({
  selector: 'app-conversor',
  imports: [CurrencySelector, PopularRates, CurrencyConverter],
  templateUrl: './conversor.html',
  styleUrl: './conversor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversor {
  public baseCurrency = signal('USD');

  /**
   * Função que será chamada pelo output do CurrencySelector
   * @param currencyCode código da moeda (ex: 'BRL')
   */
  public onBaseCurrencyChange(currencyCode: string): void {
    this.baseCurrency.set(currencyCode);
  }
}
