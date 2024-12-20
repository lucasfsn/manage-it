import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../features/services/auth.service';
import { TranslationService } from '../../../features/services/translation.service';
import {
  Language,
  LanguageCode,
  LanguageLabelKey,
} from '../../../language.config';

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
export class HeaderComponent implements OnInit {
  protected currentLanguage?: LanguageCode;
  protected languages?: Language[];

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {}

  protected get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  protected logout(): void {
    this.authService.logout();
    this.toastrService.success(
      this.translationService.translate('toast.success.LOGOUT')
    );
  }

  protected changeLanguage(languageCode: LanguageCode): void {
    this.translationService.changeLanguage(languageCode);
    this.currentLanguage = languageCode;
  }

  protected languageText(labelKey: LanguageLabelKey): string {
    return this.translationService.getLanguageLabel(labelKey);
  }

  public ngOnInit(): void {
    this.currentLanguage = this.translationService.currentLanguage;
    this.languages = this.translationService.languages;
  }
}
