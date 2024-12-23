import { Routes } from '@angular/router';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { projectResolver } from './resolvers/project.resolver';
import { projectsResolver } from './resolvers/projects.resolver';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    resolve: {
      projectsResolver,
    },
    data: {
      title: 'title.PROJECTS',
    },
  },
  {
    path: 'create',
    component: ProjectFormComponent,
    data: {
      title: 'title.PROJECT_CREATE',
      isEditing: false,
    },
  },
  {
    path: ':projectId/edit',
    component: ProjectFormComponent,
    resolve: {
      projectResolver,
    },
    data: {
      title: 'title.PROJECT_EDIT',
      isEditing: true,
    },
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    resolve: {
      projectResolver,
    },
    data: {
      title: 'title.PROJECT',
    },
  },
  {
    path: ':projectId/tasks',
    loadChildren: () =>
      import('../task/task.routes').then((r) => r.TASK_ROUTES),
  },
];
