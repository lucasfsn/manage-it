import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Theme, ThemeService } from '../../../features/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  public constructor(private themeService: ThemeService) {}

  protected get Theme(): typeof Theme {
    return Theme;
  }

  protected get theme(): Theme {
    return this.themeService.loadedTheme();
  }

  protected toggleTheme(): void {
    this.themeService.changeTheme();
  }

  // private updateDocumentClass(theme: Theme) {
  //   if (theme === Theme.DARK) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }
}
