import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './core/layout/dashboard-layout/dashboard-layout.component';
import { LoginPageComponent } from './modules/auth/pages/login-page/login-page.component';
import { SignupPageComponent } from './modules/auth/pages/signup-page/signup-page.component';
import { DashboardPageComponent } from './modules/dashboard/page/dashboard-page/dashboard-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './modules/not-found/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: {
      title: 'Manage Your Projects',
    },
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    component: LoginPageComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardPageComponent,
        data: {
          title: 'Dashboard',
        },
      },
    ],
  },
  {
    path: 'auth/signup',
    component: SignupPageComponent,
    data: { title: 'Sign Up' },
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { title: 'Page Not Found' },
  },
];
