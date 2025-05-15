import { AbstractControl, ValidationErrors } from '@angular/forms';

export function pattern(
  pattern: RegExp,
  message: string,
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null =>
    pattern.test(control.value) ? null : { invalidName: { message: message } };
}
