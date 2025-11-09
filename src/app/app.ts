import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('conversor');
  public themeService = inject(ThemeService);
  // 4. Expõe o signal de tema para o template
  public theme = this.themeService.theme;

  /**
   * Chama a função de toggle do serviço.
   */
  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
