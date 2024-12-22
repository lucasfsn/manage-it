import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { User } from '../../../features/dto/user.model';
import { AuthService } from '../../../features/services/auth.service';
import { LoadingService } from '../../../features/services/loading.service';
import { MapperService } from '../../../features/services/mapper.service';
import { UserService } from '../../../features/services/user.service';

export const userRedirectResolver: ResolveFn<void> = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedInUser = authService.getLoggedInUsername();

  if (loggedInUser) {
    router.navigate([`/users/${loggedInUser}`]);
  } else {
    router.navigate(['/']);
  }
};

export const userResolver: ResolveFn<User | undefined> = (route) => {
  const loadingService = inject(LoadingService);
  const userService = inject(UserService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const location = inject(Location);

  const username = route.paramMap.get('username');
  if (username) {
    loadingService.loadingOn();

    return userService.getUserByUsername(username).pipe(
      catchError((error) => {
        const localeMessage = mapperService.errorToastMapper(error.status);
        toastrService.error(localeMessage);
        location.back();

        return of(undefined);
      }),
      finalize(() => loadingService.loadingOff())
    );
  }

  return of(undefined);
};
