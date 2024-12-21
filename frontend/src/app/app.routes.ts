import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { HomeComponent } from './modules/home/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [guestGuard],
    data: {
      title: 'title.HOME',
    },
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [guestGuard],
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.routes').then(
            (r) => r.DASHBOARD_ROUTES
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./modules/notifications/notifications.routes').then(
            (r) => r.NOTIFICATIONS_ROUTES
          ),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./modules/projects/projects.routes').then(
            (r) => r.PROJECTS_ROUTES
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.routes').then((r) => r.USERS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadChildren: () =>
      import('./modules/not-found/not-found.routes').then(
        (r) => r.NOT_FOUND_ROUTES
      ),
  },
];
