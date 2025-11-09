import { Component } from '@angular/core';
import { CurrencySelector } from '../../components/currency-selector/currency-selector';

@Component({
  selector: 'app-conversor',
  imports: [CurrencySelector],
  templateUrl: './conversor.html',
  styleUrl: './conversor.scss',
})
export class Conversor {}
