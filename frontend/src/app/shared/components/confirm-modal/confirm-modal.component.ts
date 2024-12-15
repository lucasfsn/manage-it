import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModalService } from '../../../core/services/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  constructor(private confirmModalService: ConfirmModalService) {}

  protected get message(): string {
    return this.confirmModalService.getMessage();
  }

  protected onConfirm(): void {
    this.confirmModalService.handleClick(true);
  }

  protected onCancel(): void {
    this.confirmModalService.handleClick(false);
  }
}
