import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { UserProfileDto } from '@/app/features/dto/user.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { UserService } from '@/app/features/services/user.service';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
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

export const userResolver: ResolveFn<UserProfileDto | null> = (route) => {
  const loadingService = inject(LoadingService);
  const userService = inject(UserService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  const username = route.paramMap.get('username');
  if (username) {
    loadingService.loadingOn();

    return userService.getUserByUsername(username).pipe(
      catchError((error: ErrorResponse) => {
        const localeMessage = mapperService.errorToastMapper(
          error.code,
          'user',
        );
        toastrService.error(localeMessage);
        router.navigate(['/']);

        return of(null);
      }),
      finalize(() => loadingService.loadingOff()),
    );
  }

  return of(null);
};
