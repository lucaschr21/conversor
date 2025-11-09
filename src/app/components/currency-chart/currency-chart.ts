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
  for (let i = 0; i < count; i++) {
    data.push(5 + Math.random() * 0.5 - (i < count / 2 ? Math.random() : -Math.random()));
  }

  return {
    labels: labels[period] || labels['1A'],
    datasets: [
      {
        label: 'Cotação',
        data: data,
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4,
      },
    ],
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

  public chartData = computed(() => {
    return generateMockData(this.selectedPeriod());
  });

  public chartOptions = signal({
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b',
        },
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#64748b',
        },
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
      },
    },
  });

  public endValue = computed(() => this.chartData().datasets[0].data.slice(-1)[0]);
  public percentChange = computed(() => (Math.random() - 0.2) * 10);
}
