import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { Notification } from '../../../features/dto/notification.model';
import { LoadingService } from '../../../features/services/loading.service';
import { MapperService } from '../../../features/services/mapper.service';
import { NotificationService } from '../../../features/services/notification.service';

export const notificationsResolver: ResolveFn<
  Notification[] | undefined
> = () => {
  const loadingService = inject(LoadingService);
  const notificationService = inject(NotificationService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const location = inject(Location);

  loadingService.loadingOn();

  return notificationService.getNotifications().pipe(
    catchError(() => {
      const localeMessage = mapperService.errorToastMapper();
      toastrService.error(localeMessage);
      location.back();

      return of(undefined);
    }),
    finalize(() => loadingService.loadingOff())
  );
};
