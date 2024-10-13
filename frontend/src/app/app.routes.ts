import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/auth/pages/login-page/login-page.component';
import { SignupPageComponent } from './modules/auth/pages/signup-page/signup-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './modules/not-found/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Manage Your Projects | ManageIt',
  },
  {
    path: 'auth/login',
    component: LoginPageComponent,
    title: 'Login | ManageIt',
  },
  {
    path: 'auth/signup',
    component: SignupPageComponent,
    title: 'Sign Up | ManageIt',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Page Not Found | ManageIt',
  },
];
