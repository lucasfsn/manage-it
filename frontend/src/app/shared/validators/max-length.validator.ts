import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxLengthValidator(
  length: number,
  message: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length > length)
      return {
        maxLength: {
          maxLength: length,
          actualLength: control.value.length,
          message: message,
        },
      };

    return null;
  };
}
