import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'app-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);

  #theme = signal<Theme>(this.getInitialTheme());

  public theme = this.#theme.asReadonly();

  constructor() {
    effect(() => {
      const newTheme = this.#theme();
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      this.applyTheme(newTheme);
    });
  }

  public toggleTheme(): void {
    this.#theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  private applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      this.document.documentElement.classList.add('app-dark');
    } else {
      this.document.documentElement.classList.remove('app-dark');
    }
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }

    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return prefersDark ? 'dark' : 'light';
  }
}
