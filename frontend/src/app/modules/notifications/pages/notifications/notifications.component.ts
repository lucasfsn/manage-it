import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsListComponent } from '@/app/modules/notifications/components/notifications-list/notifications-list.component';
import { NotificationsMenuComponent } from '@/app/modules/notifications/components/notifications-menu/notifications-menu.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationsListComponent,
    TranslateModule,
    NotificationsMenuComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {}
