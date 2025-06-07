import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { SignupPayload } from '@/app/features/dto/auth.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import {
  PASSWORD_REGEX,
  PERSON_NAME_REGEX,
  USERNAME_REGEX,
} from '@/app/shared/constants/regex.constant';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { ErrorResponseConflict } from '@/app/shared/types/errors.type';
import {
  emailValidator,
  equalValuesValidator,
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  profanityValidator,
  requiredValidator,
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
    private loadingService: LoadingService,
  ) {}

  protected form: FormGroup<SignupForm> = new FormGroup<SignupForm>(
    {
      firstName: new FormControl('', {
        validators: [
          requiredValidator('signupForm.firstName.errors.REQUIRED'),
          minLengthValidator(2, 'signupForm.firstName.errors.MIN_LENGTH'),
          maxLengthValidator(50, 'signupForm.firstName.errors.MAX_LENGTH'),
          patternValidator(
            PERSON_NAME_REGEX,
            'signupForm.firstName.errors.INVALID',
          ),
          profanityValidator('signupForm.firstName.errors.PROFANITY'),
        ],
      }),
      lastName: new FormControl('', {
        validators: [
          requiredValidator('signupForm.lastName.errors.REQUIRED'),
          minLengthValidator(2, 'signupForm.lastName.errors.MIN_LENGTH'),
          maxLengthValidator(50, 'signupForm.lastName.errors.MAX_LENGTH'),
          patternValidator(
            PERSON_NAME_REGEX,
            'signupForm.lastName.errors.INVALID',
          ),
          profanityValidator('signupForm.lastName.errors.PROFANITY'),
        ],
      }),
      username: new FormControl('', {
        validators: [
          requiredValidator('signupForm.username.errors.REQUIRED'),
          minLengthValidator(8, 'signupForm.username.errors.MIN_LENGTH'),
          maxLengthValidator(30, 'signupForm.username.errors.MAX_LENGTH'),
          patternValidator(
            USERNAME_REGEX,
            'signupForm.username.errors.INVALID',
          ),
          profanityValidator('signupForm.username.errors.PROFANITY'),
        ],
      }),
      email: new FormControl('', {
        validators: [
          requiredValidator('signupForm.email.errors.REQUIRED'),
          emailValidator('signupForm.email.errors.INVALID'),
          profanityValidator('signupForm.email.errors.PROFANITY'),
        ],
      }),
      passwords: new FormGroup<PasswordsForm>({
        password: new FormControl('', {
          validators: [
            requiredValidator('signupForm.password.errors.REQUIRED'),
            patternValidator(
              PASSWORD_REGEX,
              'signupForm.password.errors.INVALID',
            ),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [
            requiredValidator('signupForm.confirmPassword.errors.REQUIRED'),
            equalValuesValidator(
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

    const registerCredentials: SignupPayload = {
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
      error: (error: ErrorResponse) => {
        const validFields: Record<string, ErrorResponseConflict> = {
          email: 'email',
          username: 'username',
        };

        const field = validFields[error.data?.at(0)?.field ?? ''] ?? undefined;

        const localeMessage = this.mapperService.errorToastMapper(
          error.code,
          'default',
          field,
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

  protected get isLoading(): boolean {
    return this.loading || this.loadingService.isLoading();
  }
}
