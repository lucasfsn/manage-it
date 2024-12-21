import { Routes } from '@angular/router';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    data: {
      title: 'title.PROJECTS',
    },
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    data: {
      title: 'title.PROJECT',
    },
  },
  {
    path: ':projectId/tasks',
    loadChildren: () =>
      import('../tasks/tasks.routes').then((r) => r.TASKS_ROUTES),
  },
];
