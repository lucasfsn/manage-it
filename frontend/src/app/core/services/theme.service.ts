import { THEME_KEY } from '@/app/shared/constants/local-storage.constant';
import { Injectable, signal } from '@angular/core';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = signal<Theme>(Theme.DARK);
  public loadedTheme = this.theme.asReadonly();

  public constructor() {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme;

    if (this.isValidTheme(storedTheme)) {
      this.theme.set(storedTheme);
    } else {
      this.theme.set(this.detectThemePreference());
    }

    this.applyTheme(this.theme());
  }

  public changeTheme(): void {
    this.theme.update((curr) =>
      curr === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
    localStorage.setItem(THEME_KEY, this.theme());
  }

  public applyTheme(theme: Theme): void {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private isValidTheme(theme: Theme): boolean {
    return Object.values(Theme).includes(theme);
  }

  private detectThemePreference(): Theme {
    if (window.matchMedia('(prefers-color-scheme)').media === 'not all')
      return Theme.DARK;

    const preferredScheme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    return preferredScheme ? Theme.DARK : Theme.LIGHT;
  }
}
