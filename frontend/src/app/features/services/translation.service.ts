import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Language,
  LanguageCode,
  LanguageLabelKey,
  Locale,
} from '../dto/translation.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public currentLanguage: LanguageCode = LanguageCode.EN;
  public languages: Language[] = [
    { code: LanguageCode.EN, labelKey: LanguageLabelKey.EN, locale: Locale.EN },
    { code: LanguageCode.PL, labelKey: LanguageLabelKey.PL, locale: Locale.PL },
  ];

  public constructor(private translateService: TranslateService) {
    const storedLanguage = localStorage.getItem('language');
    if (this.isLanguageCode(storedLanguage))
      this.currentLanguage = storedLanguage as LanguageCode;

    this.translateService.setDefaultLang(this.currentLanguage);
    this.translateService.use(this.currentLanguage);
  }

  public changeLanguage(lang: LanguageCode): void {
    this.translateService.use(lang);
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
  }

  public translate(key: string): string {
    return this.translateService.instant(key);
  }

  public getLanguageLabel(key: LanguageLabelKey): string {
    return this.translateService.instant(key);
  }

  public get currentSetLanguage(): Language | undefined {
    return this.languages.find((lang) => lang.code === this.currentLanguage);
  }

  private isLanguageCode(value: string | null): value is LanguageCode {
    return Object.values(LanguageCode).includes(value as LanguageCode);
  }
}
