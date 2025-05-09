import { Directive, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class FormControlDirective {
  @Input({ required: true }) public identifier!: string;
  @Input({ required: true }) public control!: FormControl;
  @Input() public label: string | null = null;
  @Input() public errorMessage: string | null = null;
  @Input() public customClass: string = '';
  @Input() public customIsInvalid: boolean | null = null;

  protected get isInvalid(): boolean {
    if (this.customIsInvalid !== null) return this.customIsInvalid;

    return this.control.dirty && this.control.touched && this.control.invalid;
  }
}
