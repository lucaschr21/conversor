import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CurrencyApi, DadosHistoricosItem } from '../../services/currency-api';
import { switchMap } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

type Period = '1S' | '1M' | '1A' | '5A';

@Component({
  selector: 'app-currency-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ChartModule, SelectButtonModule],
  providers: [DatePipe],
  templateUrl: './currency-chart.html',
  styleUrl: './currency-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyChart {
  public baseCurrency = input.required<string>();
  private currencyApi = inject(CurrencyApi);
  private datePipe = inject(DatePipe);

  public periodOptions = signal([
    { label: '1 Semana', value: '1S' },
    { label: '1 Mês', value: '1M' },
    { label: '1 Ano', value: '1A' },
    { label: '5 Anos', value: '5A' },
  ]);
  public selectedPeriod = signal<Period>('1A');

  private chartParams = computed(() => {
    const base = this.baseCurrency();
    const periodo = this.selectedPeriod();

    let par = `${base}-BRL`;
    if (base === 'BRL') {
      par = 'BRL-USD';
    }

    return { par, periodo };
  });

  private historicalData$ = toObservable(this.chartParams).pipe(
    switchMap(({ par, periodo }) => this.currencyApi.getHistoricalData(par, periodo))
  );

  private historicalData = toSignal(this.historicalData$, {
    initialValue: [] as DadosHistoricosItem[],
  });

  public chartInfo = computed(() => {
    const data = this.historicalData();
    if (!data || data.length === 0) {
      return {
        chartData: { labels: [], datasets: [] },
        endValue: 0,
        percentChange: 0,
        isPositive: false,
      };
    }

    const dataReversed = [...data].reverse();

    const labels: string[] = [];
    const values: number[] = [];
    const periodo = this.selectedPeriod();

    dataReversed.forEach((item) => {
      const date = new Date(parseInt(item.timestamp) * 1000);
      let label = '';

      if (periodo === '1S' || periodo === '1M') {
        label = this.datePipe.transform(date, 'dd/MM') ?? '';
      } else if (periodo === '1A') {
        label = this.datePipe.transform(date, 'MMM/yy') ?? '';
      } else {
        label = this.datePipe.transform(date, 'yyyy') ?? '';
      }

      labels.push(label);
      values.push(parseFloat(item.bid));
    });

    const startValue = values[0] || 0;
    const endValue = values[values.length - 1] || 0;
    const percentChange = startValue > 0 ? ((endValue - startValue) / startValue) * 100 : 0;
    const isPositive = percentChange >= 0;
    const lineColor = isPositive ? '#10b981' : '#ef4444';

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Cotação',
          data: values,
          fill: false,
          borderColor: lineColor,
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };

    return {
      chartData,
      endValue,
      percentChange,
      isPositive,
    };
  });

  public chartOptions = signal({
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
      },
    },
  });
}
