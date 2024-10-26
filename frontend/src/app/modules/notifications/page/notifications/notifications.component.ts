import { Component, OnInit, signal } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../../../../core/models/notification.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [SpinnerComponent, MomentModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  public notifications = signal<Notification[]>([]);
  public isLoading = signal<boolean>(false);

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private notificationService: NotificationService,
    private toastrService: ToastrService
  ) {}

  loadNotifications(): void {
    const userId = this.userService.getLoggedInUser()?.id;

    if (!userId) return;

    this.loadingService.loadingOn();
    this.notificationService.getNotifications(userId).subscribe({
      next: (notifications) => {
        const sortedNotifications = notifications.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.notifications.set(sortedNotifications);
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.loadNotifications();
  }
}
