import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { UpdateUserPayload, UserProfileDto } from '@/app/features/dto/user.dto';
import { UserService } from '@/app/features/services/user.service';
import { FormCheckboxControlComponent } from '@/app/shared/components/form-controls/form-checkbox-control/form-checkbox-control.component';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import {
  PASSWORD_REGEX,
  PERSON_NAME_REGEX,
} from '@/app/shared/constants/regex.constant';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import {
  emailValidator,
  equalValuesValidator,
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  profanityValidator,
  requiredValidator,
} from '@/app/shared/validators';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

interface PasswordsForm {
  readonly password: FormControl<string | null>;
  readonly confirmPassword: FormControl<string | null>;
}

interface UserEditForm {
  readonly firstName: FormControl<string | null>;
  readonly lastName: FormControl<string | null>;
  readonly email: FormControl<string | null>;
  readonly changePassword: FormControl<boolean | null>;
  readonly passwords?: FormGroup<PasswordsForm>;
}

@Component({
  selector: 'app-user-edit-form',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    TranslateModule,
    FormCheckboxControlComponent,
    FormTextInputControlComponent,
    FormButtonComponent,
  ],
  templateUrl: './user-edit-form.component.html',
  styleUrl: './user-edit-form.component.scss',
})
export class UserEditFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public constructor(
    private dialogRef: MatDialogRef<UserEditFormComponent>,
    private userService: UserService,
    private toastrService: ToastrService,
    private mapperService: MapperService,
    private loadingService: LoadingService,
  ) {}

  protected form: FormGroup<UserEditForm> = new FormGroup<UserEditForm>(
    {
      firstName: new FormControl('', {
        validators: [
          requiredValidator('user.form.firstName.errors.REQUIRED'),
          minLengthValidator(2, 'user.form.firstName.errors.MIN_LENGTH'),
          maxLengthValidator(50, 'user.form.firstName.errors.MAX_LENGTH'),
          patternValidator(
            PERSON_NAME_REGEX,
            'user.form.firstName.errors.INVALID',
          ),
          profanityValidator('user.form.firstName.errors.PROFANITY'),
        ],
      }),
      lastName: new FormControl('', {
        validators: [
          requiredValidator('user.form.lastName.errors.REQUIRED'),
          minLengthValidator(2, 'user.form.lastName.errors.MIN_LENGTH'),
          maxLengthValidator(50, 'user.form.lastName.errors.MAX_LENGTH'),
          patternValidator(
            PERSON_NAME_REGEX,
            'user.form.lastName.errors.INVALID',
          ),
          profanityValidator('user.form.lastName.errors.PROFANITY'),
        ],
      }),
      email: new FormControl('', {
        validators: [
          requiredValidator('user.form.email.errors.REQUIRED'),
          emailValidator('user.form.email.errors.INVALID'),
          profanityValidator('user.form.email.errors.PROFANITY'),
        ],
      }),
      changePassword: new FormControl(false, {
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' },
  );

  protected get userData(): UserProfileDto | null {
    return this.userService.loadedUser();
  }

  protected get showPasswordFields(): boolean {
    return this.form.controls.changePassword.value === true;
  }

  protected get disabled(): boolean {
    return this.form.invalid || !this.hasFormChanged();
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected onReset(): void {
    if (this.form.controls.passwords) {
      this.form.controls.passwords.reset();
    }

    this.fillFormWithDefaultValues();
  }

  protected onSubmit(): void {
    if (this.form.invalid || !this.userData) return;

    const updatedUserData: UpdateUserPayload = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
      ...(this.form.value.passwords?.password && {
        password: this.form.value.passwords.password,
      }),
    };

    if (!this.hasFormChanged()) return;

    this.loadingService.loadingOn();
    this.userService.updateUser(updatedUserData).subscribe({
      error: (error: ErrorResponse) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.code,
          'user',
        );
        this.toastrService.error(localeMessage);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
        this.closeDialog();
      },
    });
  }

  protected hasFormChanged(): boolean {
    if (!this.userData) return false;

    return !!(
      this.form.value.firstName !== this.userData.firstName ||
      this.form.value.lastName !== this.userData.lastName ||
      this.form.value.email !== this.userData.email ||
      this.form.value.passwords?.password
    );
  }

  private fillFormWithDefaultValues(): void {
    if (!this.userData) return;

    this.form.patchValue({
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      changePassword: false,
    });
  }

  private addPasswordsControl(): FormGroup<PasswordsForm> {
    return new FormGroup<PasswordsForm>({
      password: new FormControl('', {
        validators: [
          requiredValidator('user.form.password.errors.REQUIRED'),
          patternValidator(PASSWORD_REGEX, 'user.form.password.errors.INVALID'),
        ],
      }),
      confirmPassword: new FormControl('', {
        validators: [
          requiredValidator('user.form.confirmPassword.errors.REQUIRED'),
          equalValuesValidator(
            'password',
            'user.form.confirmPassword.errors.NOT_EQUAL',
          ),
        ],
      }),
    });
  }

  public ngOnInit(): void {
    this.fillFormWithDefaultValues();

    const changePasswordControl = this.form.get('changePassword');
    const subscription = changePasswordControl?.valueChanges.subscribe(
      (isChecked) => {
        if (isChecked) {
          this.form.addControl('passwords', this.addPasswordsControl());
        } else {
          this.form.removeControl('passwords');
        }
      },
    );

    this.destroyRef.onDestroy(() => subscription?.unsubscribe());
  }
}
