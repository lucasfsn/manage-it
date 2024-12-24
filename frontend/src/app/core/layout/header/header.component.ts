import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  Language,
  LanguageHeaderLabelKey,
  LANGUAGES,
} from '../../../config/language.config';
import { AuthService } from '../../../features/services/auth.service';
import { TranslationService } from '../../../features/services/translation.service';

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
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected languages: Language[] = LANGUAGES;

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {}

  protected get language(): Language {
    return this.translationService.loadedLanguage();
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
    this.translationService.changeLanguage(language);
  }

  protected languageText(labelKey: LanguageHeaderLabelKey): string {
    return this.translationService.translate(labelKey);
  }
}
