import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { MapperService } from '../../../core/services/mapper.service';
import { User } from '../../../features/dto/user.model';
import { AuthService } from '../../../features/services/auth.service';
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

export const userResolver: ResolveFn<User | null> = (route) => {
  const loadingService = inject(LoadingService);
  const userService = inject(UserService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  const username = route.paramMap.get('username');
  if (username) {
    loadingService.loadingOn();

    return userService.getUserByUsername(username).pipe(
      catchError((error) => {
        const localeMessage = mapperService.errorToastMapper(error.status);
        toastrService.error(localeMessage);
        router.navigate(['/']);

        return of(null);
      }),
      finalize(() => loadingService.loadingOff()),
    );
  }

  return of(null);
};
