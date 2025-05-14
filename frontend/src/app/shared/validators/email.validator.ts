import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function email(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const error = Validators.email(control);

    return error ? { email: { message: message } } : null;
  };
}
