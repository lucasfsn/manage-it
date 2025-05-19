import {
  Language,
  LanguageCode,
  LANGUAGES,
} from '@/app/config/language.config';
import { Theme, ThemeService } from '@/app/core/services/theme.service';
import { AuthService } from '@/app/features/services/auth.service';
import { ThemeToggleComponent } from '@/app/shared/components/theme-toggle/theme-toggle.component';
import { TranslationService } from '@/app/shared/services/translation.service';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    ThemeToggleComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected languages: Language[] = LANGUAGES;

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private themeService: ThemeService,
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
      this.translationService.translate('toast.success.LOGOUT'),
    );
  }

  protected changeLanguage(language: Language): void {
    this.translationService.changeLanguage(language.code);
  }

  protected languageText(code: LanguageCode): string {
    return this.translationService.translate(
      `header.LANGUAGE_${code.toUpperCase()}`,
    );
  }
}
