import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsListComponent } from '../../components/notifications-list/notifications-list.component';
import { NotificationsHeaderComponent } from '../../components/notifications-header/notifications-header.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationsListComponent,
    TranslateModule,
    NotificationsHeaderComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {}
