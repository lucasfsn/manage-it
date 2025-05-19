import { LoadingService } from '@/app/core/services/loading.service';
import { User } from '@/app/features/dto/user.model';
import { AuthService } from '@/app/features/services/auth.service';
import { UserService } from '@/app/features/services/user.service';
import { MapperService } from '@/app/shared/services/mapper.service';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

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
