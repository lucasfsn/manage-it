import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Theme, ThemeService } from '@/app/core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatIconModule, CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
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
}
