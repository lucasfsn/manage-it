import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '@/app/core/layout/sidebar/sidebar.component';
import { ConfirmModalService } from '@/app/core/services/confirm-modal.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { ConfirmModalComponent } from '@/app/shared/components/confirm-modal/confirm-modal.component';
import { SpinnerComponent } from '@/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SpinnerComponent,
    ConfirmModalComponent,
    SidebarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  public constructor(
    private loadingService: LoadingService,
    private confirmModalService: ConfirmModalService,
  ) {}

  protected get message(): string | null {
    return this.confirmModalService.loadedMessage();
  }

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }
}
