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

export interface DadosHistoricosItem {
  bid: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyApi {
  private http = inject(HttpClient);

  private apiUrl = '/api/cache';

  constructor() {}

  /**
   * Busca as cotações atuais (vs BRL) do cache.
   * Ex: {"USD": {...}, "EUR": {...}}
   */
  public getRates(): Observable<Cotacoes> {
    return this.http.get<Cotacoes>(`${this.apiUrl}/cotacoes-atuais`);
  }

  /**
   * Busca dados históricos para um par e período.
   * Ex: ('USD-BRL', '1A')
   */
  public getHistoricalData(par: string, periodo: string): Observable<DadosHistoricosItem[]> {
    return this.http.get<DadosHistoricosItem[]>(`${this.apiUrl}/historico`, {
      params: {
        par: par,
        periodo: periodo,
      },
    });
  }
}
