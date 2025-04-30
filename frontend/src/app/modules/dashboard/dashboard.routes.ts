import { Routes } from '@angular/router';
import { projectsResolver } from '@/app/modules/projects/resolvers/projects.resolver';
import { DashboardComponent } from '@/app/modules/dashboard/pages/dashboard/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      projectsResolver,
    },
    data: {
      title: 'title.DASHBOARD',
    },
  },
];
