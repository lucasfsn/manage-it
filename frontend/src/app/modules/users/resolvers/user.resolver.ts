import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { AuthService } from '../../../features/services/auth.service';

export const userResolver: ResolveFn<void> = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedInUser = authService.getLoggedInUsername();

  if (loggedInUser) {
    router.navigate([`/users/${loggedInUser}`]);
  } else {
    router.navigate(['/']);
  }
};
