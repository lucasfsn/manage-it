import { Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    data: {
      title: 'title.NOTIFICATIONS',
    },
  },
];
