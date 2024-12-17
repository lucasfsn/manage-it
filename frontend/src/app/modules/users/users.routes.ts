import { Routes } from '@angular/router';
import { addToProjectGuard } from '../../core/guards/add-to-project.guard';
import { UserComponent } from './pages/user/user.component';
import { userResolver } from './resolvers/user.resolver';

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
      user: userResolver,
    },
    component: UserComponent,
  },
  {
    path: ':username',
    component: UserComponent,
    title: 'Profile | ManageIt',
    data: {
      routeType: 'profile',
    },
  },
  {
    path: ':username/projects/:projectId/add',
    component: UserComponent,
    canActivate: [addToProjectGuard],
    title: 'Add To Project | ManageIt',
    data: {
      routeType: 'addToProject',
    },
  },
];
