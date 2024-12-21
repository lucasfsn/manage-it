import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { dashboardResolver } from './resolvers/dashboard.resolver';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      dashboardResolver,
    },
    data: {
      title: 'title.DASHBOARD',
    },
  },
];
