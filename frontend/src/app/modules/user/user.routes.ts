import { Routes } from '@angular/router';
import { allowAddUserToProjectGuard } from '../../core/guards/allow-add-user-to-project.guard';
import { UserComponent } from './pages/user/user.component';
import { userRedirectResolver, userResolver } from './resolvers/user.resolver';

export const USER_ROUTES: Routes = [
  {
    path: '',
    resolve: {
      userRedirectResolver,
    },
    component: UserComponent,
  },
  {
    path: ':username',
    component: UserComponent,
    resolve: {
      userResolver,
    },
    data: {
      title: 'title.PROFILE',
    },
  },
  {
    path: ':username/projects/:projectId/add',
    component: UserComponent,
    resolve: {
      userResolver,
    },
    canActivate: [allowAddUserToProjectGuard],
    data: {
      title: 'title.PROFILE',
    },
  },
];
