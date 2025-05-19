import { Language, LANGUAGES, LocaleCode } from '@/app/config/language.config';
import { TranslationService } from '@/app/shared/services/translation.service';
import { DatePipe as DatePipeBase } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  pure: false,
})
export class DatePipe implements PipeTransform {
  private datePipe = new DatePipeBase(LocaleCode.EN);
  private languages: Language[] = LANGUAGES;

  public constructor(private translationService: TranslationService) {}

  public transform(
    value: Date | string | number | null,
    format: string = 'mediumDate',
  ): string | null {
    if (!value) return null;

    const language = this.translationService.loadedLanguage();

    const locale =
      this.languages.find((lang) => lang.code === language)?.localeCode ||
      LocaleCode.EN;

    this.datePipe = new DatePipeBase(locale);

    return this.datePipe.transform(value, format);
  }
}
