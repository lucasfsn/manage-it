import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LanguageCode, LANGUAGES } from '../../config/language.config';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly LANGUAGE = environment.storageKeys.LANGUAGE;
  private language = signal<LanguageCode>(LanguageCode.EN);

  public loadedLanguage = this.language.asReadonly();

  public constructor(private translateService: TranslateService) {
    const storedLanguage = localStorage.getItem(this.LANGUAGE);

    const language = LANGUAGES.find(
      (lang) => lang.code === (storedLanguage as LanguageCode)
    );

    if (language) this.language.set(language.code);

    this.translateService.setDefaultLang(this.language());
    this.translateService.use(this.language());
  }

  public changeLanguage(newLangCode: LanguageCode): void {
    this.translateService.use(newLangCode);
    this.language.set(newLangCode);
    localStorage.setItem(this.LANGUAGE, newLangCode);
  }

  public translate(key: string): string {
    return this.translateService.instant(key);
  }

  public get(key: string): Observable<string> {
    return this.translateService.get(key);
  }
}
