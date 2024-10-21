import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

export const userResolver: ResolveFn<void> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const loggedInUser = userService.getLoggedInUser();
  if (loggedInUser) {
    router.navigate([`/users/${loggedInUser.userName}`]);
  } else {
    router.navigate(['/']);
  }
};
