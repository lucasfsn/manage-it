import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { AuthService } from '@/app/features/services/auth.service';
import { FormButtonComponent } from '@/app/shared/components/form-button/form-button.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  ) {}

  protected form: FormGroup<LoginForm> = new FormGroup<LoginForm>(
    {
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    { updateOn: 'blur' },
  );

  protected get emailIsInvalid(): boolean {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  protected get passwordIsInvalid(): boolean {
    return (
      this.form.controls.password.dirty &&
      this.form.controls.password.touched &&
      this.form.controls.password.invalid
    );
  }

  protected get passwordErrors(): string | null {
    const control = this.form.controls.password;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate('loginForm.PASSWORD_REQUIRED');

    return null;
  }

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
      error: (error) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.status,
          error.error.errorDescription,
        );
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public ngOnInit(): void {
    const savedLoginForm = localStorage.getItem('saved-login-form');

    if (savedLoginForm) {
      const loadedData = JSON.parse(savedLoginForm) as { email: string | null };
      this.form.controls.email.setValue(loadedData.email);
    }

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email }),
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
