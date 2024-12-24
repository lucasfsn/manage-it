import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { DATE_FNS_LOCALES } from '../../config/language.config';
import { TranslationService } from '../../features/services/translation.service';

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

  public transform(value: Date | string | number | null): string | null {
    if (!value) return null;

    const locale =
      DATE_FNS_LOCALES[this.translationService.loadedLanguage().code];

    return formatDistanceToNow(new Date(value), { addSuffix: true, locale });
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
