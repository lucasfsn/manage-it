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
    const storedTheme = localStorage.getItem('theme') as Theme;

    if (this.isValidTheme(storedTheme)) this.theme.set(storedTheme);
  }

  public changeTheme(): void {
    this.theme.update((curr) =>
      curr === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
    localStorage.setItem('theme', this.theme());
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
