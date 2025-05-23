import { Profanity } from '@2toad/profanity';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const profanity = new Profanity({
  languages: ['en', 'de'],
  wholeWord: false,
});

export function profanityValidator(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    return profanity.exists(control.value)
      ? { profanity: { message: message } }
      : null;
  };
}
