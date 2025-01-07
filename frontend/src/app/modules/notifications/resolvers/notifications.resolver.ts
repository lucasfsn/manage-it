import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { MapperService } from '../../../core/services/mapper.service';
import { Notification } from '../../../features/dto/notification.model';
import { NotificationService } from '../../../features/services/notification.service';

export const notificationsResolver: ResolveFn<
  Notification[] | undefined
> = () => {
  const loadingService = inject(LoadingService);
  const notificationService = inject(NotificationService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  loadingService.loadingOn();

  return notificationService.getNotifications().pipe(
    catchError(() => {
      const localeMessage = mapperService.errorToastMapper();
      toastrService.error(localeMessage);
      router.navigate(['/']);

      return of(undefined);
    }),
    finalize(() => loadingService.loadingOff()),
  );
};
