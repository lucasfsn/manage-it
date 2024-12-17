import { Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    title: 'Notifications | ManageIt',
  },
];
