import { THEME_KEY } from '@/app/shared/constants/local-storage.constants';
import { Injectable, signal } from '@angular/core';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME = THEME_KEY;
  private theme = signal<Theme>(Theme.DARK);

  public loadedTheme = this.theme.asReadonly();

  public constructor() {
    const storedTheme = localStorage.getItem(this.THEME) as Theme;

    if (this.isValidTheme(storedTheme)) this.theme.set(storedTheme);
  }

  public changeTheme(): void {
    this.theme.update((curr) =>
      curr === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
    localStorage.setItem(this.THEME, this.theme());
  }

  private isValidTheme(theme: Theme): boolean {
    return Object.values(Theme).includes(theme);
  }

  public applyTheme(theme: Theme): void {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
