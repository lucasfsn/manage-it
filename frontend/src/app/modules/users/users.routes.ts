import { Routes } from '@angular/router';
import { addToProjectGuard } from '../../core/guards/add-to-project.guard';
import { UserComponent } from './pages/user/user.component';
import { userRedirectResolver, userResolver } from './resolvers/user.resolver';

export interface UserProfileRouteData {
  routeType: 'profile' | 'addToProject';
}

interface UserProfileRoutes extends Routes {
  data?: UserProfileRouteData;
}

export const USERS_ROUTES: UserProfileRoutes = [
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
      routeType: 'profile',
    },
  },
  {
    path: ':username/projects/:projectId/add',
    component: UserComponent,
    resolve: {
      userResolver,
    },
    canActivate: [addToProjectGuard],
    data: {
      title: 'title.PROFILE',
      routeType: 'addToProject',
    },
  },
];
