import { DatePipe as DatePipeBase } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../features/services/translation.service';

@Pipe({
  name: 'date',
  standalone: true,
  pure: false,
})
export class DatePipe implements PipeTransform {
  private datePipe = new DatePipeBase('en-US');

  public constructor(private translationService: TranslationService) {}

  public transform(
    value: Date | string | number | null,
    format: string = 'mediumDate'
  ): string | null {
    if (!value) return null;

    const currentLanguage = this.translationService.currentSetLanguage;
    const locale = currentLanguage?.locale || 'en-US';

    this.datePipe = new DatePipeBase(locale);

    return this.datePipe.transform(value, format);
  }
}
