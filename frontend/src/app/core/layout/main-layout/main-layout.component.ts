import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ConfirmModalService } from '../../services/confirm-modal.service';
import { LoadingService } from '../../services/loading.service';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    SideBarComponent,
    RouterOutlet,
    SpinnerComponent,
    ConfirmModalComponent,
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
