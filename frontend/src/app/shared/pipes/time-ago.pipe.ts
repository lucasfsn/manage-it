import { DATE_FNS_LOCALES, LanguageCode } from '@/app/config/language.config';
import { TranslationService } from '@/app/core/services/translation.service';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { formatDistanceToNow, Locale } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private languagesDateFns: Record<LanguageCode, Locale> = DATE_FNS_LOCALES;
  private intervalId: ReturnType<typeof setInterval>;

  public constructor(
    private translationService: TranslationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.intervalId = setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 60000);
  }

  public transform(value: Date | string | number | null): string | null {
    if (!value) return null;

    const locale =
      this.languagesDateFns[this.translationService.loadedLanguage()];

    return formatDistanceToNow(new Date(value), { addSuffix: true, locale });
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
