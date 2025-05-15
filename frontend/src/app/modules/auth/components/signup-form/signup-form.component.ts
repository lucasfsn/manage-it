import {
  PASSWORD_REGEX,
  PERSON_NAME_REGEX,
  USERNAME_REGEX,
} from '@/app/core/constants/regex.constants';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { RegisterCredentials } from '@/app/features/dto/auth.model';
import { AuthService } from '@/app/features/services/auth.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import {
  email,
  equalValues,
  maxLength,
  minLength,
  pattern,
  required,
} from '@/app/shared/validators';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
          required('signupForm.firstName.errors.REQUIRED'),
          minLength(2, 'signupForm.firstName.errors.MIN_LENGTH'),
          maxLength(50, 'signupForm.firstName.errors.MAX_LENGTH'),
          pattern(PERSON_NAME_REGEX, 'signupForm.firstName.errors.INVALID'),
        ],
      }),
      lastName: new FormControl('', {
        validators: [
          required('signupForm.lastName.errors.REQUIRED'),
          minLength(2, 'signupForm.lastName.errors.MIN_LENGTH'),
          maxLength(50, 'signupForm.lastName.errors.MAX_LENGTH'),
          pattern(PERSON_NAME_REGEX, 'signupForm.lastName.errors.INVALID'),
        ],
      }),
      username: new FormControl('', {
        validators: [
          required('signupForm.username.errors.REQUIRED'),
          minLength(8, 'signupForm.username.errors.MIN_LENGTH'),
          maxLength(30, 'signupForm.username.errors.MAX_LENGTH'),
          pattern(USERNAME_REGEX, 'signupForm.username.errors.INVALID'),
        ],
      }),
      email: new FormControl('', {
        validators: [
          required('signupForm.email.errors.REQUIRED'),
          email('signupForm.email.errors.INVALID'),
        ],
      }),
      passwords: new FormGroup<PasswordsForm>({
        password: new FormControl('', {
          validators: [
            required('signupForm.password.errors.REQUIRED'),
            pattern(PASSWORD_REGEX, 'signupForm.password.errors.INVALID'),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [
            required('signupForm.confirmPassword.errors.REQUIRED'),
            equalValues(
              'password',
              'signupForm.confirmPassword.errors.NOT_EQUAL',
            ),
          ],
        }),
      }),
    },
    { updateOn: 'blur' },
  );

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
