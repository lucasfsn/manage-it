import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../features/services/translation.service';

@Pipe({
  name: 'customDate',
  standalone: true,
  pure: false,
})
export class CustomDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  public constructor(private translationService: TranslationService) {}

  public transform(
    value: Date | string | number | null,
    format: string = 'mediumDate'
  ): string | null {
    if (!value) return null;

    const currentLanguage = this.translationService.currentSetLanguage;
    const locale = currentLanguage?.locale || 'en-US';

    this.datePipe = new DatePipe(locale);

    return this.datePipe.transform(value, format);
  }
}
