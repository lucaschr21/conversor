import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Cotacao {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export interface Cotacoes {
  [par: string]: Cotacao;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyApi {
  private http = inject(HttpClient);
  private apiUrl = '/api/cache/cotacoes-atuais';

  constructor() {}

  public getRates(): Observable<Cotacoes> {
    return this.http.get<Cotacoes>(this.apiUrl);
  }
}
