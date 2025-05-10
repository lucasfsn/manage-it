import { FormControlDirective } from '@/app/shared/components/form-controls/form-control.directive';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

type TextInputType = 'text' | 'email' | 'password';

@Component({
  selector: 'app-form-text-input-control',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-text-input-control.component.html',
  styleUrl: './form-text-input-control.component.scss',
})
export class FormTextInputControlComponent extends FormControlDirective {
  @Input() public type: TextInputType = 'text';
  @Input() public placeholder: string = '';
}
