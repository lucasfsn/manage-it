import { authGuard } from '@/app/core/guards/auth.guard';
import { guestGuard } from '@/app/core/guards/guest.guard';
import { MainLayoutComponent } from '@/app/core/layout/main-layout/main-layout.component';
import { authResolver } from '@/app/modules/auth/resolvers/auth.resolver';
import { HomeComponent } from '@/app/modules/home/pages/home/home.component';
import { NotFoundComponent } from '@/app/modules/not-found/pages/not-found/not-found.component';
import { Routes } from '@angular/router';

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
    resolve: {
      authResolver,
    },
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.routes').then(
            (r) => r.DASHBOARD_ROUTES,
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./modules/notifications/notifications.routes').then(
            (r) => r.NOTIFICATIONS_ROUTES,
          ),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./modules/projects/projects.routes').then(
            (r) => r.PROJECTS_ROUTES,
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/user/user.routes').then((r) => r.USER_ROUTES),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      title: 'title.NOT_FOUND',
    },
  },
];
