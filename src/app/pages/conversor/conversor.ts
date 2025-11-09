import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CurrencySelector } from '../../components/currency-selector/currency-selector';
import { PopularRates } from '../../components/popular-rates/popular-rates';

@Component({
  selector: 'app-conversor',
  imports: [CurrencySelector, PopularRates],
  templateUrl: './conversor.html',
  styleUrl: './conversor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversor {
  public baseCurrency = signal('USD');

  /**
   * Função que será chamada pelo output do CurrencySelector
   * @param currencyCode O novo código da moeda (ex: 'BRL')
   */
  public onBaseCurrencyChange(currencyCode: string): void {
    this.baseCurrency.set(currencyCode);
  }
}
