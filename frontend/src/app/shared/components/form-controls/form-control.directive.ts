import { Directive, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class FormControlDirective {
  @Input({ required: true }) public identifier!: string;
  @Input({ required: true }) public control!: FormControl;
  @Input() public placeholder: string = '';
  @Input() public label: string | null = null;
  @Input() public errorMessage: string | null = null;
  @Input() public customClass: string = '';

  protected get isInvalid(): boolean {
    return this.control.dirty && this.control.touched && this.control.invalid;
  }
}
