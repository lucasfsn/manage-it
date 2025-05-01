import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalService } from '@/app/core/services/confirm-modal.service';

@Component({
    selector: 'app-confirm-modal',
    imports: [MatIconModule, TranslateModule],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @ViewChild('modal') protected modal?: ElementRef;

  public constructor(private confirmModalService: ConfirmModalService) {}

  protected get message(): string | null {
    return this.confirmModalService.loadedMessage();
  }

  protected onConfirm(): void {
    this.confirmModalService.handleClick(true);
  }

  protected onCancel(): void {
    this.confirmModalService.handleClick(false);
  }

  @HostListener('document:click', ['$event.target'])
  public onBackdropClick(target: HTMLElement): void {
    if (this.modal && !this.modal.nativeElement.contains(target))
      this.onCancel();
  }
}
