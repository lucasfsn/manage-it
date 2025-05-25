import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { NotificationDto } from '@/app/features/dto/notification.model';
import { NotificationService } from '@/app/features/services/notification.service';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

export const notificationsResolver: ResolveFn<
  NotificationDto[] | undefined
> = () => {
  const loadingService = inject(LoadingService);
  const notificationService = inject(NotificationService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  loadingService.loadingOn();

  return notificationService.getNotifications().pipe(
    catchError((error: ErrorResponse) => {
      const localeMessage = mapperService.errorToastMapper(error.code);
      toastrService.error(localeMessage);
      router.navigate(['/']);

      return of(undefined);
    }),
    finalize(() => loadingService.loadingOff()),
  );
};
