import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoadingService } from '../../../features/services/loading.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { HeaderComponent } from '../header/header.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet, SpinnerComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  public constructor(private loadingService: LoadingService) {}

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }
}
