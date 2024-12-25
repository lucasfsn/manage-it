import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  Language,
  LanguageCode,
  LANGUAGES,
} from '../../../config/language.config';
import { AuthService } from '../../../features/services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { Theme, ThemeService } from '../../services/theme.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected languages: Language[] = LANGUAGES;

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private themeService: ThemeService
  ) {}

  protected get language(): LanguageCode {
    return this.translationService.loadedLanguage();
  }

  protected get isDarkTheme(): boolean {
    return this.themeService.loadedTheme() === Theme.DARK;
  }

  protected get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  protected logout(): void {
    this.authService.logout();
    this.toastrService.success(
      this.translationService.translate('toast.success.LOGOUT')
    );
  }

  protected changeLanguage(language: Language): void {
    this.translationService.changeLanguage(language.code);
  }

  protected languageText(code: LanguageCode): string {
    return this.translationService.translate(
      `header.LANGUAGE_${code.toUpperCase()}`
    );
  }
}
