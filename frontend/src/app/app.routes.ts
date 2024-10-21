import { Routes } from '@angular/router';
import { authGuard, projectAuthGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { LoginPageComponent } from './modules/auth/pages/login-page/login-page.component';
import { SignupPageComponent } from './modules/auth/pages/signup-page/signup-page.component';
import { DashboardPageComponent } from './modules/dashboard/page/dashboard-page/dashboard-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './modules/not-found/pages/not-found-page/not-found-page.component';
import { ProjectPageComponent } from './modules/projects/page/project-page/project-page.component';
import { ProjectsPageComponent } from './modules/projects/page/projects-page/projects-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [guestGuard],
    data: {
      title: 'Manage Your Projects',
    },
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [guestGuard],
  },
  {
    path: 'auth/login',
    component: LoginPageComponent,
    canActivate: [guestGuard],
    data: {
      title: 'Login',
    },
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'projects',
        component: ProjectsPageComponent,
        data: {
          title: 'Projects',
        },
      },
      {
        path: 'projects/:projectId',
        component: ProjectPageComponent,
        canActivate: [projectAuthGuard],
        data: {
          title: 'Project Details',
        },
      },
    ],
  },
  {
    path: 'auth/signup',
    component: SignupPageComponent,
    canActivate: [guestGuard],
    data: { title: 'Sign Up' },
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { title: 'Page Not Found' },
  },
];
