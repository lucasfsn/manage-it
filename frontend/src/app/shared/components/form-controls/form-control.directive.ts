import { TranslationService } from '@/app/core/services/translation.service';
import { Directive, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class FormControlDirective {
  @Input({ required: true }) public identifier!: string;
  @Input({ required: true }) public control!: FormControl;
  @Input() public label: string | null = null;
  @Input() public customClass: string = '';
  @Input() public customIsInvalid: boolean | null = null;

  public constructor(private translationService: TranslationService) {}

  protected get isInvalid(): boolean {
    if (this.customIsInvalid !== null) return this.customIsInvalid;

    return this.control.dirty && this.control.touched && this.control.invalid;
  }

  protected get error(): string | null {
    if (!this.control.errors) return null;

    const errorKey = Object.keys(this.control.errors)[0];
    const error = this.control.errors[errorKey];

    if (error && error.message)
      return this.translationService.translate(error.message, error);

    return null;
  }
}
