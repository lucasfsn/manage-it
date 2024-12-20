import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { TranslationService } from '../../features/services/translation.service';
import {
  DATE_FNS_LOCALES,
  LanguageCode,
  LANGUAGES,
} from '../../language.config';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private intervalId: ReturnType<typeof setInterval>;

  public constructor(
    private translationService: TranslationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.intervalId = setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 60000);
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  public transform(value: Date | string | number | null): string | null {
    if (!value) return null;

    const currentLanguage = LANGUAGES.find(
      (lang) => lang.code === this.translationService.currentSetLanguage?.code
    );

    const locale = currentLanguage
      ? DATE_FNS_LOCALES[currentLanguage.code]
      : DATE_FNS_LOCALES[LanguageCode.EN];

    return formatDistanceToNow(new Date(value), { addSuffix: true, locale });
  }
}
