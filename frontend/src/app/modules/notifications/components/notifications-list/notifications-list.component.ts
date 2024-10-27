import { Component, Input } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { Notification } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [MomentModule],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.css',
})
export class NotificationsListComponent {
  @Input() notifications: Notification[] = [];
}
