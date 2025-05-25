import { MapperService } from '@/app/core/services/mapper.service';
import { NotificationDto } from '@/app/features/dto/notification.model';
import { NotificationService } from '@/app/features/services/notification.service';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications-menu',
  imports: [TranslateModule],
  templateUrl: './notifications-menu.component.html',
  styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent {
  public constructor(
    private notificationService: NotificationService,
    private mapperService: MapperService,
    private toastrService: ToastrService,
  ) {}

  protected markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      error: (error: ErrorResponse) => {
        const localeMessage = this.mapperService.errorToastMapper(error.code);
        this.toastrService.error(localeMessage);
      },
    });
  }

  protected get notifications(): NotificationDto[] {
    return this.notificationService.loadedNotifications();
  }
}
