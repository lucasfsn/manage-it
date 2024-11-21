import { AbstractControl, ValidationErrors } from '@angular/forms';

export function usernameValidator(
  control: AbstractControl
): ValidationErrors | null {
  const usernameRegex =
    /^(?=(?:[^A-Za-z]*[A-Za-z]){2})(?![~`?!^*¨ˆ;@=$%{}\[\]|\\\/<>#“.,]*[~`?!^*¨ˆ;@=$%{}\[\]|\\\/<>#“.,])\S+(?: \S+){0,2}$/;

  return usernameRegex.test(control.value) ? null : { invalidUsername: true };
}
