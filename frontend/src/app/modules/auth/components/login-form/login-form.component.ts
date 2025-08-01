import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { AuthService } from '@/app/features/services/auth.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { SAVED_LOGIN_FORM_DATA_KEY } from '@/app/shared/constants/local-storage.constant';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { emailValidator, requiredValidator } from '@/app/shared/validators';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';

interface LoginForm {
  readonly email: FormControl<string | null>;
  readonly password: FormControl<string | null>;
}

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    FormButtonComponent,
    FormTextInputControlComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected loading: boolean = false;

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private mapperService: MapperService,
    private loadingService: LoadingService,
  ) {}

  protected form: FormGroup<LoginForm> = new FormGroup<LoginForm>(
    {
      email: new FormControl('', {
        validators: [
          requiredValidator('loginForm.email.errors.REQUIRED'),
          emailValidator('loginForm.email.errors.INVALID'),
        ],
      }),
      password: new FormControl('', {
        validators: [requiredValidator('loginForm.password.errors.REQUIRED')],
      }),
    },
    { updateOn: 'blur' },
  );

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    this.loading = true;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.toastrService.success(
          this.translationService.translate('toast.success.LOGIN'),
        );
      },
      error: (error: ErrorResponse) => {
        const localeMessage =
          error.code === 401
            ? this.translationService.translate(
                'loginForm.errors.INVALID_CREDENTIALS',
              )
            : this.mapperService.errorToastMapper(error.code);
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  protected get isLoading(): boolean {
    return this.loading || this.loadingService.isLoading();
  }

  public ngOnInit(): void {
    const savedLoginForm = localStorage.getItem(SAVED_LOGIN_FORM_DATA_KEY);

    if (savedLoginForm) {
      const loadedData = JSON.parse(savedLoginForm) as { email: string | null };
      this.form.controls.email.setValue(loadedData.email);
    }

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          localStorage.setItem(
            SAVED_LOGIN_FORM_DATA_KEY,
            JSON.stringify({ email: value.email }),
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
