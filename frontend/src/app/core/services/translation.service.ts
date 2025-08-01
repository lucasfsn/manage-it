import { LanguageCode, LANGUAGES } from '@/app/config/language.config';
import { LANGUAGE_KEY } from '@/app/shared/constants/local-storage.constant';
import { Injectable, signal } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private language = signal<LanguageCode>(LanguageCode.EN);
  public loadedLanguage = this.language.asReadonly();

  public constructor(private translateService: TranslateService) {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);

    const defaultLanguage = storedLanguage
      ? this.storedUserLanguage(storedLanguage)
      : this.userPreferredLanguage();

    this.language.set(defaultLanguage);

    this.translateService.setDefaultLang(this.language());
    this.translateService.use(this.language());
    this.changeHtmlLang(this.language());
  }

  public changeLanguage(newLangCode: LanguageCode): void {
    this.translateService.use(newLangCode);
    this.language.set(newLangCode);
    this.changeHtmlLang(newLangCode);
    localStorage.setItem(LANGUAGE_KEY, newLangCode);
  }

  public translate(key: string, params?: Record<string, unknown>): string {
    return this.translateService.instant(key, params);
  }

  public get(key: string): Observable<string> {
    return this.translateService.get(key);
  }

  public onLanguageChange(): Observable<LangChangeEvent> {
    return this.translateService.onLangChange;
  }

  private storedUserLanguage(storedLanguage: string): LanguageCode {
    return (
      LANGUAGES.find((lang) => lang.code === (storedLanguage as LanguageCode))
        ?.code || LanguageCode.EN
    );
  }

  private userPreferredLanguage(): LanguageCode {
    return (
      LANGUAGES.find(
        (lang) =>
          lang.localeCode === navigator.language ||
          lang.code === navigator.language,
      )?.code || LanguageCode.EN
    );
  }

  private changeHtmlLang(lang: LanguageCode): void {
    document.documentElement.lang = lang;
  }
}
