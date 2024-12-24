import { DatePipe as DatePipeBase } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Locale } from '../../config/language.config';
import { TranslationService } from '../../features/services/translation.service';

@Pipe({
  name: 'date',
  standalone: true,
  pure: false,
})
export class DatePipe implements PipeTransform {
  private datePipe = new DatePipeBase(Locale.EN);

  public constructor(private translationService: TranslationService) {}

  public transform(
    value: Date | string | number | null,
    format: string = 'mediumDate'
  ): string | null {
    if (!value) return null;

    const { locale } = this.translationService.loadedLanguage();

    this.datePipe = new DatePipeBase(locale);

    return this.datePipe.transform(value, format);
  }
}
