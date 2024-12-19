import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
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

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  public transform(value: Date | string | number | null): string | null {
    if (!value) return null;

    const locale =
      this.translationService.currentSetLanguage?.code === 'en' ? enUS : pl;

    return formatDistanceToNow(new Date(value), { addSuffix: true, locale });
  }
}
