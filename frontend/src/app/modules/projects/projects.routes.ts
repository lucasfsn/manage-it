import { ProjectFormComponent } from '@/app/modules/projects/components/project-form/project-form.component';
import { ProjectComponent } from '@/app/modules/projects/pages/project/project.component';
import { ProjectsComponent } from '@/app/modules/projects/pages/projects/projects.component';
import { projectFormResolver } from '@/app/modules/projects/resolvers/project-form.resolver';
import { projectResolver } from '@/app/modules/projects/resolvers/project.resolver';
import { projectsResolver } from '@/app/modules/projects/resolvers/projects.resolver';
import { Routes } from '@angular/router';

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
      projectFormResolver,
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
