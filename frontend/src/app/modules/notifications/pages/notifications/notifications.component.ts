import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../../../../features/dto/notification.model';
import { LoadingService } from '../../../../features/services/loading.service';
import { MappersService } from '../../../../features/services/mappers.service';
import { NotificationService } from '../../../../features/services/notification.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NotificationsListComponent } from '../../components/notifications-list/notifications-list.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [SpinnerComponent, NotificationsListComponent, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  public constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private toastrService: ToastrService,
    private mappersService: MappersService
  ) {}

  protected markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  protected get notifications(): Notification[] {
    return this.notificationService
      .loadedNotifications()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  private loadNotifications(): void {
    this.loadingService.loadingOn();
    this.notificationService.getNotifications().subscribe({
      error: () => {
        const localeMessage = this.mappersService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  public ngOnInit(): void {
    this.loadNotifications();
  }
}
