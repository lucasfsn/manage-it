import { Routes } from '@angular/router';
import { authGuard, projectAuthGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { SignupComponent } from './modules/auth/pages/signup/signup.component';
import { DashboardComponent } from './modules/dashboard/pages/dashboard/dashboard.component';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { NotFoundComponent } from './modules/not-found/pages/not-found/not-found.component';
import { NotificationsComponent } from './modules/notifications/page/notifications/notifications.component';
import { ProjectComponent } from './modules/projects/pages/project/project.component';
import { ProjectsComponent } from './modules/projects/pages/projects/projects.component';
import { TaskComponent } from './modules/projects/pages/task/task.component';
import { UserComponent } from './modules/users/pages/user/user.component';
import { userResolver } from './modules/users/resolvers/user.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
    component: LoginComponent,
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
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          title: 'Notifications',
        },
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        data: {
          title: 'Projects',
        },
      },
      {
        path: 'projects/:projectId',
        component: ProjectComponent,
        canActivate: [projectAuthGuard],
        data: {
          title: 'Project Details',
        },
      },
      {
        path: 'projects/:projectId/tasks/:taskId',
        component: TaskComponent,
        canActivate: [projectAuthGuard],
        data: {
          title: 'Task Details',
        },
      },
      {
        path: 'users',
        resolve: {
          user: userResolver,
        },
        component: UserComponent,
      },
      {
        path: 'users/:username',
        component: UserComponent,
        data: {
          title: 'Profile',
        },
      },
    ],
  },
  {
    path: 'auth/signup',
    component: SignupComponent,
    canActivate: [guestGuard],
    data: { title: 'Sign Up' },
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: 'Page Not Found' },
  },
];
