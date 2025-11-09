import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

type Period = '1S' | '1M' | '1A' | '5A';

function generateMockData(period: Period) {
  const dataPoints = { '1S': 7, '1M': 30, '1A': 12, '5A': 60 };
  const labels = {
    '1S': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    '1M': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    '1A': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    '5A': ['2021', '2022', '2023', '2024', '2025'],
  };

  const data = [];
  const count = labels[period].length;
  let baseValue = 5.0;

  for (let i = 0; i < count; i++) {
    const trend = (Math.random() - 0.48) * 0.1;
    baseValue += trend;
    data.push(Math.max(0, baseValue + (Math.random() - 0.5) * 0.2));
  }

  return {
    labels: labels[period] || labels['1A'],
    data: data,
  };
}

@Component({
  selector: 'app-currency-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ChartModule, SelectButtonModule],
  templateUrl: './currency-chart.html',
  styleUrl: './currency-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyChart {
  public baseCurrency = input.required<string>();

  public periodOptions = signal([
    { label: '1 Semana', value: '1S' },
    { label: '1 Mês', value: '1M' },
    { label: '1 Ano', value: '1A' },
    { label: '5 Anos', value: '5A' },
  ]);

  public selectedPeriod = signal<Period>('1A');

  public chartInfo = computed(() => {
    const mock = generateMockData(this.selectedPeriod());

    const startValue = mock.data[0] || 0;
    const endValue = mock.data[mock.data.length - 1] || 0;
    const percentChange = startValue > 0 ? ((endValue - startValue) / startValue) * 100 : 0;
    const isPositive = percentChange >= 0;

    const lineColor = isPositive ? '#10b981' : '#ef4444';

    const chartData = {
      labels: mock.labels,
      datasets: [
        {
          label: 'Cotação',
          data: mock.data,
          fill: false,
          borderColor: lineColor,
          tension: 0.4,
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
