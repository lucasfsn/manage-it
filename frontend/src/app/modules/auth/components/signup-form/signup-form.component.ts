import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { RegisterCredentials } from '@/app/features/dto/auth.model';
import { AuthService } from '@/app/features/services/auth.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import {
  equalValues,
  nameValidator,
  passwordValidator,
  usernameValidator,
} from '@/app/shared/validators';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

interface PasswordsForm {
  readonly password: FormControl<string | null>;
  readonly confirmPassword: FormControl<string | null>;
}

interface SignupForm {
  readonly firstName: FormControl<string | null>;
  readonly lastName: FormControl<string | null>;
  readonly username: FormControl<string | null>;
  readonly email: FormControl<string | null>;
  readonly passwords: FormGroup<PasswordsForm>;
}

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    FormButtonComponent,
    FormTextInputControlComponent,
  ],
})
export class SignupFormComponent {
  protected loading: boolean = false;

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected form: FormGroup<SignupForm> = new FormGroup<SignupForm>(
    {
      firstName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          nameValidator,
        ],
      }),
      lastName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          nameValidator,
        ],
      }),
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          usernameValidator,
        ],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      passwords: new FormGroup<PasswordsForm>(
        {
          password: new FormControl('', {
            validators: [Validators.required, passwordValidator],
          }),
          confirmPassword: new FormControl(''),
        },
        {
          validators: [equalValues('password', 'confirmPassword')],
        },
      ),
    },
    { updateOn: 'blur' },
  );

  protected get passwordIsInvalid(): boolean {
    return !!(
      this.form.controls.passwords.get('password')?.dirty &&
      this.form.controls.passwords.get('password')?.touched &&
      this.form.controls.passwords.get('password')?.invalid
    );
  }

  protected get passwordsDoNotMatch(): boolean {
    return this.form.controls.passwords.hasError('equalValues');
  }

  protected get firstNameErrors(): string | null {
    const control = this.form.controls.firstName;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate(
        'signupForm.FIRST_NAME_REQUIRED',
      );

    if (control.errors['minlength'])
      return this.translationService.translate(
        'signupForm.FIRST_NAME_MIN_LENGTH',
        { minLength: control.errors['minlength'].requiredLength },
      );

    if (control.errors['maxlength'])
      return this.translationService.translate(
        'signupForm.FIRST_NAME_MAX_LENGTH',
        { maxLength: control.errors['maxlength'].requiredLength },
      );

    if (control.errors['invalidName'])
      return this.translationService.translate('signupForm.FIRST_NAME_INVALID');

    return null;
  }

  protected get lastNameErrors(): string | null {
    const control = this.form.controls.lastName;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate('signupForm.LAST_NAME_REQUIRED');

    if (control.errors['minlength'])
      return this.translationService.translate(
        'signupForm.LAST_NAME_MIN_LENGTH',
        { minLength: control.errors['minlength'].requiredLength },
      );

    if (control.errors['maxlength'])
      return this.translationService.translate(
        'signupForm.LAST_NAME_MAX_LENGTH',
        { minLength: control.errors['maxlength'].requiredLength },
      );

    if (control.errors['invalidName'])
      return this.translationService.translate('signupForm.LAST_NAME_INVALID');

    return null;
  }

  protected get usernameErrors(): string | null {
    const control = this.form.controls.username;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate('signupForm.USERNAME_REQUIRED');

    if (control.errors['minlength'])
      return this.translationService.translate(
        'signupForm.USERNAME_MIN_LENGTH',
        { minLength: control.errors['minlength'].requiredLength },
      );

    if (control.errors['maxlength'])
      return this.translationService.translate(
        'signupForm.USERNAME_MIN_LENGTH',
        { minLength: control.errors['maxlength'].requiredLength },
      );

    if (control.errors['invalidUsername'])
      return this.translationService.translate('signupForm.USERNAME_INVALID');

    return null;
  }

  protected get emailErrors(): string | null {
    const control = this.form.controls.email;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate('signupForm.EMAIL_REQUIRED');

    if (control.errors['email'])
      return this.translationService.translate('signupForm.EMAIL_INVALID');

    return null;
  }

  protected get passwordErrors(): string | null {
    const control = this.form.controls.passwords.get('password');
    if (!control?.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate('signupForm.PASSWORD_REQUIRED');

    if (control.errors['invalidPassword'])
      return this.translationService.translate('signupForm.PASSWORD_INVALID');

    return null;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const registerCredentials: RegisterCredentials = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.passwords?.password ?? '',
    };

    this.loading = true;
    this.authService.register(registerCredentials).subscribe({
      next: () => {
        this.toastrService.success(
          this.translationService.translate('toast.success.SIGNUP'),
        );
      },
      error: (error) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.status,
          error.error.errorDescription,
          error.error.message,
        );
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  protected onReset(): void {
    this.form.reset();
  }
}
