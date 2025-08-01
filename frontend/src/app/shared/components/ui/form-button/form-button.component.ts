import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-button',
  imports: [CommonModule],
  templateUrl: './form-button.component.html',
  styleUrl: './form-button.component.scss',
})
export class FormButtonComponent {
  @Input() public type: 'submit' | 'reset' = 'submit';
  @Input() public customClass: string = '';
  @Input() public disabled: boolean = false;
  @Output() public handleClick = new EventEmitter<void>();

  protected onClick(): void {
    this.handleClick.emit();
  }
}
