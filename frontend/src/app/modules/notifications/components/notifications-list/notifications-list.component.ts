import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MomentModule } from "ngx-moment";
import { Notification } from "../../../../core/models/notification.model";
import { NotificationService } from "../../../../core/services/notification.service";

@Component({
  selector: "app-notifications-list",
  standalone: true,
  imports: [MomentModule],
  templateUrl: "./notifications-list.component.html",
  styleUrl: "./notifications-list.component.css",
})
export class NotificationsListComponent {
  @Input() notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  markAsReadAndOpen(notification: Notification) {
    const { id, projectId, taskId } = notification;

    if (taskId) {
      this.router.navigate(["/projects", projectId, "tasks", taskId]);
    } else {
      this.router.navigate(["/projects", projectId]);
    }

    this.notificationService.markAsRead(notification.id).subscribe();
  }
}
