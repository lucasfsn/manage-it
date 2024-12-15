import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { Notification } from '../../../../features/dto/notification.model';
import { NotificationService } from '../../../../features/services/notification.service';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [MomentModule],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.css',
})
export class NotificationsListComponent {
  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  protected get notifications(): Notification[] {
    return this.notificationService
      .loadedNotifications()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  protected markAsReadAndOpen(notification: Notification): void {
    const { id, projectId, taskId } = notification;

    if (taskId) {
      this.router.navigate(['/projects', projectId, 'tasks', taskId]);
    } else {
      this.router.navigate(['/projects', projectId]);
    }

    this.notificationService.markAsRead(id).subscribe();
  }
}
