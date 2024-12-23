import { Routes } from '@angular/router';
import { projectsResolver } from '../projects/resolvers/projects.resolver';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
