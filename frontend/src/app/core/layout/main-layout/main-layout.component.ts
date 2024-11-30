import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../features/services/auth.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet, SpinnerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  protected isLoading = signal(false);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) return;

    this.isLoading.set(true);
    this.authService.getUserByToken().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
