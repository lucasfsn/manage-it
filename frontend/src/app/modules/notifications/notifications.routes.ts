import { Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { notificationsResolver } from './resolvers/notifications.resolver';

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
