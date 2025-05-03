import { UpdateUser, User } from '@/app/features/dto/user.model';
import { UserService } from '@/app/features/services/user.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import {
  equalValues,
  nameValidator,
  passwordValidator,
} from '@/app/shared/validators';
import { TranslateModule } from '@ngx-translate/core';

interface PasswordsForm {
  readonly password: FormControl<string | null>;
  readonly confirmPassword: FormControl<string | null>;
}

interface UserEditForm {
  readonly firstName: FormControl<string | null>;
  readonly lastName: FormControl<string | null>;
  readonly email: FormControl<string | null>;
  readonly passwords?: FormGroup<PasswordsForm>;
}

@Component({
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, MatIconModule, TranslateModule],
  templateUrl: './user-edit-form.component.html',
  styleUrl: './user-edit-form.component.scss',
})
export class UserEditFormComponent implements OnInit {
  protected showPasswordFields = false;

  public constructor(
    private dialogRef: MatDialogRef<UserEditFormComponent>,
    private userService: UserService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private mapperService: MapperService,
    private loadingService: LoadingService,
  ) {}

  protected get userData(): User | null {
    return this.userService.loadedUser();
  }

  protected form: FormGroup<UserEditForm> = new FormGroup<UserEditForm>(
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
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
    },
    { updateOn: 'blur' },
  );

  protected get disabled(): boolean {
    return this.form.invalid || !this.hasFormChanged();
  }

  protected get firstNameIsInvalid(): boolean {
    return (
      this.form.controls.firstName.dirty &&
      this.form.controls.firstName.touched &&
      this.form.controls.firstName.invalid
    );
  }

  protected get lastNameIsInvalid(): boolean {
    return (
      this.form.controls.lastName.dirty &&
      this.form.controls.lastName.touched &&
      this.form.controls.lastName.invalid
    );
  }

  protected get emailIsInvalid(): boolean {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  protected get passwordIsInvalid(): boolean {
    const control = this.form.controls.passwords?.get('password');

    return (control?.dirty && control.touched && control.invalid) || false;
  }

  protected get passwordsDoNotMatch(): boolean {
    return !!this.form.controls.passwords?.hasError('equalValues');
  }

  protected get firstNameErrors(): string | null {
    const control = this.form.controls.firstName;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate(
        'user.editForm.FIRST_NAME_REQUIRED',
      );

    if (control.errors['minlength'])
      return this.translationService.translate(
        'user.editForm.FIRST_NAME_MIN_LENGTH',
        { minLength: control.errors['minlength'].requiredLength },
      );

    if (control.errors['maxlength'])
      return this.translationService.translate(
        'user.editForm.FIRST_NAME_MAX_LENGTH',
        { maxLength: control.errors['maxlength'].requiredLength },
      );

    if (control.errors['invalidName'])
      return this.translationService.translate(
        'user.editForm.FIRST_NAME_INVALID',
      );

    return null;
  }

  protected get lastNameErrors(): string | null {
    const control = this.form.controls.lastName;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate(
        'user.editForm.LAST_NAME_REQUIRED',
      );

    if (control.errors['minlength'])
      return this.translationService.translate(
        'user.editForm.LAST_NAME_MIN_LENGTH',
        { minLength: control.errors['minlength'].requiredLength },
      );

    if (control.errors['maxlength'])
      return this.translationService.translate(
        'user.editForm.LAST_NAME_MAX_LENGTH',
        { maxLength: control.errors['maxlength'].requiredLength },
      );

    if (control.errors['invalidName'])
      return this.translationService.translate(
        'user.editForm.LAST_NAME_INVALID',
      );

    return null;
  }

  protected get emailErrors(): string | null {
    const control = this.form.controls.email;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate('user.editForm.EMAIL_REQUIRED');

    if (control.errors['email'])
      return this.translationService.translate('user.editForm.EMAIL_INVALID');

    return null;
  }

  protected get passwordErrors(): string | null {
    const control = this.form.controls.passwords?.get('password');
    if (!control?.errors) return null;

    if (control.errors['invalidPassword'])
      return this.translationService.translate(
        'user.editForm.PASSWORD_INVALID',
      );

    return null;
  }

  protected togglePasswordFields(event: Event): void {
    this.showPasswordFields = (event.target as HTMLInputElement).checked;

    if (!this.showPasswordFields) {
      this.form.removeControl('passwords');

      return;
    }

    this.form.addControl(
      'passwords',
      new FormGroup<PasswordsForm>(
        {
          password: new FormControl('', {
            validators: [Validators.required, passwordValidator],
          }),
          confirmPassword: new FormControl('', {
            validators: [Validators.required, passwordValidator],
          }),
        },
        {
          validators: [equalValues('password', 'confirmPassword')],
        },
      ),
    );
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

    const updatedUserData: UpdateUser = {
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
      error: () => {
        const localeMessage = this.mapperService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
    this.closeDialog();
  }

  private hasFormChanged(): boolean {
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
    });
  }

  public ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
