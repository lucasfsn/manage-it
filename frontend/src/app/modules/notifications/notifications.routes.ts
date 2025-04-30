import { NotificationsComponent } from '@/app/modules/notifications/pages/notifications/notifications.component';
import { notificationsResolver } from '@/app/modules/notifications/resolvers/notifications.resolver';
import { Routes } from '@angular/router';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    resolve: {
      notificationsResolver,
    },
    data: {
      title: 'title.NOTIFICATIONS',
    },
  },
];
