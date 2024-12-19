import { AbstractControl, ValidationErrors } from '@angular/forms';

export function usernameValidator(
  control: AbstractControl
): ValidationErrors | null {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;

  return usernameRegex.test(control.value) ? null : { invalidUsername: true };
}
