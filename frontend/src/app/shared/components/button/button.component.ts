import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-button',
    imports: [CommonModule, RouterLink],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({ required: true }) public bgColor!: string;
  @Input({ required: true }) public textColor!: string;
  @Input({ required: true }) public hoverBgColor!: string;
  @Input() public customClass: string = '';
  @Input() public largeSize?: boolean;
  @Input() public routerLink?: string;
  @Output() public handleClick = new EventEmitter<void>();

  protected onClick(): void {
    this.handleClick.emit();
  }
}
