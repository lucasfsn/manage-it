import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  Language,
  LanguageCode,
  LANGUAGES,
} from '../../config/language.config';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private language = signal<Language>(LANGUAGES[0]);

  public loadedLanguage = this.language.asReadonly();

  public constructor(private translateService: TranslateService) {
    const storedLanguage = localStorage.getItem('language');

    const language = LANGUAGES.find(
      (lang) => lang.code === (storedLanguage as LanguageCode)
    );

    if (language) this.language.set(language);

    this.translateService.setDefaultLang(this.language().code);
    this.translateService.use(this.language().code);
  }

  public changeLanguage(language: Language): void {
    this.translateService.use(language.code);
    this.language.set(language);
    localStorage.setItem('language', language.code);
  }

  public translate(key: string): string {
    return this.translateService.instant(key);
  }

  public get(key: string): Observable<string> {
    return this.translateService.get(key);
  }
}
