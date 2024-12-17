import { Routes } from '@angular/router';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    title: 'Projects | ManageIt',
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    title: 'Project Details | ManageIt',
  },
  {
    path: ':projectId/tasks',
    loadChildren: () =>
      import('../tasks/tasks.routes').then((r) => r.TASKS_ROUTES),
  },
];
