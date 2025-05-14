import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLength(length: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < length)
      return { minLength: { minLength: length, message: message } };

    return null;
  };
}
