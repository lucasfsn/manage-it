import { FormControlDirective } from '@/app/shared/components/form-controls/form-control.directive';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-textarea-input-control',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-textarea-input-control.component.html',
  styleUrl: './form-textarea-input-control.component.scss',
})
export class FormTextareaInputControlComponent extends FormControlDirective {
  @Input() public placeholder: string = '';
  @Input() public maxLength: number | null = null;
}
