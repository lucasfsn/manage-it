import { AbstractControl, ValidationErrors } from '@angular/forms';

export function patternValidator(
  pattern: RegExp,
  message: string,
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null =>
    pattern.test(control.value) ? null : { pattern: { message: message } };
}
